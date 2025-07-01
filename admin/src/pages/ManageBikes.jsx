import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import './ManageBikes.css';
const ManageBikes = () => {
    const { axios, navigate } = useAppContext();
    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const categories = [
        'Mountain Bike',
        'Road Bike',
        'Hybrid Bike',
        'Electric Bike',
        'BMX',
        'Cruiser',
        'Folding Bike'
    ];
    const fetchBikes = async () => {
        try {
            const { data } = await axios.get('/api/admin/bikes');
            if (data.success) {
                setBikes(data.bikes);
            } else {
                toast.error('Failed to fetch bikes');
            }
        } catch (error) {
            toast.error('Error fetching bikes');
        } finally {
            setLoading(false);
        }
    };
    const toggleBikeAvailability = async (bikeId) => {
        try {
            const { data } = await axios.post('/api/admin/toggle-bike', { bikeId });
            if (data.success) {
                toast.success('Bike availability updated');
fetchBikes();
            } else {
                toast.error(data.message || 'Failed to update bike');
            }
        } catch (error) {
            toast.error('Error updating bike');
        }
    };
    const deleteBike = async (bikeId) => {
        if (window.confirm('Are you sure you want to delete this bike?')) {
            try {
                const { data } = await axios.post('/api/admin/delete-bike', { bikeId });
                if (data.success) {
                    toast.success('Bike deleted successfully');
fetchBikes();
                } else {
                    toast.error(data.message || 'Failed to delete bike');
                }
            } catch (error) {
                toast.error('Error deleting bike');
            }
        }
    };
    useEffect(() => {
        fetchBikes();
    }, []);
    const filteredBikes = bikes.filter(bike => {
        const matchesSearch = (bike.brand?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                            (bike.model?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                            (bike.location?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === '' || bike.category === filterCategory;
        return matchesSearch && matchesCategory;
    });
    if (loading) {
        return (
            <div className="manage-bikes-loading">
                <div className="loading-spinner"></div>
                <p>Loading bikes...</p>
            </div>
        );
    }
    return (
        <div className="manage-bikes">
            <div className="manage-bikes-header">
                <div>
                    <h1>🚴 Manage Bikes</h1>
                    <p>Manage your bike rental inventory</p>
                </div>
                <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/add-bike')}
                >
                    ➕ Add New Bike
                </button>
            </div>
            <div className="manage-bikes-filters">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search bikes by brand, model, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-box">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="bikes-stats">
                <div className="stat-item">
                    <span className="stat-number">{bikes.length}</span>
                    <span className="stat-label">Total Bikes</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{bikes.filter(b => b.isAvailable).length}</span>
                    <span className="stat-label">Available</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{bikes.filter(b => !b.isAvailable).length}</span>
                    <span className="stat-label">Unavailable</span>
                </div>
            </div>
            {filteredBikes.length === 0 ? (
                <div className="no-bikes">
                    <p>No bikes found matching your criteria</p>
                    <button 
                        className="btn btn-primary"
                        onClick={() => navigate('/add-bike')}
                    >
                        Add Your First Bike
                    </button>
                </div>
            ) : (
                <div className="bikes-grid">
                    {filteredBikes.map(bike => (
                        <div key={bike._id} className="bike-card">
                            <div className="bike-image">
                                <img src={bike.image} alt={`${bike.brand} ${bike.model}`} />
                                <div className={`availability-badge ${bike.isAvailable ? 'available' : 'unavailable'}`}>
                                    {bike.isAvailable ? 'Available' : 'Unavailable'}
                                </div>
                            </div>
                            <div className="bike-info">
                                <h3>{bike.brand} {bike.model}</h3>
                                <p className="bike-category">{bike.category}</p>
                                <p className="bike-year">📅 {bike.year}</p>
                                <p className="bike-location">📍 {bike.location}</p>
                                <p className="bike-price">${bike.pricePerDay}/day</p>
                                <p className="bike-description">{bike.description}</p>
                                <div className="bike-specs">
                                    <span className="spec">⚡ {bike.fuel_type}</span>
                                    <span className="spec">⚙️ {bike.transmission}</span>
                                    <span className="spec">👥 {bike.seating_capacity}</span>
                                </div>
                            </div>
                            <div className="bike-actions">
                                <button
                                    className={`btn ${bike.isAvailable ? 'btn-warning' : 'btn-success'}`}
                                    onClick={() => toggleBikeAvailability(bike._id)}
                                >
                                    {bike.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => deleteBike(bike._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default ManageBikes;