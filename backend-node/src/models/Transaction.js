import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', index: true },
    fromWallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
    toWallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ['Transfer', 'TopUp', 'Refund', 'Payment'],
      required: true
    },
    reference: { type: String }, // e.g., orderId, paymentId
    gateway: { type: String, default: 'Bakong' },
    paymentReference: { type: String, index: true },
    bakongTransactionId: { type: String, index: true },
    bakongResponse: { type: mongoose.Schema.Types.Mixed },
    processedAt: { type: Date },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);
