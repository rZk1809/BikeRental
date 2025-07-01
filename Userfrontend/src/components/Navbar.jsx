import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import './Navbar.css';
const menuLinks = [
    { name: "Home", path: "/" },
    { name: "Bikes", path: "/bikes" },
    { name: "About Us", path: "/about" },
    { name: "My Bookings", path: "/my-bookings" },
];
const Navbar = () => {
    const { user, logout, setShowLogin } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const closeMenu = () => setIsOpen(false);
    return (
        <motion.nav 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='navbar'
        >
            <Link to='/' className='navbar-logo'>
                BIKERENT
            </Link>
            <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
                <ul>
                    {menuLinks.map((link) => (
                        <li key={link.name}>
                            <NavLink to={link.path} onClick={closeMenu}>
                                {link.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
                <div className="navbar-actions">
                    <a href={import.meta.env.VITE_ADMIN_URL || "http://localhost:5174"} target="_blank" rel="noopener noreferrer" className="list-bike-button">
                        List Your Bike
                    </a>
                    <button onClick={() => user ? logout() : setShowLogin(true)} className="login-button">
                        {user ? 'Logout' : 'Login'}
                    </button>
                </div>
            </div>
            <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>
        </motion.nav>
    );
};
export default Navbar;