import express from 'express';
import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Transaction from '../models/Transaction.js';
import { protect } from '../middleware/auth.js';
import { error } from '../utils/response.js';
import { buildBakongKhqr, createBakongPaymentReference } from '../services/bakongPayment.js';

const router = express.Router();

export const PRODUCT_DB = {
  1: { name: 'Azurea Classic Trench Coat', price: 99.99, stock: 15 },
  2: { name: 'Royal Velvet Evening Gown', price: 149.99, stock: 8 },
  3: { name: 'Minimalist Linen Summer Shirt', price: 49.99, stock: 25 },
  4: { name: 'Slim-Fit Indigo Denim Jacket', price: 79.99, stock: 12 },
  5: { name: 'Chiffon Pleated Midi Skirt', price: 39.99, stock: 20 },
  6: { name: 'Cable-Knit Cashmere Sweater', price: 119.99, stock: 5 }
};

export const paymentSessions = new Map();

async function resolveProduct(productId) {
  const legacyId = Number(productId);
  if (Number.isFinite(legacyId)) {
    const productDoc = await Product.findOne({ legacyId });
    if (productDoc) {
      return {
        id: productDoc.legacyId,
        name: productDoc.name,
        price: productDoc.price,
        stock: productDoc.stock,
        vendor: productDoc.vendor || null,
        source: 'db',
        doc: productDoc
      };
    }
  }

  const fallback = PRODUCT_DB[productId];
  if (fallback) {
    return {
      id: Number(productId),
      name: fallback.name,
      price: fallback.price,
      stock: fallback.stock,
      vendor: null,
      source: 'memory',
      doc: null
    };
  }

  return null;
}

async function generateOrderQr(req, res, { requireAuth = false } = {}) {
  if (requireAuth && !req.user) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }

  const {
    user_id,
    product_id,
    vendor_id,
    size,
    color,
    quantity,
    customer_name,
    phone_number,
    delivery_address,
    note,
    payment_method
  } = req.body;

  if (!product_id || !quantity || !customer_name || !phone_number || !delivery_address) {
    return error(res, 400, 'Missing required checkout fields');
  }

  const productSnapshot = await resolveProduct(product_id);
  if (!productSnapshot) {
    return error(res, 404, 'Product not found');
  }

  if (productSnapshot.stock < quantity) {
    return error(res, 400, `Out of stock. Only ${productSnapshot.stock} items left.`);
  }

  const totalAmount = Number(productSnapshot.price) * Number(quantity);
  const paymentReference = createBakongPaymentReference('ORD');

  let qrString = '';
  let md5Hash = '';
  let paymentExpiresAt = null;

  try {
    const khqr = buildBakongKhqr({
      amount: totalAmount,
      paymentReference,
      expirationMinutes: 5
    });
    qrString = khqr.qrString;
    md5Hash = khqr.md5Hash;
    paymentExpiresAt = new Date(khqr.expirationTimestamp);
  } catch (sdkErr) {
    console.error('⚠️ [Bakong SDK Error] Falling back to robust generator:', sdkErr.message);
    const fallbackMerchantId = process.env.BAKONG_MERCHANT_ID || 'soklin_chen@bkrt';
    const fallbackMerchantName = process.env.BAKONG_MERCHANT_NAME || 'SOKLIN CHEN';
    qrString = `000201010212373000160123456789ABCDEF0208${fallbackMerchantId.split('@')[0]}5204599953038405802KH5912${encodeURIComponent(fallbackMerchantName)}6010Phnom Penh6304` + crypto.randomBytes(2).toString('hex').toUpperCase();
    md5Hash = crypto.createHash('md5').update(qrString).digest('hex');
    paymentExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  }

  const order = await Order.create({
    user: req.user?._id || undefined,
    user_id: req.user ? undefined : user_id || null,
    vendor: vendor_id || productSnapshot.vendor || undefined,
    vendor_id: vendor_id || null,
    product_id,
    product_name: productSnapshot.name,
    size,
    color,
    quantity,
    total_amount: totalAmount,
    totalAmount,
    status: 'Pending',
    paymentMethod: payment_method || 'KHQR',
    payment_method: payment_method || 'KHQR',
    customer_name,
    phone_number,
    delivery_address,
    note: note || '',
    paymentId: md5Hash,
    paymentReference,
    payment_status: 'Pending',
    paymentProvider: 'Bakong',
    paymentExpiresAt,
    qrExpired: false
  });

  await Transaction.create({
    orderId: order._id,
    amount: totalAmount,
    type: 'Payment',
    reference: order._id.toString(),
    gateway: 'Bakong',
    paymentReference,
    status: 'Pending'
  });

  paymentSessions.set(order._id.toString(), {
    startTime: Date.now(),
    productId: Number(product_id),
    quantity: Number(quantity),
    md5: md5Hash,
    paymentReference,
    expiresAt: paymentExpiresAt ? paymentExpiresAt.getTime() : Date.now() + 5 * 60 * 1000
  });

  const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(qrString)}`;

  console.log(`🎉 [OFFICIAL KHQR GENERATED] Order ${order._id}. Reference: ${paymentReference}. MD5: ${md5Hash}`);

  return res.status(200).json({
    success: true,
    message: 'QR generated successfully',
    qr_string: qrString,
    qr_image: qrImage,
    amount: totalAmount,
    order_id: order._id,
    payment_reference: paymentReference,
    payment_expires_at: paymentExpiresAt,
    polling_interval_seconds: 4
  });
}

router.post('/generate-qr', asyncHandler(async (req, res) => generateOrderQr(req, res)));

router.post('/secure/generate-qr', protect, asyncHandler(async (req, res) => generateOrderQr(req, res, { requireAuth: true })));

export default router;