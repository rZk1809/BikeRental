import React from 'react';
import { useAppContext } from '../context/AppContext';
import './NavbarAdmin.css';
const NavbarAdmin = () => {
    const { admin, logout } = useAppContext();
    return (
        <nav className="navbar-admin">
            <div className="navbar-admin-brand">
                <h2>🚴 Bike Rental Admin</h2>
            </div>
            <div className="navbar-admin-user">
                <span>Welcome, {admin?.name || 'Admin'}</span>
                <button onClick={logout} className="logout-button">Logout</button>
            </div>
        </nav>
    );
};
export default NavbarAdmin;