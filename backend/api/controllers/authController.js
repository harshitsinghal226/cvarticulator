const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const { sendResetEmail, sendOTPEmail } = require('../config/email');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Validation rules
const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required').escape(),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const loginValidation = [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
];

const forgotPasswordValidation = [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
];

const resetPasswordValidation = [
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const verifyOTPValidation = [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits').isNumeric().withMessage('OTP must be numeric'),
];

const resendOTPValidation = [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
];

// @desc   Register a new user
// @route  POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const { name, email, password, profileImageUrl } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists && userExists.isVerified) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate 6-digit numeric OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Hash OTP before saving
        const hashedOtp = crypto.createHash('sha256').update(otpCode).digest('hex');
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (userExists && !userExists.isVerified) {
            // Update unverified user
            userExists.name = name;
            userExists.password = hashedPassword;
            userExists.profileImageUrl = profileImageUrl || null;
            userExists.otp = hashedOtp;
            userExists.otpExpires = otpExpires;
            await userExists.save();
        } else {
            // Create user as unverified
            await User.create({
                name,
                email,
                password: hashedPassword,
                profileImageUrl: profileImageUrl || null,
                isVerified: false,
                otp: hashedOtp,
                otpExpires: otpExpires,
            });
        }

        // Send OTP email
        console.log(`[DEBUG] OTP for ${email}: ${otpCode}`);
        try {
            await sendOTPEmail(email, otpCode);
        } catch (emailError) {
            console.error("Failed to send signup OTP email:", emailError.message);
        }

        res.status(200).json({
            message: 'Verification code sent to your email. Please verify your account.',
            email,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                message: 'Please verify your email address before logging in.',
                email,
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Return user data with JWT
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// @desc   Get user profile
// @route  GET /api/auth/profile
// @access Private(Requires)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// @desc   Send password reset email
// @route  POST /api/auth/forgot-password
// @access Public
const forgotPassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const { email } = req.body;

        const user = await User.findOne({ email });

        // Always return success even if user not found (prevents email enumeration)
        if (!user) {
            return res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
        }

        // Generate a random reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash the token before storing in DB
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        // Send the unhashed token via email (user clicks link with this token)
        const clientUrl = req.get("origin") || req.get("referer") || process.env.CLIENT_URL;
        // Strip trailing slash if present on referer
        const sanitizedClientUrl = clientUrl ? clientUrl.replace(/\/$/, "") : "";
        await sendResetEmail(user.email, resetToken, sanitizedClientUrl);

        res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send reset email', error: error.message });
    }
}

// @desc   Reset password using token
// @route  POST /api/auth/reset-password/:token
// @access Public
const resetPassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        // Hash the token from the URL to compare with stored hash
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Hash new password and save
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);

        // Clear reset token fields
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.json({ message: 'Password reset successful. You can now log in.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to reset password', error: error.message });
    }
}

// @desc   Verify OTP for signup email confirmation
const verifyOTP = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }

        // Hash the input OTP and compare
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        if (user.otp !== hashedOtp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Activate user
        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Verification failed', error: error.message });
    }
};

// @desc   Resend verification OTP
const resendOTP = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }

        // Generate new OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = crypto.createHash('sha256').update(otpCode).digest('hex');

        user.otp = hashedOtp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        console.log(`[DEBUG] Resent OTP for ${email}: ${otpCode}`);
        try {
            await sendOTPEmail(email, otpCode);
        } catch (emailError) {
            console.error("Failed to send resend OTP email:", emailError.message);
        }

        res.status(200).json({ message: 'A new verification code has been sent to your email.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to resend OTP', error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    forgotPassword,
    resetPassword,
    verifyOTP,
    resendOTP,
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    verifyOTPValidation,
    resendOTPValidation,
};