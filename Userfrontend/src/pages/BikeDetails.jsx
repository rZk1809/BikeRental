import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import './BikeDetails.css';

const BikeDetails = () => {
    const { id } = useParams();
    const { bikes, currency, user, setShowLogin, axios } = useAppContext();
    const navigate = useNavigate();
    const [bike, setBike] = useState(null);
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const foundBike = bikes.find(b => b._id === id);
        if (foundBike) {
            setBike(foundBike);
        } else {
            // If bike not found in context, you could fetch it from API
            navigate('/bikes');
        }
    }, [id, bikes, navigate]);

    const handleBooking = async (e) => {
        e.preventDefault();
        
        if (!user) {
            setShowLogin(true);
            return;
        }

        if (!pickupDate || !returnDate) {
            toast.error('Please select pickup and return dates');
            return;
        }

        if (new Date(pickupDate) >= new Date(returnDate)) {
            toast.error('Return date must be after pickup date');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post('/api/bookings/create', {
                bike: bike._id,
                pickupDate,
                returnDate
            });

            if (data.success) {
                toast.success('Redirecting to payment...');
                // Redirect to Stripe checkout
                window.location.href = data.paymentUrl;
            } else {
                toast.error(data.message || 'Failed to create booking');
            }
        } catch (error) {
            console.error('Booking error:', error);
            toast.error('Error creating booking');
        } finally {
            setLoading(false);
        }
    };

    if (!bike) {
        return (
            <div className="bike-details-loading">
                <div className="loading-spinner"></div>
                <p>Loading bike details...</p>
            </div>
        );
    }

    const calculateDays = () => {
        if (pickupDate && returnDate) {
            const pickup = new Date(pickupDate);
            const returnD = new Date(returnDate);
            const diffTime = Math.abs(returnD - pickup);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        }
        return 0;
    };

    const totalPrice = calculateDays() * bike.pricePerDay;

    return (
        <div className='bike-details'>
            <div className="bike-details-container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bike-details-content"
                >
                    <div className="bike-details-image">
                        <img src={bike.image} alt={`${bike.brand} ${bike.model}`} />
                        {bike.isAvailable && <div className="availability-badge">Available Now</div>}
                    </div>
                    
                    <div className="bike-details-info">
                        <div className="bike-header">
                            <h1>{bike.brand} {bike.model}</h1>
                            <p className="bike-category">{bike.category} • {bike.year}</p>
                            <div className="bike-price">
                                <span className="price">{currency}{bike.pricePerDay}</span>
                                <span className="period"> / day</span>
                            </div>
                        </div>

                        <div className="bike-specs">
                            <h3>Specifications</h3>
                            <div className="specs-grid">
                                <div className="spec-item">
                                    <span className="spec-label">Fuel Type:</span>
                                    <span className="spec-value">{bike.fuel_type}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Transmission:</span>
                                    <span className="spec-value">{bike.transmission}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Seating:</span>
                                    <span className="spec-value">{bike.seating_capacity} person(s)</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Location:</span>
                                    <span className="spec-value">{bike.location}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bike-description">
                            <h3>Description</h3>
                            <p>{bike.description}</p>
                        </div>

                        {bike.isAvailable && (
                            <form onSubmit={handleBooking} className="booking-form">
                                <h3>Book This Bike</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Pickup Date</label>
                                        <input
                                            type="date"
                                            value={pickupDate}
                                            onChange={(e) => setPickupDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Return Date</label>
                                        <input
                                            type="date"
                                            value={returnDate}
                                            onChange={(e) => setReturnDate(e.target.value)}
                                            min={pickupDate || new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                {calculateDays() > 0 && (
                                    <div className="booking-summary">
                                        <p>Duration: {calculateDays()} day(s)</p>
                                        <p className="total-price">Total: {currency}{totalPrice}</p>
                                    </div>
                                )}
                                
                                <button type="submit" disabled={loading} className="book-button">
                                    {loading ? 'Booking...' : 'Book Now'}
                                </button>
                            </form>
                        )}
                        
                        {!bike.isAvailable && (
                            <div className="unavailable-notice">
                                <p>This bike is currently unavailable for booking.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BikeDetails;
