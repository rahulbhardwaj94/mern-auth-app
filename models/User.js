const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false, // Will be generated automatically
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  passwordRetryCount: {
    type: Number,
    default: 0,
  },
  lastPasswordAttempt: {
    type: Date,
    default: null,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  blockedUntil: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Generate unique userId before saving
userSchema.pre('save', async function(next) {
  if (!this.userId) {
    this.userId = 'USER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user is blocked
userSchema.methods.isUserBlocked = function() {
  if (!this.isBlocked) return false;
  
  if (this.blockedUntil && this.blockedUntil > new Date()) {
    return true;
  }
  
  // Unblock user if block time has passed
  this.isBlocked = false;
  this.blockedUntil = null;
  return false;
};

// Method to increment password retry count
userSchema.methods.incrementPasswordRetry = function() {
  this.passwordRetryCount += 1;
  this.lastPasswordAttempt = new Date();
  
  // Block user after 3 attempts for 3 hours
  if (this.passwordRetryCount >= 3) {
    this.isBlocked = true;
    this.blockedUntil = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 hours
  }
  
  return this.save();
};

// Method to reset password retry count
userSchema.methods.resetPasswordRetry = function() {
  this.passwordRetryCount = 0;
  this.lastPasswordAttempt = null;
  this.isBlocked = false;
  this.blockedUntil = null;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
