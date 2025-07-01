import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import './Hero.css';
const cityList = ['Chennai', 'Dubai', 'Bangalore'];
const Hero = () => {
    const { navigate } = useAppContext();
    const [pickupLocation, setPickupLocation] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/bikes?pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}`);
    };
    return (
        <div className='hero'>
            <div className="hero-overlay"></div>
            <div className='hero-content'>
                <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Your Next Adventure on Two Wheels
                </motion.h1>
                <motion.p
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Rent premium bikes for any journey, anywhere.
                </motion.p>
                <motion.form
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    onSubmit={handleSearch}
                    className='hero-search-form'
                >
                    <select required value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)}>
                        <option value="">Select Location</option>
                        {cityList.map((city) => <option key={city} value={city}>{city}</option>)}
                    </select>
                    <input value={pickupDate} onChange={e => setPickupDate(e.target.value)} type="date" required />
                    <input value={returnDate} onChange={e => setReturnDate(e.target.value)} type="date" required />
                    <button type="submit">Search Bikes</button>
                </motion.form>
            </div>
        </div>
    );
};
export default Hero;