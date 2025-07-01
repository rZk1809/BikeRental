import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import './BikeCard.css';
const BikeCard = ({ bike }) => {
    const { currency } = useAppContext();
    const navigate = useNavigate();
    return (
        <div className='bike-card' onClick={() => navigate(`/bike-details/${bike._id}`)}>
            <div className='bike-card-image-wrapper'>
                <img src={bike.image} alt={`${bike.brand} ${bike.model}`} className='bike-card-image' />
                {bike.isAvailable && <div className='availability-tag'>Available Now</div>}
                <div className='price-tag'>
                    <span className='price'>{currency}{bike.pricePerDay}</span>
                    <span className='period'> / day</span>
                </div>
            </div>
            <div className='bike-card-content'>
                <div className='bike-card-header'>
                    <h3 className='bike-card-title'>{bike.brand} {bike.model}</h3>
                    <p className='bike-card-subtitle'>{bike.category} • {bike.year}</p>
                </div>
            </div>
        </div>
    );
};
export default BikeCard;