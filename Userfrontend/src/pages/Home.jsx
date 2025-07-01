import React from 'react';
import Hero from '../components/Hero';
import FeaturedSection from '../components/FeaturedSection';
import './Home.css';

const Home = () => {
    return (
        <div className='home'>
            <Hero />
            <FeaturedSection />
        </div>
    );
};

export default Home;
