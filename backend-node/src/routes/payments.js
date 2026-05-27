import express from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Transaction from '../models/Transaction.js';
import Wallet from '../models/Wallet.js';
import User from '../models/User.js';
import { PRODUCT_DB, paymentSessions } from './checkout.js';
import { verifyBakongPayment, normalizeBakongResponse } from '../services/bakongPayment.js';
import { verifyToken } from '../utils/jwt.js';

const router = express.Router();

async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifyToken(token);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
    }
  }

  next();
}

function getOrderAmount(order) {
  return Number(order.totalAmount ?? order.total_amount ?? 0);
}

async function resolveProduct(order) {
  const legacyId = Number(order.product_id);
  if (Number.isFinite(legacyId)) {
    const productDoc = await Product.findOne({ legacyId });
    if (productDoc) {
      return { source: 'db', doc: productDoc };
    }
  }

  if (PRODUCT_DB[order.product_id]) {
    return { source: 'memory', doc: null };
  }

  return null;
}

async function decrementProductStock(order, quantity, session) {
  const productSnapshot = await resolveProduct(order);
  if (!productSnapshot) {
    return;
  }

  if (productSnapshot.source === 'db' && productSnapshot.doc) {
    if (productSnapshot.doc.stock < quantity) {
      throw new Error('Insufficient product stock');
    }
    productSnapshot.doc.stock -= quantity;
    await productSnapshot.doc.save({ session });
    return;
  }

  if (productSnapshot.source === 'memory' && PRODUCT_DB[order.product_id]) {
    PRODUCT_DB[order.product_id].stock = Math.max(0, PRODUCT_DB[order.product_id].stock - quantity);
  }
}

async function creditVendorWallet(order, amount, session) {
  if (!order.vendor) {
    return;
  }

  await Wallet.findOneAndUpdate(
    { owner: order.vendor, ownerModel: 'Vendor' },
    { $inc: { balance: amount } },
    { new: true, upsert: true, session }
  );
}

async function finalizePayment(order, normalized, session) {
  const amount = getOrderAmount(order);
  const updatedOrder = await Order.findOneAndUpdate(
    {
      _id: order._id,
      status: 'Pending',
      payment_status: { $ne: 'Completed' },
      paymentId: order.paymentId
    },
    {
      $set: {
        status: 'Paid',
        payment_status: 'Completed',
        bakongTransactionId: normalized.bakongTransactionId,
        bakongResponse: normalized.raw,
        paidAt: new Date(),
        qrExpired: false,
        lastPaymentCheckAt: new Date()
      },
      $inc: { paymentCheckCount: 1 }
    },
    { new: true, session }
  );

  if (!updatedOrder) {
    return null;
  }

  await creditVendorWallet(updatedOrder, amount, session);
  await decrementProductStock(updatedOrder, Number(updatedOrder.quantity || 1), session);

  await Transaction.findOneAndUpdate(
    {
      reference: updatedOrder._id.toString(),
      type: 'Payment'
    },
    {
      $set: {
        status: 'Completed',
        amount,
        orderId: updatedOrder._id,
        paymentReference: updatedOrder.paymentReference,
        bakongTransactionId: normalized.bakongTransactionId,
        bakongResponse: normalized.raw,
        processedAt: new Date(),
        gateway: 'Bakong'
      }
    },
    { new: true, session }
  );

  return updatedOrder;
}

