import express from 'express';
import { register, login, getMe } from '../controllers/AuthController.js';
import { validate } from '../middleware/validate.js';
import Joi from 'joi';
import { protect } from '../middleware/auth.js';
import passport from 'passport';
import { signToken } from '../utils/jwt.js';

const router = express.Router();

const getFrontendBaseUrl = () => {
  return (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
};

const buildFrontendUrl = (pathname = '/', params = {}) => {
  const url = new URL(pathname, `${getFrontendBaseUrl()}/`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
};

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('User', 'Vendor', 'Admin')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);

// ==========================================
// GOOGLE OAUTH ENDPOINTS
// ==========================================
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: buildFrontendUrl('/login', { error: 'auth_failed', provider: 'google' }) }),
  (req, res) => {
    const token = signToken({ id: req.user._id, role: req.user.role });
    res.redirect(buildFrontendUrl('/', { token, provider: 'google' }));
  }
);

// ==========================================
// FACEBOOK OAUTH ENDPOINTS
// ==========================================
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: buildFrontendUrl('/login', { error: 'auth_failed', provider: 'facebook' }) }),
  (req, res) => {
    const token = signToken({ id: req.user._id, role: req.user.role });
    res.redirect(buildFrontendUrl('/', { token, provider: 'facebook' }));
  }
);

export default router;
