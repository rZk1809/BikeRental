import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import './ForgotPassword.css';
const ForgotPassword = () => {
    const { axios } = useAppContext();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await axios.post('/api/auth/forgot-password', { email });
            
            if (data.success) {
                setEmailSent(true);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    if (emailSent) {
        return (
            <div className="forgot-password-page">
                <div className="forgot-password-container">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="forgot-password-card"
                    >
                        <div className="success-state">
                            <div className="success-icon">📧</div>
                            <h2>Check Your Email</h2>
                            <p>
                                We've sent a password reset link to <strong>{email}</strong>. 
                                Please check your email and follow the instructions to reset your password.
                            </p>
                            <div className="email-tips">
                                <h3>Didn't receive the email?</h3>
                                <ul>
                                    <li>Check your spam/junk folder</li>
                                    <li>Make sure you entered the correct email address</li>
                                    <li>Wait a few minutes for the email to arrive</li>
                                </ul>
                            </div>
                            <div className="action-buttons">
                                <button 
                                    onClick={() => setEmailSent(false)}
                                    className="btn btn-secondary"
                                >
                                    Try Different Email
                                </button>
                                <button 
                                    onClick={() => navigate('/')}
                                    className="btn btn-primary"
                                >
                                    Back to Homepage
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }
    return (
        <div className="forgot-password-page">
            <div className="forgot-password-container">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="forgot-password-card"
                >
                    <div className="forgot-password-header">
                        <h2>Forgot Password?</h2>
                        <p>Enter your email address and we'll send you a link to reset your password.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="forgot-password-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="btn btn-primary"
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                    <div className="forgot-password-footer">
                        <p>
                            Remember your password? 
                            <button 
                                type="button"
                                onClick={() => navigate('/')}
                                className="link-button"
                            >
                                Back to Login
                            </button>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
export default ForgotPassword;