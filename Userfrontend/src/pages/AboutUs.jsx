import React, { useState } from 'react';
import { motion } from 'motion/react';
import journeyImage from '../assets/journey2.jpg';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';
import './AboutUs.css';
const AboutUs = () => {
    const { axios } = useAppContext();
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const handleContactSubmit = async (e) => {
        e.preventDefault();
        
        if (!contactForm.name || !contactForm.email || !contactForm.message) {
            toast.error('Please fill in all required fields');
            return;
        }
        setLoading(true);
        try {
            toast.success('Thank you for your message! We\'ll get back to you soon.');
            setContactForm({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    const handleInputChange = (e) => {
        setContactForm({
            ...contactForm,
            [e.target.name]: e.target.value
        });
    };
    return (
        <div className="about-us">
            {}
            <motion.section 
                className="about-hero"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="hero-content">
                    <h1>About BikeRental</h1>
                    <p>Your trusted partner for premium bike rentals across India</p>
                </div>
            </motion.section>
            {}
            <motion.section 
                className="our-story"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div className="container">
                    <div className="story-content">
                        <div className="story-text">
                            <h2>Our Story</h2>
                            <p>
                                Founded in 2025, BikeRental has revolutionized the way people explore India. 
                                What started as a small venture with just 5 bikes in Chennai has grown into 
                                India's most trusted bike rental platform, serving thousands of customers 
                                across major cities.
                            </p>
                            <p>
                                We believe that everyone deserves the freedom to explore, whether it's a 
                                weekend getaway, daily commute, or an epic road trip. Our mission is to 
                                make premium bikes accessible to everyone, everywhere.
                            </p>
                        </div>
                        <div className="story-image">
                            <img src={journeyImage} alt="Our Journey" />
                        </div>
                    </div>
                </div>
            </motion.section>
            <motion.section 
                className="why-choose-us"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                <div className="container">
                    <h2>Why Choose BikeRental?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🏍️</div>
                            <h3>Premium Fleet</h3>
                            <p>Latest models from top brands like Honda, Yamaha, BMW, and Harley Davidson</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🛡️</div>
                            <h3>Fully Insured</h3>
                            <p>All our bikes come with comprehensive insurance coverage for your peace of mind</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📱</div>
                            <h3>Easy Booking</h3>
                            <p>Book your ride in just a few clicks with our user-friendly platform</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔧</div>
                            <h3>Well Maintained</h3>
                            <p>Regular servicing and quality checks ensure a smooth riding experience</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💳</div>
                            <h3>Secure Payments</h3>
                            <p>Safe and secure payment processing with multiple payment options</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🌍</div>
                            <h3>Pan-India Service</h3>
                            <p>Available in Chennai, Bangalore, Mumbai, Delhi and expanding to more cities</p>
                        </div>
                    </div>
                </div>
            </motion.section>
            <motion.section 
                className="our-locations"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
            >
                <div className="container">
                    <h2>Our Locations</h2>
                    <div className="locations-grid">
                        <div className="location-card">
                            <h3>Chennai</h3>
                            <p>T. Nagar, Anna Nagar, Velachery</p>
                            <span className="bikes-count">50+ Bikes Available</span>
                        </div>
                        <div className="location-card">
                            <h3>Bangalore</h3>
                            <p>Koramangala, Whitefield, Electronic City</p>
                            <span className="bikes-count">45+ Bikes Available</span>
                        </div>
                        <div className="location-card">
                            <h3>Mumbai</h3>
                            <p>Bandra, Andheri, Powai</p>
                            <span className="bikes-count">40+ Bikes Available</span>
                        </div>
                        <div className="location-card">
                            <h3>Delhi</h3>
                            <p>Connaught Place, Karol Bagh, Lajpat Nagar</p>
                            <span className="bikes-count">35+ Bikes Available</span>
                        </div>
                    </div>
                </div>
            </motion.section>
            <motion.section 
                className="contact-section"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
            >
                <div className="container">
                    <div className="contact-content">
                        <div className="contact-info">
                            <h2>Get in Touch</h2>
                            <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                            
                            <div className="contact-details">
                                <div className="contact-item">
                                    <strong>📧 Email:</strong>
                                    <span>rohithganesh.kanchi2023@vitstudent.ac.in</span>
                                </div>
                                <div className="contact-item">
                                    <strong>📞 Phone:</strong>
                                    <span>+91 73056 36052</span>
                                </div>
                                <div className="contact-item">
                                    <strong>🕒 Support Hours:</strong>
                                    <span>24/7 Customer Support</span>
                                </div>
                                <div className="contact-item">
                                    <strong>🏢 Head Office:</strong>
                                    <span>chennai, Tamil Nadu, India</span>
                                </div>
                            </div>
                        </div>
                        <form className="contact-form" onSubmit={handleContactSubmit}>
                            <h3>Send us a Message</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={contactForm.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={contactForm.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={contactForm.subject}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Message *</label>
                                <textarea
                                    name="message"
                                    rows="5"
                                    value={contactForm.message}
                                    onChange={handleInputChange}
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" disabled={loading} className="submit-btn">
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </motion.section>
        </div>
    );
};
export default AboutUs;