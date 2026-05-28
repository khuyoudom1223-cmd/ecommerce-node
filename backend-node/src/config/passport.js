import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/User.js';

// --- GOOGLE STRATEGY ---
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || 'mock_google_id',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock_google_secret',
  callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/api/auth/google/callback',
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
  clientID: process.env.FACEBOOK_APP_ID || 'mock_facebook_id',
  clientSecret: process.env.FACEBOOK_APP_SECRET || 'mock_facebook_secret',
  callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:4000/api/auth/facebook/callback',
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
