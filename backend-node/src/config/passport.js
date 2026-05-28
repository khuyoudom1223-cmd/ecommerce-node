import 'dotenv/config';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/User.js';

const requireEnv = (name) => {
  const value = process.env[name]?.trim();
  const placeholderPattern = /^your-|^mock_/i;
  if (!value || placeholderPattern.test(value)) {
    throw new Error(`${name} is required for OAuth login. Set it in backend-node/.env before starting the server.`);
  }
  return value;
};

const googleClientID = requireEnv('GOOGLE_CLIENT_ID');
const googleClientSecret = requireEnv('GOOGLE_CLIENT_SECRET');
const googleCallbackURL = requireEnv('GOOGLE_CALLBACK_URL');

const facebookAppID = requireEnv('FACEBOOK_APP_ID');
const facebookAppSecret = requireEnv('FACEBOOK_APP_SECRET');
const facebookCallbackURL = requireEnv('FACEBOOK_CALLBACK_URL');

// --- GOOGLE STRATEGY ---
passport.use(new GoogleStrategy({
  clientID: googleClientID,
  clientSecret: googleClientSecret,
  callbackURL: googleCallbackURL,
  profileFields: ['id', 'emails', 'name', 'photos']
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      return done(new Error('Email is required from Google profile to authenticate.'), null);
    }
    const avatar = profile.photos?.[0]?.value || '';
    const name = `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim() || profile.displayName;

    let user = await User.findOne({ email });

    if (user) {
      if (user.provider === 'local') {
        user.provider = 'google';
        user.providerId = profile.id;
        user.avatar = user.avatar || avatar;
        await user.save();
      }
      return done(null, user);
    }

    user = await User.create({
      name,
      email,
      provider: 'google',
      providerId: profile.id,
      avatar,
      role: 'User'
    });

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// --- FACEBOOK STRATEGY ---
passport.use(new FacebookStrategy({
  clientID: facebookAppID,
  clientSecret: facebookAppSecret,
  callbackURL: facebookCallbackURL,
  profileFields: ['id', 'emails', 'name', 'picture.type(large)']
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value || `${profile.id}@facebook.com`;
    const avatar = profile.photos?.[0]?.value || '';
    const name = `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim() || profile.displayName;

    let user = await User.findOne({ email });

    if (user) {
      if (user.provider === 'local') {
        user.provider = 'facebook';
        user.providerId = profile.id;
        user.avatar = user.avatar || avatar;
        await user.save();
      }
      return done(null, user);
    }

    user = await User.create({
      name,
      email,
      provider: 'facebook',
      providerId: profile.id,
      avatar,
      role: 'User'
    });

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

export default passport;
