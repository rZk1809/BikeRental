import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import './Login.css';

const Login = () => {
    const { setShowLogin, login, axios } = useAppContext();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        showResendVerification: false,
        userEmail: ''
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const payload = isLogin
                ? { email: formData.email, password: formData.password }
                : formData;

            const { data } = await axios.post(endpoint, payload);

            if (data.success) {
                if (data.requiresVerification) {
                    toast.success(data.message);
                    setShowLogin(false);
                } else {
                    login(data.token);
                    setShowLogin(false);
                    toast.success(isLogin ? 'Login successful!' : 'Registration successful!');
                }
            } else {
                if (data.requiresVerification) {
                    toast.error(data.message);
                    // Show resend verification option
                    setFormData(prev => ({ ...prev, showResendVerification: true, userEmail: data.email || formData.email }));
                } else {
                    toast.error(data.message || 'Something went wrong');
                }
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({ name: '', email: '', password: '', showResendVerification: false, userEmail: '' });
    };

    const handleResendVerification = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post('/api/auth/resend-verification', {
                email: formData.userEmail
            });

            if (data.success) {
                toast.success(data.message);
                setFormData(prev => ({ ...prev, showResendVerification: false }));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to resend verification email');
        } finally {
            setLoading(false);
        }
    };



    const handleForgotPassword = () => {
        setShowLogin(false);
        window.location.href = '/forgot-password';
    };

    return (
        <div className="login-overlay" onClick={(e) => e.target === e.currentTarget && setShowLogin(false)}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="login-modal"
            >
                <div className="login-header">
                    <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <button 
                        className="close-button"
                        onClick={() => setShowLogin(false)}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            minLength={8}
                            required
                        />
                        {!isLogin && (
                            <small className="password-hint">
                                Password must be at least 8 characters long
                            </small>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                {formData.showResendVerification && (
                    <div className="verification-notice">
                        <p>Please verify your email to continue. Check your inbox for the verification link.</p>
                        <button
                            onClick={handleResendVerification}
                            disabled={loading}
                            className="resend-button"
                        >
                            {loading ? 'Sending...' : 'Resend Verification Email'}
                        </button>
                    </div>
                )}

                {isLogin && (
                    <div className="forgot-password-link">
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="link-button"
                        >
                            Forgot your password?
                        </button>
                    </div>
                )}

                <div className="login-footer">
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button 
                            type="button"
                            className="toggle-button"
                            onClick={toggleMode}
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