async function handleStatusCheck(req, res, { requireAuth = false } = {}) {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ success: false, paid: false, message: 'Order not found' });
  }

  if (requireAuth && !req.user) {
    return res.status(401).json({ success: false, paid: false, message: 'Not authorized' });
  }

  if (req.user) {
    const ownsOrder = (order.user && order.user.toString() === req.user._id.toString()) || order.user_id === req.user._id;
    const isAdmin = req.user.role === 'Admin';
    const isVendor = order.vendor && order.vendor.toString() === req.user._id.toString();

    if (!isAdmin && !ownsOrder && !isVendor) {
      return res.status(403).json({ success: false, paid: false, message: 'Forbidden' });
    }
  } else {
    const providedReference = req.headers['x-payment-reference'] || req.query.paymentReference;
    if (!providedReference || providedReference !== order.paymentReference) {
      return res.status(401).json({ success: false, paid: false, message: 'Not authorized' });
    }
  }

  if (order.status === 'Paid' || order.payment_status === 'Completed') {
    return res.json({ success: true, paid: true, status: 'Paid', message: 'Order Success' });
  }

  const now = Date.now();
  if (order.paymentExpiresAt && now > new Date(order.paymentExpiresAt).getTime() && order.payment_status !== 'Completed') {
    await Order.findByIdAndUpdate(order._id, {
      payment_status: 'Timeout',
      qrExpired: true,
      lastPaymentCheckAt: new Date(),
      $inc: { paymentCheckCount: 1 }
    });

    return res.json({ success: false, paid: false, status: 'Timeout', message: 'Payment Timeout' });
  }

  if (order.payment_status === 'Failed') {
    return res.json({ success: false, paid: false, status: 'Failed', message: 'Payment Failed' });
  }

  const md5Hash = order.paymentId;
  if (!md5Hash) {
    await Order.findByIdAndUpdate(order._id, {
      lastPaymentCheckAt: new Date(),
      $inc: { paymentCheckCount: 1 }
    });
    return res.json({ success: false, paid: false, status: 'Pending', message: 'Waiting for payment' });
  }

  const bakongResult = await verifyBakongPayment(md5Hash);
  if (!bakongResult) {
    await Order.findByIdAndUpdate(order._id, {
      lastPaymentCheckAt: new Date(),
      $inc: { paymentCheckCount: 1 }
    });
    return res.json({ success: false, paid: false, status: 'Pending', message: 'Waiting for payment' });
  }

  const normalized = normalizeBakongResponse(bakongResult, order.paymentReference);

  if (!normalized.referenceMatches) {
    console.warn(`⚠️ [BAKONG REFERENCE MISMATCH] Order ${orderId} expected ${order.paymentReference} but received ${normalized.resolvedReference}`);
    await Order.findByIdAndUpdate(order._id, {
      payment_status: 'Failed',
      bakongResponse: bakongResult,
      lastPaymentCheckAt: new Date(),
      $inc: { paymentCheckCount: 1 }
    });
    return res.status(400).json({ success: false, paid: false, status: 'Failed', message: 'Invalid payment reference' });
  }

  if (normalized.isFailed) {
    await Order.findByIdAndUpdate(order._id, {
      payment_status: 'Failed',
      bakongResponse: bakongResult,
      lastPaymentCheckAt: new Date(),
      $inc: { paymentCheckCount: 1 }
    });
    return res.json({ success: false, paid: false, status: 'Failed', message: 'Payment Failed' });
  }

  if (!normalized.isSuccess) {
    await Order.findByIdAndUpdate(order._id, {
      lastPaymentCheckAt: new Date(),
      payment_status: 'Pending',
      bakongResponse: bakongResult,
      $inc: { paymentCheckCount: 1 }
    });
    return res.json({ success: false, paid: false, status: 'Pending', message: 'Waiting for payment' });
  }

  let mongoSession = null;

  try {
    mongoSession = await mongoose.startSession();
    mongoSession.startTransaction();

    const fulfilledOrder = await finalizePayment(order, normalized, mongoSession);

    if (!fulfilledOrder) {
      await mongoSession.abortTransaction();
      mongoSession.endSession();

      const alreadyProcessed = await Order.findById(order._id);
      if (alreadyProcessed && (alreadyProcessed.status === 'Paid' || alreadyProcessed.payment_status === 'Completed')) {
        paymentSessions.delete(order._id.toString());
        return res.json({ success: true, paid: true, status: 'Paid', message: 'Order Success' });
      }

      return res.status(409).json({ success: false, paid: false, status: 'Pending', message: 'Payment already processed' });
    }

    await mongoSession.commitTransaction();
  } catch (sessionErr) {
    if (mongoSession) {
      try {
        await mongoSession.abortTransaction();
      } catch (_) {}
    }

    console.error('⚠️ [PAYMENT FULFILLMENT ERROR]', sessionErr.message);
    return res.status(500).json({ success: false, paid: false, message: 'Payment processing failed' });
  } finally {
    if (mongoSession) {
      mongoSession.endSession();
    }
  }

  paymentSessions.delete(order._id.toString());
  return res.json({ success: true, paid: true, status: 'Paid', message: 'Order Success' });
}

router.get('/status/:orderId', optionalAuth, asyncHandler(async (req, res) => handleStatusCheck(req, res)));

router.get('/secure/status/:orderId', optionalAuth, asyncHandler(async (req, res) => handleStatusCheck(req, res, { requireAuth: true })));

export default router;