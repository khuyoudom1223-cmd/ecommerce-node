import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const SEED_PRODUCTS = [
  {
    legacyId: 1,
    name: "Azurea Classic Trench Coat",
    sku: "AZ-TC-001",
    brand: "Azurea",
    category: "Coats",
    description: "Wrap yourself in absolute luxury. Crafted from water-resistant premium cotton gabardine, this classic trench coat features double-breasted closure, adjustable belt, and signature storm flaps. The deep sapphire blue tone provides an ultra-modern alternative to the traditional tan.",
    price: 99.99,
    discountPrice: 99.99,
    stock: 15,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "White", "Black"],
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
    reviews: []
  },
  {
    legacyId: 2,
    name: "Royal Velvet Evening Gown",
    sku: "AZ-VG-002",
    brand: "Azurea",
    category: "Dresses",
    description: "Make an unforgettable entrance. This exquisite evening gown is made from ultra-soft stretch velvet that contours the body beautifully. Features a subtle off-the-shoulder neckline, thigh-high slit, and an elegant sweeping train. Perfect for black-tie events.",
    price: 149.99,
    discountPrice: 149.99,
    stock: 8,
    sizes: ["S", "M", "L"],
    colors: ["Blue", "Red"],
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    reviews: []
  },
  {
    legacyId: 3,
    name: "Minimalist Linen Summer Shirt",
    sku: "AZ-LS-003",
    brand: "Modernist",
    category: "Shirts",
    description: "Breathe easy in premium European linen. Cut in a relaxed silhouette, this lightweight shirt is perfect for warm summer days and beach side evenings. Featuring a clean band collar, buttoned cuffs, and rounded hem.",
    price: 49.99,
    discountPrice: 49.99,
    stock: 25,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Blue", "Green"],
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop",
    rating: 4.5,
    reviews: []
  },
  {
    legacyId: 4,
    name: "Slim-Fit Indigo Denim Jacket",
    sku: "AZ-DJ-004",
    brand: "DenimCo",
    category: "Jackets",
    description: "A timeless wardrobe staple with a contemporary cut. Made from durable 12oz indigo denim with a hint of stretch for active comfort. Features classic point collar, chest button-flap pockets, and adjustable waist tabs.",
    price: 79.99,
    discountPrice: 79.99,
    stock: 12,
    sizes: ["M", "L", "XL"],
    colors: ["Blue", "Black"],
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=600&auto=format&fit=crop",
    rating: 4.7,
    reviews: []
  },
  {
    legacyId: 5,
    name: "Chiffon Pleated Midi Skirt",
    sku: "AZ-MS-005",
    brand: "Azurea",
    category: "Skirts",
    description: "Add a touch of feminine elegance to your daily rotation. This pleated midi skirt is crafted from lightweight georgette chiffon that moves gracefully with every step. Features a comfortable elasticated waistband and smooth inner lining.",
    price: 39.99,
    discountPrice: 39.99,
    stock: 20,
    sizes: ["S", "M", "L"],
    colors: ["White", "Blue"],
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop",
    rating: 4.6,
    reviews: []
  },
  {
    legacyId: 6,
    name: "Cable-Knit Cashmere Sweater",
    sku: "AZ-CS-006",
    brand: "CozyLux",
    category: "Knitwear",
    description: "Indulge in unparalleled softness. Spun from 100% fine Mongolian cashmere, this heavy cable-knit sweater delivers superior insulation and timeless style. Finished with chunky ribbed mock neck, cuffs, and hem.",
    price: 119.99,
    discountPrice: 119.99,
    stock: 5,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Blue"],
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    reviews: []
  }
];

// Helper to seed database if empty
async function seedIfEmpty() {
  const count = await Product.countDocuments();
  if (count === 0) {
    console.log('🌱 Seeding products collection to MongoDB...');
    await Product.insertMany(SEED_PRODUCTS);
    console.log('✅ Products seeded successfully.');
  }
}

// GET all products (seeds first if empty)
router.get('/', asyncHandler(async (req, res) => {
  await seedIfEmpty();
  const dbProducts = await Product.find().sort({ createdAt: -1 });
  
  // Format items nicely for the frontend expectations
  const formatted = dbProducts.map(p => ({
    id: p.legacyId,
    name: p.name,
    sku: p.sku,
    category: p.category,
    price: p.price,
    discountPrice: p.discountPrice,
    stock: p.stock,
    description: p.description,
    brand: p.brand || 'DOM Studio',
    image: p.image,
    rating: p.rating || 5.0,
    sizes: p.sizes && p.sizes.length > 0 ? p.sizes : ['S', 'M', 'L', 'XL'],
    colors: p.colors && p.colors.length > 0 ? p.colors : ['Blue', 'White', 'Black'],
    reviews: p.reviews || [],
    _id: p._id
  }));

  res.json({ success: true, products: formatted });
}));

// POST add a new product
router.post('/', protect, asyncHandler(async (req, res) => {
  const {
    name,
    sku,
    category,
    price,
    discountPrice,
    stock,
    description,
    brand,
    image,
    sizes,
    colors
  } = req.body;

  if (!name || !sku || price === undefined || stock === undefined) {
    return res.status(400).json({ success: false, message: 'Missing required product fields' });
  }

  // Find next legacyId
  const maxProd = await Product.findOne().sort({ legacyId: -1 });
  const nextLegacyId = maxProd && maxProd.legacyId ? maxProd.legacyId + 1 : 7;

  const newProduct = new Product({
    legacyId: nextLegacyId,
    name,
    sku,
    category,
    price: Number(price),
    discountPrice: discountPrice ? Number(discountPrice) : null,
    stock: Number(stock),
    description: description || `${name} premium ${category || 'apparel'} collection.`,
    brand: brand || 'DOM Studio',
    image: image || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600',
    sizes: sizes || ['S', 'M', 'L', 'XL'],
    colors: colors || ['Blue', 'White', 'Black'],
    reviews: [],
    vendor: req.user.vendorId || req.user._id // Bind to vendor if available
  });

  const savedProduct = await newProduct.save();

  // Return the newly created item structured for the frontend
  res.status(201).json({
    success: true,
    message: 'Product saved to database successfully',
    product: {
      id: savedProduct.legacyId,
      name: savedProduct.name,
      sku: savedProduct.sku,
      category: savedProduct.category,
      price: savedProduct.price,
      discountPrice: savedProduct.discountPrice,
      stock: savedProduct.stock,
      description: savedProduct.description,
      brand: savedProduct.brand,
      image: savedProduct.image,
      rating: savedProduct.rating,
      sizes: savedProduct.sizes,
      colors: savedProduct.colors,
      reviews: savedProduct.reviews,
      _id: savedProduct._id
    }
  });
}));

export default router;
