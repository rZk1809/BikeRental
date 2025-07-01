import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Title from '../components/Title';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import './MyBookings.css';

const MyBookings = () => {
    const { user, setShowLogin, axios, currency } = useAppContext();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setShowLogin(true);
            return;
        }
        fetchBookings();
    }, [user, setShowLogin]);

    const fetchBookings = async () => {
        try {
            const { data } = await axios.get('/api/bookings/user');
            if (data.success) {
                setBookings(data.bookings);
            } else {
                toast.error('Failed to fetch bookings');
            }
        } catch (error) {
            toast.error('Error fetching bookings');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'status-confirmed';
            case 'completed': return 'status-completed';
            case 'cancelled': return 'status-cancelled';
            default: return 'status-pending';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const calculateDays = (pickupDate, returnDate) => {
        const pickup = new Date(pickupDate);
        const returnD = new Date(returnDate);
        const diffTime = Math.abs(returnD - pickup);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    if (!user) {
        return null; // Will redirect to login
    }

    if (loading) {
        return (
            <div className="my-bookings-loading">
                <div className="loading-spinner"></div>
                <p>Loading your bookings...</p>
            </div>
        );
    }

    return (
        <div className='my-bookings'>
            <div className="my-bookings-container">
                <Title 
                    title="My Bookings" 
                    subTitle="Track and manage your bike rental history" 
                />

                {bookings.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bookings-grid"
                    >
                        {bookings.map((booking, index) => (
                            <motion.div
                                key={booking._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="booking-card"
                            >
                                <div className="booking-header">
                                    <div className="booking-id">
                                        Booking #{booking._id.slice(-8)}
                                    </div>
                                    <div className={`booking-status ${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                    </div>
                                </div>

                                <div className="booking-content">
                                    <div className="bike-info">
                                        {booking.bike && (
                                            <>
                                                <img 
                                                    src={booking.bike.image} 
                                                    alt={`${booking.bike.brand} ${booking.bike.model}`}
                                                    className="bike-thumbnail"
                                                />
                                                <div className="bike-details">
                                                    <h3>{booking.bike.brand} {booking.bike.model}</h3>
                                                    <p>{booking.bike.category} • {booking.bike.year}</p>
                                                    <p className="bike-location">📍 {booking.bike.location}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="booking-details">
                                        <div className="detail-row">
                                            <span className="label">Pickup Date:</span>
                                            <span className="value">{formatDate(booking.pickupDate)}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Return Date:</span>
                                            <span className="value">{formatDate(booking.returnDate)}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Duration:</span>
                                            <span className="value">
                                                {calculateDays(booking.pickupDate, booking.returnDate)} day(s)
                                            </span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Total Amount:</span>
                                            <span className="value price">
                                                {currency}{booking.price || 0}
                                            </span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Booked On:</span>
                                            <span className="value">
                                                {formatDate(booking.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="no-bookings"
                    >
                        <div className="no-bookings-icon">🚴‍♂️</div>
                        <h3>No bookings yet</h3>
                        <p>You haven't made any bike bookings yet. Start exploring our available bikes!</p>
                        <button
                            onClick={() => navigate('/bikes')}
                            className="browse-bikes-btn"
                        >
                            Browse Bikes
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
