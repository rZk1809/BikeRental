import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import './Dashboard.css';
const Dashboard = () => {
    const { axios } = useAppContext();
    const [dashboardData, setDashboardData] = useState({
        totalBikes: 0,
        totalBookings: 0,
        totalUsers: 0,
        totalRevenue: 0,
        recentBookings: [],
        bikeStats: []
    });
    const [loading, setLoading] = useState(true);
    const fetchDashboardData = async () => {
        try {
            const { data } = await axios.get('/api/admin/dashboard');
            if (data.success && data.dashboardData) {
                setDashboardData({
                    totalBikes: data.dashboardData.totalBikes || 0,
                    totalBookings: data.dashboardData.totalBookings || 0,
totalUsers: 0,
                    totalRevenue: data.dashboardData.monthlyRevenue || 0,
                    recentBookings: data.dashboardData.recentBookings || [],
                    bikeStats: []
                });
            } else {
                toast.error('Failed to fetch dashboard data');
                console.log('Dashboard API response:', data);
            }
        } catch (error) {
            toast.error('Error fetching dashboard data');
            console.error('Dashboard API error:', error);
            setDashboardData({
                totalBikes: 0,
                totalBookings: 0,
                totalUsers: 0,
                totalRevenue: 0,
                recentBookings: [],
                bikeStats: []
            });
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchDashboardData();
    }, []);
    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }
    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>📊 Dashboard Overview</h1>
                <p>Welcome to your bike rental admin panel</p>
            </div>
            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-icon">🚴</div>
                    <div className="stat-content">
                        <h3>{dashboardData?.totalBikes || 0}</h3>
                        <p>Total Bikes</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-content">
                        <h3>{dashboardData?.totalBookings || 0}</h3>
                        <p>Total Bookings</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <h3>{dashboardData?.totalUsers || 0}</h3>
                        <p>Total Users</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                        <h3>${dashboardData?.totalRevenue || 0}</h3>
                        <p>Total Revenue</p>
                    </div>
                </div>
            </div>
            <div className="dashboard-content">
                <div className="dashboard-section">
                    <h2>Recent Bookings</h2>
                    <div className="recent-bookings">
                        {dashboardData?.recentBookings && dashboardData.recentBookings.length > 0 ? (
                            <div className="bookings-table">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Bike</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboardData.recentBookings.map((booking, index) => (
                                            <tr key={booking._id || index}>
                                                <td>{booking.user?.name || booking.userName || 'N/A'}</td>
                                                <td>
                                                    {booking.bike ? `${booking.bike.brand} ${booking.bike.model}` : booking.bikeName || 'N/A'}
                                                </td>
                                                <td>{new Date(booking.createdAt || booking.date).toLocaleDateString()}</td>
                                                <td>
                                                    <span className={`status-badge status-${booking.status?.toLowerCase()}`}>
                                                        {booking.status || 'Pending'}
                                                    </span>
                                                </td>
                                                <td>${booking.price || booking.amount || 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="no-data">
                                <p>No recent bookings found</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="dashboard-section">
                    <h2>Quick Actions</h2>
                    <div className="quick-actions">
                        <button className="action-btn btn-primary" onClick={() => window.location.href = '/add-bike'}>
                            ➕ Add New Bike
                        </button>
                        <button className="action-btn btn-secondary" onClick={() => window.location.href = '/manage-bikes'}>
                            🚴 Manage Bikes
                        </button>
                        <button className="action-btn btn-secondary" onClick={() => window.location.href = '/manage-bookings'}>
                            📋 Manage Bookings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;