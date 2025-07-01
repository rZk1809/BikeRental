import React from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';
import AddBike from './pages/AddBike';
import ManageBikes from './pages/ManageBikes';
import ManageBookings from './pages/ManageBookings';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext';

const App = () => {
    const { token } = useAppContext();
    const location = useLocation();

    // If not logged in and not on the login page, redirect to login
    if (!token && location.pathname !== '/login') {
        return <Navigate to="/login" />;
    }

    // If logged in and on the login page, redirect to dashboard
    if (token && location.pathname === '/login') {
        return <Navigate to="/" />;
    }
    
    return (
        <>
            <Toaster />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="add-bike" element={<AddBike />} />
                    <Route path="manage-bikes" element={<ManageBikes />} />
                    <Route path="manage-bookings" element={<ManageBookings />} />
                </Route>
            </Routes>
        </>
    );
};

export default App;
