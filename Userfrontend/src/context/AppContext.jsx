import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY || '$';
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [bikes, setBikes] = useState([]);

    const fetchUser = async (currentToken) => {
        try {
            const { data } = await axios.get('/api/user/data', {
                headers: { Authorization: currentToken }
            });
            if (data.success) setUser(data.user);
        } catch (error) {
            console.error("Failed to fetch user");
        }
    };

    const fetchBikes = async () => {
        try {
            const { data } = await axios.get('/api/user/bikes');
            if (data.success) setBikes(data.bikes);
        } catch (error) {
            toast.error("Could not fetch bikes.");
        }
    };

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        axios.defaults.headers.common['Authorization'] = newToken;
        fetchUser(newToken);
        setShowLogin(false);
        toast.success('Login Successful!');
    };
    
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        toast.success('You have been logged out');
        navigate('/');
    };

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            fetchUser(token);
        }
        fetchBikes();
    }, [token]);

    const value = {
        navigate, currency, axios, user,
        token, login, logout,
        bikes, showLogin, setShowLogin
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};
