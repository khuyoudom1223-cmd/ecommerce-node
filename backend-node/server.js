import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'express-async-errors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';
import connectDB from './src/config/database.js';
import errorHandler from './src/middleware/errorHandler.js';

// Load env variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Ensure uploads folder exists
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads', { recursive: true });
}

// Global middlewares
app.use(cors());
app.use(express.json());

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer config for image uploading
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and WEBP are supported.'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Image Upload Endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const imageUrl = `${protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({
    success: true,
    message: 'File uploaded successfully',
    url: imageUrl
  });
});

// Request logger middleware
app.use((req, res, next) => {
  console.log(`📡 [${req.method}] ${req.url} - Body:`, req.body);
  next();
});

// Connect to MongoDB
await connectDB();

// Import routers (keep same URL structure as Laravel)
import authRouter from './src/routes/auth.js';
import userRouter from './src/routes/users.js';
import vendorRouter from './src/routes/vendors.js';
import walletRouter from './src/routes/wallet.js';
import paymentRouter from './src/routes/payments.js';
import orderRouter from './src/routes/orders.js';
import checkoutRouter from './src/routes/checkout.js';
import bakongRouter from './src/routes/bakong.js';
import productsRouter from './src/routes/products.js';

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/vendors', vendorRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/orders', orderRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/products', productsRouter);
app.use('/api/wallet', bakongRouter);  // Bakong KHQR check-payment

// Simple health check endpoint
app.get('/api/health', (req, res) => res.json({ success: true, message: 'API is up' }));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Central error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
