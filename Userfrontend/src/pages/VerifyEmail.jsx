import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import './VerifyEmail.css';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const { axios, login } = useAppContext();
    const navigate = useNavigate();
    const [verificationStatus, setVerificationStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');
    const [resendEmail, setResendEmail] = useState('');
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        const token = searchParams.get('token');
        console.log('Token from URL:', token); // Debug log

        if (token) {
            verifyEmail(token);
        } else {
            setVerificationStatus('error');
            setMessage('Invalid verification link');
        }
    }, [searchParams]);

    const verifyEmail = async (token) => {
        try {
            console.log('Sending verification request with token:', token); // Debug log
            const { data } = await axios.post('/api/auth/verify-email', { token });
            console.log('Verification response:', data); // Debug log

            if (data.success) {
                setVerificationStatus('success');
                setMessage(data.message);

                // Auto login the user
                if (data.token) {
                    login(data.token);
                    setTimeout(() => {
                        navigate('/');
                    }, 3000);
                }
            } else {
                setVerificationStatus('error');
                setMessage(data.message);
            }
        } catch (error) {
            console.error('Verification error:', error); // Debug log
            setVerificationStatus('error');
            setMessage('An error occurred during verification');
        }
    };

    const handleResendVerification = async (e) => {
        e.preventDefault();
        if (!resendEmail) {
            toast.error('Please enter your email address');
            return;
        }

        setIsResending(true);
        try {
            const { data } = await axios.post('/api/auth/resend-verification', { 
                email: resendEmail 
            });
            
            if (data.success) {
                toast.success(data.message);
                setResendEmail('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to resend verification email');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="verify-email-page">
            <div className="verify-email-container">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="verify-email-card"
                >
                    {verificationStatus === 'verifying' && (
                        <div className="verification-status">
                            <div className="loading-spinner"></div>
                            <h2>Verifying Your Email</h2>
                            <p>Please wait while we verify your email address...</p>
                        </div>
                    )}

                    {verificationStatus === 'success' && (
                        <div className="verification-status success">
                            <div className="success-icon">✅</div>
                            <h2>Email Verified Successfully!</h2>
                            <p>{message}</p>
                            <div className="redirect-info">
                                <p>You will be redirected to the homepage in a few seconds...</p>
                                <button 
                                    onClick={() => navigate('/')}
                                    className="btn btn-primary"
                                >
                                    Go to Homepage
                                </button>
                            </div>
                        </div>
                    )}

                    {verificationStatus === 'error' && (
                        <div className="verification-status error">
                            <div className="error-icon">❌</div>
                            <h2>Verification Failed</h2>
                            <p>{message}</p>
                            
                            <div className="resend-section">
                                <h3>Need a new verification link?</h3>
                                <form onSubmit={handleResendVerification} className="resend-form">
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={resendEmail}
                                        onChange={(e) => setResendEmail(e.target.value)}
                                        required
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={isResending}
                                        className="btn btn-primary"
                                    >
                                        {isResending ? 'Sending...' : 'Resend Verification Email'}
                                    </button>
                                </form>
                            </div>

                            <div className="back-to-home">
                                <button 
                                    onClick={() => navigate('/')}
                                    className="btn btn-secondary"
                                >
                                    Back to Homepage
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default VerifyEmail;
