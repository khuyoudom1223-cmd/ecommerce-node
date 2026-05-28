import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { 
      type: String, 
      required: function() { return this.provider === 'local'; }, 
      select: false 
    },
    provider: { type: String, required: true, enum: ['local', 'google', 'facebook'], default: 'local' },
    providerId: { type: String, required: function() { return this.provider !== 'local'; } },
    avatar: { type: String, default: '' },
    role: {
      type: String,
      enum: ['Admin', 'User', 'Vendor'],
      default: 'User'
    },
    balance: { type: Number, default: 0, min: 0 },
    // additional fields (address, phone) can be added here
  },
  { timestamps: true }
);

// hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model('User', userSchema);
