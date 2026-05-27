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
      trim: true,
      required: true
    },
    sku: {
      type: String,
      index: true,
      required: true
    },
    category: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
      required: true
    },
    discountPrice: {
      type: Number,
      min: 0,
      default: null
    },
    stock: {
      type: Number,
      min: 0,
      default: 0,
      required: true
    },
    description: {
      type: String,
      trim: true
    },
    brand: {
      type: String,
      default: 'DOM Studio'
    },
    image: {
      type: String
    },
    rating: {
      type: Number,
      default: 5.0
    },
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL']
    },
    colors: {
      type: [String],
      default: ['Blue', 'White', 'Black']
    },
    reviews: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);