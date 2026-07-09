const express = require('express');
const {
    registerUser, loginUser, getUserProfile,
    forgotPassword, resetPassword, verifyOTP, resendOTP,
    registerValidation, loginValidation,
    forgotPasswordValidation, resetPasswordValidation,
    verifyOTPValidation, resendOTPValidation,
} = require('../controllers/authController');
const { protect } = require('../../middlewares/authMiddleware');
const upload = require('../../middlewares/uploadMiddleware');

const router = express.Router();

// Auth Routes
router.post("/register", registerValidation, registerUser); // Register user
router.post("/login", loginValidation, loginUser);           // Login user
router.get("/profile", protect, getUserProfile); // Get user profile
router.post("/forgot-password", forgotPasswordValidation, forgotPassword); // Forgot password
router.post("/reset-password/:token", resetPasswordValidation, resetPassword); // Reset password
router.post("/verify-otp", verifyOTPValidation, verifyOTP); // Verify OTP
router.post("/resend-otp", resendOTPValidation, resendOTP); // Resend OTP

router.post("/upload-image", protect, upload.single("image"), (req, res) => {
    if(!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    // multer-storage-cloudinary stores the URL in req.file.path
    const imageUrl = req.file.path;
    res.status(200).json({ imageUrl });
});

module.exports = router;