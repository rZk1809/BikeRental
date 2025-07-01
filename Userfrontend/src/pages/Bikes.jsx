import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import BikeCard from '../components/BikeCard';
import Title from '../components/Title';
import { motion } from 'motion/react';
import './Bikes.css';

const Bikes = () => {
    const { bikes } = useAppContext();
    const [searchParams] = useSearchParams();
    const [filteredBikes, setFilteredBikes] = useState([]);
    const [filters, setFilters] = useState({
        category: '',
        location: '',
        priceRange: '',
        fuelType: ''
    });

    const categories = [...new Set(bikes.map(bike => bike.category))];
    const locations = [...new Set(bikes.map(bike => bike.location))];
    const fuelTypes = [...new Set(bikes.map(bike => bike.fuel_type))];

    useEffect(() => {
        let filtered = bikes.filter(bike => bike.isAvailable);

        // Apply filters
        if (filters.category) {
            filtered = filtered.filter(bike => bike.category === filters.category);
        }
        if (filters.location) {
            filtered = filtered.filter(bike => bike.location === filters.location);
        }
        if (filters.fuelType) {
            filtered = filtered.filter(bike => bike.fuel_type === filters.fuelType);
        }
        if (filters.priceRange) {
            const [min, max] = filters.priceRange.split('-').map(Number);
            filtered = filtered.filter(bike => {
                if (max) {
                    return bike.pricePerDay >= min && bike.pricePerDay <= max;
                } else {
                    return bike.pricePerDay >= min;
                }
            });
        }

        // Apply search params from Hero component
        const pickupLocation = searchParams.get('pickupLocation');
        if (pickupLocation) {
            filtered = filtered.filter(bike => 
                bike.location.toLowerCase().includes(pickupLocation.toLowerCase())
            );
        }

        setFilteredBikes(filtered);
    }, [bikes, filters, searchParams]);

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            location: '',
            priceRange: '',
            fuelType: ''
        });
    };

    return (
        <div className='bikes-page'>
            <div className="bikes-container">
                <Title 
                    title="Available Bikes" 
                    subTitle="Find the perfect bike for your next adventure" 
                />

                <div className="bikes-content">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="filters-sidebar"
                    >
                        <div className="filters-header">
                            <h3>Filters</h3>
                            <button onClick={clearFilters} className="clear-filters">
                                Clear All
                            </button>
                        </div>

                        <div className="filter-group">
                            <label>Category</label>
                            <select 
                                value={filters.category} 
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Location</label>
                            <select 
                                value={filters.location} 
                                onChange={(e) => handleFilterChange('location', e.target.value)}
                            >
                                <option value="">All Locations</option>
                                {locations.map(location => (
                                    <option key={location} value={location}>{location}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Fuel Type</label>
                            <select 
                                value={filters.fuelType} 
                                onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                            >
                                <option value="">All Types</option>
                                {fuelTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Price Range (per day)</label>
                            <select 
                                value={filters.priceRange} 
                                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                            >
                                <option value="">All Prices</option>
                                <option value="0-25">$0 - $25</option>
                                <option value="25-50">$25 - $50</option>
                                <option value="50-100">$50 - $100</option>
                                <option value="100">$100+</option>
                            </select>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bikes-grid-container"
                    >
                        <div className="bikes-results-header">
                            <p>{filteredBikes.length} bike(s) found</p>
                        </div>

                        {filteredBikes.length > 0 ? (
                            <div className="bikes-grid">
                                {filteredBikes.map((bike, index) => (
                                    <motion.div
                                        key={bike._id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <BikeCard bike={bike} />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-bikes">
                                <h3>No bikes found</h3>
                                <p>Try adjusting your filters to see more results.</p>
                                <button onClick={clearFilters} className="clear-filters-btn">
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Bikes;
