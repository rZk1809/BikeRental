import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import './AddBike.css';
const AddBike = () => {
    const { axios, navigate } = useAppContext();
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        year: '',
        category: '',
        seating_capacity: '',
        fuel_type: '',
        transmission: '',
        pricePerDay: '',
        location: '',
        description: '',
        isAvailable: true
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const categories = [
        'Mountain Bike',
        'Road Bike',
        'Hybrid Bike',
        'Electric Bike',
        'BMX',
        'Cruiser',
        'Folding Bike',
        'City Bike',
        'Touring Bike'
    ];
    const fuelTypes = [
        'Pedal',
        'Electric',
        'Hybrid'
    ];
    const transmissionTypes = [
        'Manual',
        'Automatic',
        'Single Speed',
        'Multi Speed'
    ];
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.brand.trim()) {
            toast.error('Please enter bike brand');
            return;
        }
        if (!formData.model.trim()) {
            toast.error('Please enter bike model');
            return;
        }
        if (!formData.year || parseInt(formData.year) < 1900 || parseInt(formData.year) > new Date().getFullYear() + 1) {
            toast.error('Please enter a valid year');
            return;
        }
        if (!formData.category) {
            toast.error('Please select a category');
            return;
        }
        if (!formData.seating_capacity || parseInt(formData.seating_capacity) <= 0) {
            toast.error('Please enter valid seating capacity');
            return;
        }
        if (!formData.fuel_type) {
            toast.error('Please select fuel type');
            return;
        }
        if (!formData.transmission) {
            toast.error('Please select transmission type');
            return;
        }
        if (!formData.pricePerDay || parseFloat(formData.pricePerDay) <= 0) {
            toast.error('Please enter a valid price per day');
            return;
        }
        if (!formData.location.trim()) {
            toast.error('Please enter location');
            return;
        }
        if (!formData.description.trim()) {
            toast.error('Please enter description');
            return;
        }
        if (!image) {
            toast.error('Please select an image for the bike');
            return;
        }
        setLoading(true);
        
        try {
            const bikeData = {
                brand: formData.brand,
                model: formData.model,
                year: parseInt(formData.year),
                category: formData.category,
                seating_capacity: parseInt(formData.seating_capacity),
                fuel_type: formData.fuel_type,
                transmission: formData.transmission,
                pricePerDay: parseFloat(formData.pricePerDay),
                location: formData.location,
                description: formData.description,
                isAvailable: formData.isAvailable
            };
            const submitData = new FormData();
            submitData.append('bikeData', JSON.stringify(bikeData));
            submitData.append('image', image);
            const { data } = await axios.post('/api/admin/add-bike', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (data.success) {
                toast.success('Bike added successfully!');
                setFormData({
                    brand: '',
                    model: '',
                    year: '',
                    category: '',
                    seating_capacity: '',
                    fuel_type: '',
                    transmission: '',
                    pricePerDay: '',
                    location: '',
                    description: '',
                    isAvailable: true
                });
                setImage(null);
                setImagePreview(null);
                navigate('/manage-bikes');
            } else {
                toast.error(data.message || 'Failed to add bike');
            }
        } catch (error) {
            console.error('Add bike error:', error);
            if (error.response) {
                toast.error(error.response.data?.message || 'Server error occurred');
            } else if (error.request) {
                toast.error('No response from server. Please check if backend is running.');
            } else {
                toast.error('Error adding bike: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="add-bike">
            <div className="add-bike-header">
                <h1>➕ Add New Bike</h1>
                <p>Add a new bike to your rental inventory with complete details</p>
            </div>
            <div className="add-bike-content">
                <form onSubmit={handleSubmit} className="add-bike-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="brand">Brand *</label>
                            <input
                                type="text"
                                id="brand"
                                name="brand"
                                value={formData.brand}
                                onChange={handleInputChange}
                                placeholder="Enter bike brand"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="model">Model *</label>
                            <input
                                type="text"
                                id="model"
                                name="model"
                                value={formData.model}
                                onChange={handleInputChange}
                                placeholder="Enter bike model"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="year">Year *</label>
                            <input
                                type="number"
                                id="year"
                                name="year"
                                value={formData.year}
                                onChange={handleInputChange}
                                placeholder="Enter year"
                                min="1900"
                                max={new Date().getFullYear() + 1}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Category *</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="seating_capacity">Seating Capacity *</label>
                            <input
                                type="number"
                                id="seating_capacity"
                                name="seating_capacity"
                                value={formData.seating_capacity}
                                onChange={handleInputChange}
                                placeholder="Enter seating capacity"
                                min="1"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fuel_type">Fuel Type *</label>
                            <select
                                id="fuel_type"
                                name="fuel_type"
                                value={formData.fuel_type}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select fuel type</option>
                                {fuelTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="transmission">Transmission *</label>
                            <select
                                id="transmission"
                                name="transmission"
                                value={formData.transmission}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select transmission</option>
                                {transmissionTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="pricePerDay">Price per Day ($) *</label>
                            <input
                                type="number"
                                id="pricePerDay"
                                name="pricePerDay"
                                value={formData.pricePerDay}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="location">Location *</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="Enter location"
                                required
                            />
                        </div>
                        <div className="form-group">
                            {}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter bike description"
                            rows="4"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Bike Image *</label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                        />
                        {imagePreview && (
                            <div className="image-preview">
                                <img src={imagePreview} alt="Preview" />
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="isAvailable"
                                checked={formData.isAvailable}
                                onChange={handleInputChange}
                            />
                            <span className="checkmark"></span>
                            Available for rent
                        </label>
                    </div>
                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={() => navigate('/manage-bikes')}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Adding Bike...' : 'Add Bike'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default AddBike;