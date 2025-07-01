import React from 'react';
import Title from './Title';
import BikeCard from './BikeCard';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import './FeaturedSection.css';
const FeaturedSection = () => {
    const { bikes } = useAppContext();
    const navigate = useNavigate();
    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className='featured-section'
        >
            <Title title='Featured Bikes' subTitle='Explore our top-rated bikes for your next journey.' />
            <div className='featured-grid'>
                {bikes.slice(0, 3).map((bike, index) => (
                    <motion.div
                        key={bike._id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                        <BikeCard bike={bike} />
                    </motion.div>
                ))}
            </div>
            <button onClick={() => navigate('/bikes')} className="explore-all-button">
                Explore All Bikes &rarr;
            </button>
        </motion.section>
    );
};
export default FeaturedSection;