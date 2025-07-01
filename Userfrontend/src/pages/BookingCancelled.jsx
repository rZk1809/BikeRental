import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import './BookingCancelled.css';

const BookingCancelled = () => {
    const navigate = useNavigate();

    return (
        <div className="booking-cancelled-page">
            <div className="booking-cancelled-container">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="booking-cancelled-card"
                >
                    <div className="cancelled-icon">😔</div>
                    <h2>Payment Cancelled</h2>
                    <p>
                        Your payment was cancelled and no charges were made to your account. 
                        You can try booking again or browse other bikes.
                    </p>
                    
                    <div className="info-box">
                        <h3>What happened?</h3>
                        <ul>
                            <li>You cancelled the payment process</li>
                            <li>No booking was created</li>
                            <li>No charges were made</li>
                            <li>You can try again anytime</li>
                        </ul>
                    </div>
                    
                    <div className="action-buttons">
                        <button 
                            onClick={() => navigate('/bikes')}
                            className="btn btn-primary"
                        >
                            Browse Bikes
                        </button>
                        <button 
                            onClick={() => navigate('/')}
                            className="btn btn-secondary"
                        >
                            Back to Home
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BookingCancelled;
