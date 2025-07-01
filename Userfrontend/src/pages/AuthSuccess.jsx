import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import './AuthSuccess.css';

const AuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const { login } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            // Auto login the user with the token from Google OAuth
            login(token);
            toast.success('Successfully signed in with Google!');
            
            // Redirect to homepage after a short delay
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } else {
            toast.error('Authentication failed');
            navigate('/');
        }
    }, [searchParams, login, navigate]);

    return (
        <div className="auth-success-page">
            <div className="auth-success-container">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="auth-success-card"
                >
                    <div className="success-animation">
                        <div className="success-icon">✅</div>
                        <div className="google-icon">🔗</div>
                    </div>
                    
                    <h2>Authentication Successful!</h2>
                    <p>You have successfully signed in with Google. Redirecting you to the homepage...</p>
                    
                    <div className="loading-indicator">
                        <div className="loading-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => navigate('/')}
                        className="btn btn-primary"
                    >
                        Go to Homepage
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default AuthSuccess;
