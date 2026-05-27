import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    legacyId: {
      type: Number,
      unique: true,
      index: true
    },
    name: {
      type: String,
      trim: true
    },
    sku: {
      type: String,
      index: true
    },
    price: {
      type: Number,
      min: 0,
      default: 0
    },
    stock: {
      type: Number,
      min: 0,
      default: 0
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);