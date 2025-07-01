import nodemailer from 'nodemailer';
import crypto from 'crypto';

const createTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('Email credentials not provided - emails will be logged to console');
        return null;
    }

    try {
        return nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            secure: false, 
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            headers: {
                'X-Brevo-Tags': 'verification',
                'X-Brevo-Disable-Tracking': 'true' 
            }
        });
    } catch (error) {
        console.error('Error creating email transporter:', error);
        return null;
    }
};

export const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

export const generatePasswordResetToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

export const sendVerificationEmail = async (email, name, token) => {
    const transporter = createTransporter();

    const backendUrl = process.env.BACKEND_URL || 'https://backend-bnq7.onrender.com';
    const verificationUrl = `${backendUrl}/api/auth/verify-email/${token}`;

    if (!transporter) {
        console.log('\n=== EMAIL VERIFICATION (Development Mode) ===');
        console.log(`To: ${email}`);
        console.log(`Name: ${name}`);
        console.log(`Verification URL: ${verificationUrl}`);
        console.log('=== Copy the URL above to verify your email ===\n');
        return true; 
    }

    const mailOptions = {
        from: {
            name: 'BikeRent',
            address: 'rgk1809@gmail.com' 
        },
        to: email,
        subject: 'Verify Your Email - BikeRent',
        headers: {
            'X-Brevo-Tags': 'verification',
            'X-Brevo-Disable-Tracking': 'true'
        },
        text: `
Hi ${name}!

Thank you for signing up with BikeRent!

To complete your registration, please click this link to verify your email:
${verificationUrl}

Or copy and paste this URL into your browser:
${verificationUrl}

This verification link will expire in 24 hours.

Best regards,
BikeRent Team
        `,
        html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #1f2937; color: #f9fafb; border-radius: 12px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #FF5722, #E64A19); padding: 2rem; text-align: center;">
                    <h1 style="margin: 0; color: white; font-size: 2rem;">🚴 BikeRent</h1>
                    <p style="margin: 0.5rem 0 0 0; color: rgba(255,255,255,0.9);">Welcome to the adventure!</p>
                </div>

                <div style="padding: 2rem;">
                    <h2 style="color: #FF5722; margin-bottom: 1rem;">Hi ${name}!</h2>
                    <p style="line-height: 1.6; margin-bottom: 1.5rem;">
                        Thank you for signing up with BikeRent! To complete your registration and start exploring our amazing bikes, please verify your email address.
                    </p>

                    <div style="text-align: center; margin: 2rem 0;">
                        <a href="${verificationUrl}"
                           style="background-color: #FF5722; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                            Verify Email Address
                        </a>
                    </div>

                    <p style="font-size: 0.9rem; color: #9ca3af; margin-bottom: 1rem;">
                        If the button doesn't work, copy and paste this link into your browser:
                    </p>
                    <p style="word-break: break-all; background-color: #374151; padding: 1rem; border-radius: 6px; font-family: monospace; font-size: 0.8rem;">
                        ${verificationUrl}
                    </p>

                    <div style="border-top: 1px solid #374151; margin-top: 2rem; padding-top: 1rem;">
                        <p style="font-size: 0.8rem; color: #9ca3af; margin: 0;">
                            This verification link will expire in 24 hours. If you didn't create an account with BikeRent, please ignore this email.
                        </p>
                    </div>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending verification email:', error);
        return false;
    }
};

