import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import {
    generateVerificationToken,
    generatePasswordResetToken,
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendWelcomeEmail
} from '../services/emailService.js';

const authRouter = express.Router();

// Register with email verification
authRouter.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Generate verification token
        const verificationToken = generateVerificationToken();
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires,
            authProvider: 'local'
        });

        // Send verification email
        const emailSent = await sendVerificationEmail(email, name, verificationToken);
        
        if (!emailSent) {
            return res.json({ 
                success: false, 
                message: "User created but failed to send verification email. Please contact support." 
            });
        }

        res.json({ 
            success: true, 
            message: "Registration successful! Please check your email to verify your account.",
            requiresVerification: true
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.json({ success: false, message: "Server error" });
    }
});

// Verify email
authRouter.post('/verify-email', async (req, res) => {
    try {
        const { token } = req.body;

        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.json({ 
                success: false, 
                message: "Invalid or expired verification token" 
            });
        }

        // Update user
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        // Send welcome email
        await sendWelcomeEmail(user.email, user.name);

        // Generate JWT token
        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ 
            success: true, 
            message: "Email verified successfully! Welcome to BikeRent!",
            token: jwtToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified
            }
        });

    } catch (error) {
        console.error('Email verification error:', error);
        res.json({ success: false, message: "Server error" });
    }
});

// Resend verification email
authRouter.post('/resend-verification', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email, isEmailVerified: false });
        if (!user) {
            return res.json({ 
                success: false, 
                message: "User not found or already verified" 
            });
        }

        // Generate new verification token
        const verificationToken = generateVerificationToken();
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        user.emailVerificationToken = verificationToken;
        user.emailVerificationExpires = verificationExpires;
        await user.save();

        // Send verification email
        const emailSent = await sendVerificationEmail(email, user.name, verificationToken);
        
        if (!emailSent) {
            return res.json({ 
                success: false, 
                message: "Failed to send verification email. Please try again." 
            });
        }

        res.json({ 
            success: true, 
            message: "Verification email sent successfully!" 
        });

    } catch (error) {
        console.error('Resend verification error:', error);
        res.json({ success: false, message: "Server error" });
    }
});

// Login with email verification check
authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        // Check if email is verified (only for local auth)
        if (user.authProvider === 'local' && !user.isEmailVerified) {
            return res.json({ 
                success: false, 
                message: "Please verify your email before logging in",
                requiresVerification: true,
                email: email
            });
        }

        // Check password (skip for Google users)
        if (user.authProvider === 'local') {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.json({ success: false, message: "Invalid credentials" });
            }
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ 
            success: true, 
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.json({ success: false, message: "Server error" });
    }
});

// Forgot password
authRouter.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ 
                success: false, 
                message: "No account found with this email address" 
            });
        }

        // Check if user uses Google auth
        if (user.authProvider === 'google') {
            return res.json({ 
                success: false, 
                message: "This account uses Google authentication. Please sign in with Google." 
            });
        }

        // Generate reset token
        const resetToken = generatePasswordResetToken();
        const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        user.passwordResetToken = resetToken;
        user.passwordResetExpires = resetExpires;
        await user.save();

        // Send reset email
        const emailSent = await sendPasswordResetEmail(email, user.name, resetToken);
        
        if (!emailSent) {
            return res.json({ 
                success: false, 
                message: "Failed to send password reset email. Please try again." 
            });
        }

        res.json({ 
            success: true, 
            message: "Password reset email sent successfully!" 
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.json({ success: false, message: "Server error" });
    }
});

// Reset password
authRouter.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.json({ 
                success: false, 
                message: "Invalid or expired reset token" 
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user
        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.json({ 
            success: true, 
            message: "Password reset successfully! You can now login with your new password." 
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.json({ success: false, message: "Server error" });
    }
});



// Test endpoint to check database connection
authRouter.get('/test', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        res.json({
            success: true,
            message: 'Database connected',
            userCount,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Database connection failed',
            error: error.message
        });
    }
});

export default authRouter;
