import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import './ResetPassword.css';
const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const { axios, setShowLogin } = useAppContext();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState('');
    useEffect(() => {
        const resetToken = searchParams.get('token');
        if (resetToken) {
            setToken(resetToken);
        } else {
            toast.error('Invalid reset link');
            navigate('/');
        }
    }, [searchParams, navigate]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (formData.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }
        setIsLoading(true);
        try {
            const { data } = await axios.post('/api/auth/reset-password', {
                token,
                newPassword: formData.newPassword
            });
            
            if (data.success) {
                toast.success(data.message);
                setTimeout(() => {
                    setShowLogin(true);
                    navigate('/');
                }, 2000);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="reset-password-page">
            <div className="reset-password-container">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="reset-password-card"
                >
                    <div className="reset-password-header">
                        <h2>Reset Your Password</h2>
                        <p>Enter your new password below to complete the reset process.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="reset-password-form">
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                placeholder="Enter your new password"
                                minLength={8}
                                required
                            />
                            <small className="password-hint">
                                Password must be at least 8 characters long
                            </small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Confirm your new password"
                                minLength={8}
                                required
                            />
                        </div>
                        <div className="password-strength">
                            <div className="strength-indicators">
                                <div className={`strength-indicator ${formData.newPassword.length >= 8 ? 'valid' : ''}`}>
                                    ✓ At least 8 characters
                                </div>
                                <div className={`strength-indicator ${formData.newPassword === formData.confirmPassword && formData.confirmPassword ? 'valid' : ''}`}>
                                    ✓ Passwords match
                                </div>
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            disabled={isLoading || formData.newPassword !== formData.confirmPassword || formData.newPassword.length < 8}
                            className="btn btn-primary"
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                    <div className="reset-password-footer">
                        <p>
                            Remember your password? 
                            <button 
                                type="button"
                                onClick={() => {
                                    setShowLogin(true);
                                    navigate('/');
                                }}
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
export default ResetPassword;