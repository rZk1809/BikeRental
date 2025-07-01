import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import './Footer.css';
const Footer = () => {
    const currentYear = new Date().getFullYear();
    const footerLinks = {
        company: [
            { name: 'About Us', path: '/about' },
            { name: 'Contact', path: '/contact' },
            { name: 'Careers', path: '/careers' },
            { name: 'Blog', path: '/blog' }
        ],
        services: [
            { name: 'Bike Rental', path: '/bikes' },
            { name: 'Long Term Rental', path: '/long-term' },
            { name: 'Corporate Packages', path: '/corporate' },
            { name: 'Insurance', path: '/insurance' }
        ],
        support: [
            { name: 'Help Center', path: '/help' },
            { name: 'Safety Guidelines', path: '/safety' },
            { name: 'Terms of Service', path: '/terms' },
            { name: 'Privacy Policy', path: '/privacy' }
        ]
    };
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className='footer'
        >
            <div className="footer-content">
                <div className="footer-section footer-brand">
                    <Link to="/" className="footer-logo">
                        BIKERENT
                    </Link>
                    <p className="footer-description">
                        Your trusted partner for premium bike rentals. 
                        Explore the world on two wheels with our diverse fleet of high-quality bikes.
                    </p>
                    <div className="social-links">
                        <a href="#" aria-label="Facebook" className="social-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </a>
                        <a href="#" aria-label="Twitter" className="social-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                        </a>
                        <a href="#" aria-label="Instagram" className="social-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297z"/>
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="footer-section">
                    <h3>Company</h3>
                    <ul>
                        {footerLinks.company.map((link) => (
                            <li key={link.name}>
                                <Link to={link.path}>{link.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Services</h3>
                    <ul>
                        {footerLinks.services.map((link) => (
                            <li key={link.name}>
                                <Link to={link.path}>{link.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Support</h3>
                    <ul>
                        {footerLinks.support.map((link) => (
                            <li key={link.name}>
                                <Link to={link.path}>{link.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="footer-section footer-contact">
                    <h3>Get in Touch</h3>
                    <div className="contact-info">
                        <div className="contact-item">
                            <span className="contact-icon">📧</span>
                            <span>rohithganesh.kanchi2023@vitstudent.ac.in</span>
                        </div>
                        <div className="contact-item">
                            <span className="contact-icon">📞</span>
                            <span>+91 73056 36052</span>
                        </div>
                        <div className="contact-item">
                            <span className="contact-icon">📍</span>
                            <span>Chennai, Tamil Nadu, India</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <p>&copy; {currentYear} BikeRent. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <Link to="/terms">Terms</Link>
                        <Link to="/privacy">Privacy</Link>
                        <Link to="/cookies">Cookies</Link>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
};
export default Footer;