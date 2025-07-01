import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import './BookingSuccess.css';
const BookingSuccess = () => {
    const [searchParams] = useSearchParams();
    const { axios } = useAppContext();
    const navigate = useNavigate();
    const [verificationStatus, setVerificationStatus] = useState('verifying');
    const [booking, setBooking] = useState(null);
    const [message, setMessage] = useState('');
    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        if (sessionId) {
            verifyPayment(sessionId);
        } else {
            setVerificationStatus('error');
            setMessage('Invalid payment session');
        }
    }, [searchParams]);
    const verifyPayment = async (sessionId) => {
        try {
            const { data } = await axios.post('/api/bookings/verify-payment', { sessionId });
            
            if (data.success) {
                setVerificationStatus('success');
                setMessage(data.message);
                setBooking(data.booking);
                toast.success('Payment successful!');
            } else {
                setVerificationStatus('error');
                setMessage(data.message);
                toast.error('Payment verification failed');
            }
        } catch (error) {
            setVerificationStatus('error');
            setMessage('An error occurred during payment verification');
            toast.error('Payment verification failed');
        }
    };
    return (
        <div className="booking-success-page">
            <div className="booking-success-container">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="booking-success-card"
                >
                    {verificationStatus === 'verifying' && (
                        <div className="verification-status">
                            <div className="loading-spinner"></div>
                            <h2>Verifying Payment</h2>
                            <p>Please wait while we verify your payment...</p>
                        </div>
                    )}
                    {verificationStatus === 'success' && (
                        <div className="verification-status success">
                            <div className="success-icon">🎉</div>
                            <h2>Payment Successful!</h2>
                            <p>{message}</p>
                            
                            {booking && (
                                <div className="booking-details">
                                    <h3>Booking Details</h3>
                                    <div className="detail-row">
                                        <span>Booking ID:</span>
                                        <span>{booking._id}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Bike:</span>
                                        <span>{booking.bike?.brand} {booking.bike?.model}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Amount Paid:</span>
                                        <span>${booking.price}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Status:</span>
                                        <span className="status pending">Pending Admin Approval</span>
                                    </div>
                                </div>
                            )}
                            
                            <div className="action-buttons">
                                <button 
                                    onClick={() => navigate('/my-bookings')}
                                    className="btn btn-primary"
                                >
                                    View My Bookings
                                </button>
                                <button 
                                    onClick={() => navigate('/')}
                                    className="btn btn-secondary"
                                >
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    )}
                    {verificationStatus === 'error' && (
                        <div className="verification-status error">
                            <div className="error-icon">❌</div>
                            <h2>Payment Verification Failed</h2>
                            <p>{message}</p>
                            
                            <div className="action-buttons">
                                <button 
                                    onClick={() => navigate('/my-bookings')}
                                    className="btn btn-primary"
                                >
                                    Check My Bookings
                                </button>
                                <button 
                                    onClick={() => navigate('/')}
                                    className="btn btn-secondary"
                                >
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};
export default BookingSuccess;