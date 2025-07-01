import React from 'react';
import { Outlet } from 'react-router-dom';
import NavbarAdmin from '../components/NavbarAdmin';
import Sidebar from '../components/Sidebar';
import './Layout.css';
const Layout = () => {
    return (
        <div className="admin-layout">
            <NavbarAdmin />
            <div className="admin-content">
                <Sidebar />
                <main className="admin-main">
                    <div className="admin-main-content">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
export default Layout;