export const sendPasswordResetEmail = async (email, name, token) => {
    const transporter = createTransporter();

    const frontendUrl = process.env.FRONTEND_URL.replace(/\/$/, ''); 
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    if (!transporter) {
        console.log('\n=== PASSWORD RESET (Development Mode) ===');
        console.log(`To: ${email}`);
        console.log(`Name: ${name}`);
        console.log(`Reset URL: ${resetUrl}`);
        console.log('=== Copy the URL above to reset your password ===\n');
        return true; 
    }

    const mailOptions = {
        from: {
            name: 'BikeRent',
            address: 'rgk1809@gmail.com'
        },
        to: email,
        subject: 'Reset Your Password - BikeRent',
        html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #1f2937; color: #f9fafb; border-radius: 12px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #FF5722, #E64A19); padding: 2rem; text-align: center;">
                    <h1 style="margin: 0; color: white; font-size: 2rem;">🚴 BikeRent</h1>
                    <p style="margin: 0.5rem 0 0 0; color: rgba(255,255,255,0.9);">Password Reset Request</p>
                </div>
                
                <div style="padding: 2rem;">
                    <h2 style="color: #FF5722; margin-bottom: 1rem;">Hi ${name}!</h2>
                    <p style="line-height: 1.6; margin-bottom: 1.5rem;">
                        We received a request to reset your password for your BikeRent account. Click the button below to create a new password.
                    </p>
                    
                    <div style="text-align: center; margin: 2rem 0;">
                        <a href="${resetUrl}" 
                           style="background-color: #FF5722; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    
                    <p style="font-size: 0.9rem; color: #9ca3af; margin-bottom: 1rem;">
                        If the button doesn't work, copy and paste this link into your browser:
                    </p>
                    <p style="word-break: break-all; background-color: #374151; padding: 1rem; border-radius: 6px; font-family: monospace; font-size: 0.8rem;">
                        ${resetUrl}
                    </p>
                    
                    <div style="border-top: 1px solid #374151; margin-top: 2rem; padding-top: 1rem;">
                        <p style="font-size: 0.8rem; color: #9ca3af; margin: 0;">
                            This password reset link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
                        </p>
                    </div>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return false;
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const transporter = createTransporter();

    if (!transporter) {
        console.log('\n=== WELCOME EMAIL (Development Mode) ===');
        console.log(`To: ${email}`);
        console.log(`Welcome ${name}! Your email has been verified successfully.`);
        console.log('=== Welcome to BikeRent! ===\n');
        return true; 
    }

    const mailOptions = {
        from: {
            name: 'BikeRent',
            address: 'rgk1809@gmail.com'
        },
        to: email,
        subject: 'Welcome to BikeRent! 🚴‍♂️',
        html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #1f2937; color: #f9fafb; border-radius: 12px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #FF5722, #E64A19); padding: 2rem; text-align: center;">
                    <h1 style="margin: 0; color: white; font-size: 2rem;">🚴 BikeRent</h1>
                    <p style="margin: 0.5rem 0 0 0; color: rgba(255,255,255,0.9);">Welcome aboard!</p>
                </div>
                
                <div style="padding: 2rem;">
                    <h2 style="color: #FF5722; margin-bottom: 1rem;">Welcome ${name}!</h2>
                    <p style="line-height: 1.6; margin-bottom: 1.5rem;">
                        Your email has been verified successfully! You're now ready to explore our amazing collection of bikes and start your next adventure.
                    </p>
                    
                    <div style="background-color: #374151; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0;">
                        <h3 style="color: #FF5722; margin-top: 0;">What's next?</h3>
                        <ul style="line-height: 1.8; padding-left: 1.5rem;">
                            <li>Browse our diverse collection of bikes</li>
                            <li>Find the perfect bike for your adventure</li>
                            <li>Book instantly with our easy booking system</li>
                            <li>Enjoy your ride with confidence</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin: 2rem 0;">
                        <a href="${process.env.FRONTEND_URL.replace(/\/$/, '')}/bikes"
                           style="background-color: #FF5722; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                            Start Exploring Bikes
                        </a>
                    </div>
                    
                    <div style="border-top: 1px solid #374151; margin-top: 2rem; padding-top: 1rem;">
                        <p style="font-size: 0.8rem; color: #9ca3af; margin: 0; text-align: center;">
                            Need help? Contact us at support@bikerent.com
                        </p>
                    </div>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return false;
    }
};
