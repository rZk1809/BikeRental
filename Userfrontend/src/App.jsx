import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import BikeDetails from './pages/BikeDetails';
import Bikes from './pages/Bikes';
import AboutUs from './pages/AboutUs';
import MyBookings from './pages/MyBookings';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import BookingSuccess from './pages/BookingSuccess';
import BookingCancelled from './pages/BookingCancelled';
import Footer from './components/Footer';
import Login from './components/Login';
import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext';

const App = () => {
    const { showLogin } = useAppContext();

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <ScrollToTop />
            {showLogin && <Login />}
            <Navbar />
            <main>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/bike-details/:id' element={<BikeDetails />} />
                    <Route path='/bikes' element={<Bikes />} />
                    <Route path='/about' element={<AboutUs />} />
                    <Route path='/my-bookings' element={<MyBookings />} />
                    <Route path='/verify-email' element={<VerifyEmail />} />
                    <Route path='/forgot-password' element={<ForgotPassword />} />
                    <Route path='/reset-password' element={<ResetPassword />} />
                    <Route path='/booking-success' element={<BookingSuccess />} />
                    <Route path='/booking-cancelled' element={<BookingCancelled />} />
                </Routes>
            </main>
            <Footer />
        </>
    );
};

export default App;
