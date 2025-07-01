import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const adminMenuLinks = [
    { name: "📊 Dashboard", path: "/" },
    { name: "➕ Add Bike", path: "/add-bike" },
    { name: "🚴 Manage Bikes", path: "/manage-bikes" },
    { name: "📋 Manage Bookings", path: "/manage-bookings" },
];

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <nav>
                <ul>
                    {adminMenuLinks.map((link) => (
                        <li key={link.name}>
                            <NavLink 
                                to={link.path} 
                                className={({ isActive }) => isActive ? 'active' : ''}
                                end
                            >
                                {link.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
