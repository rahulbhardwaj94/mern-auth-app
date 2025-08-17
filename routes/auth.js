const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const emailService = require('../services/emailService');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '24h',
  });
};

// Send OTP
router.post('/send-otp', [
  body('email').isEmail().normalizeEmail(),
  body('firstName').trim().isLength({ min: 2, max: 50 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, firstName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isEmailVerified) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Delete existing OTP for this email
    await OTP.deleteMany({ email });

    // Generate and save new OTP
    const otp = await OTP.createOTP(email, 10); // 10 minutes expiry

    // Send OTP email
    await emailService.sendOTPEmail(email, otp.otp, firstName);

    res.json({ 
      message: 'OTP sent successfully',
      email: email 
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP and complete signup
router.post('/verify-otp', [
  body('email').isEmail().normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }),
  body('firstName').trim().isLength({ min: 2, max: 50 }),
  body('lastName').trim().isLength({ min: 2, max: 50 }),
  body('mobileNumber').trim().isLength({ min: 10, max: 15 }),
  body('password').isLength({ min: 6 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp, firstName, lastName, mobileNumber, password } = req.body;

    // Find and verify OTP
    const otpRecord = await OTP.findOne({ 
      email, 
      otp, 
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      // Update existing user
      user.firstName = firstName;
      user.lastName = lastName;
      user.mobileNumber = mobileNumber;
      user.password = password;
      user.isEmailVerified = true;
    } else {
      // Create new user
      user = new User({
        firstName,
        lastName,
        email,
        mobileNumber,
        password,
        isEmailVerified: true,
      });
    }

    await user.save();

    // Mark OTP as used
    await otpRecord.markAsUsed();

    // Generate JWT token
    const token = generateToken(user.userId);

    res.json({
      message: 'User registered successfully',
      token,
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if user is blocked
    if (user.isUserBlocked()) {
      return res.status(403).json({ 
        message: 'Account is temporarily blocked due to too many failed login attempts. Please try again after 3 hours.' 
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(400).json({ message: 'Please verify your email first' });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Increment password retry count
      await user.incrementPasswordRetry();
      
      if (user.isBlocked) {
        return res.status(403).json({ 
          message: 'Too many attempts. Please try again after 3 hours.' 
        });
      }
      
      return res.status(400).json({ 
        message: `Invalid email or password. ${3 - user.passwordRetryCount} attempts remaining.` 
      });
    }

    // Reset password retry count on successful login
    await user.resetPasswordRetry();

    // Generate JWT token
    const token = generateToken(user.userId);

    res.json({
      message: 'Login successful',
      token,
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;
