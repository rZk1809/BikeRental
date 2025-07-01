import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import './ManageBookings.css';

const ManageBookings = () => {
    const { axios } = useAppContext();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const statusOptions = ['pending', 'confirmed', 'completed', 'cancelled'];

    const fetchBookings = async () => {
        try {
            const { data } = await axios.get('/api/bookings/admin');
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

    const changeBookingStatus = async (bookingId, newStatus) => {
        try {
            const { data } = await axios.post('/api/bookings/change-status', {
                bookingId,
                status: newStatus
            });
            if (data.success) {
                toast.success('Booking status updated successfully');
                fetchBookings(); // Refresh the list
            } else {
                toast.error(data.message || 'Failed to update booking status');
            }
        } catch (error) {
            toast.error('Error updating booking status');
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const filteredBookings = bookings.filter(booking => {
        const matchesStatus = filterStatus === '' || booking.status === filterStatus;
        const matchesSearch = 
            booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.bike?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking._id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'status-confirmed';
            case 'completed': return 'status-completed';
            case 'cancelled': return 'status-cancelled';
            default: return 'status-pending';
        }
    };

    if (loading) {
        return (
            <div className="manage-bookings-loading">
                <div className="loading-spinner"></div>
                <p>Loading bookings...</p>
            </div>
        );
    }

    return (
        <div className="manage-bookings">
            <div className="manage-bookings-header">
                <h1>📋 Manage Bookings</h1>
                <p>View and manage all bike rental bookings</p>
            </div>

            <div className="manage-bookings-filters">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by user name, bike name, or booking ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-box">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        {statusOptions.map(status => (
                            <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bookings-stats">
                <div className="stat-item">
                    <span className="stat-number">{bookings.length}</span>
                    <span className="stat-label">Total Bookings</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{bookings.filter(b => b.status === 'pending').length}</span>
                    <span className="stat-label">Pending</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{bookings.filter(b => b.status === 'confirmed').length}</span>
                    <span className="stat-label">Confirmed</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{bookings.filter(b => b.status === 'completed').length}</span>
                    <span className="stat-label">Completed</span>
                </div>
            </div>

            {filteredBookings.length === 0 ? (
                <div className="no-bookings">
                    <p>No bookings found matching your criteria</p>
                </div>
            ) : (
                <div className="bookings-table-container">
                    <table className="bookings-table">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>User</th>
                                <th>Bike</th>
                                <th>Pickup Date</th>
                                <th>Return Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map(booking => (
                                <tr key={booking._id}>
                                    <td className="booking-id">
                                        {booking._id.slice(-8)}
                                    </td>
                                    <td>
                                        <div className="user-info">
                                            <span className="user-name">{booking.user?.name || 'N/A'}</span>
                                            <span className="user-email">{booking.user?.email || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="bike-info">
                                            <span className="bike-name">
                                                {booking.bike ? `${booking.bike.brand} ${booking.bike.model}` : 'N/A'}
                                            </span>
                                            <span className="bike-location">{booking.bike?.location || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td>{new Date(booking.pickupDate).toLocaleDateString()}</td>
                                    <td>{new Date(booking.returnDate).toLocaleDateString()}</td>
                                    <td className="amount">${booking.price || 0}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusColor(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="booking-actions">
                                            <select
                                                value={booking.status}
                                                onChange={(e) => changeBookingStatus(booking._id, e.target.value)}
                                                className="status-select"
                                            >
                                                {statusOptions.map(status => (
                                                    <option key={status} value={status}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageBookings;
