import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
export const AppContext = createContext();
export const AppProvider = ({ children }) => {
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY || '$';
    const [token, setToken] = useState(localStorage.getItem('admin_token'));
    const [admin, setAdmin] = useState(null);
    const login = (newToken) => {
        localStorage.setItem('admin_token', newToken);
        setToken(newToken);
        axios.defaults.headers.common['Authorization'] = newToken;
        fetchAdminData(newToken);
        navigate('/');
    };
    
    const logout = () => {
        localStorage.removeItem('admin_token');
        setToken(null);
        setAdmin(null);
        delete axios.defaults.headers.common['Authorization'];
        navigate('/login');
        toast.success("Logged out successfully");
    };
    const fetchAdminData = async (currentToken) => {
        try {
            const { data } = await axios.get('/api/user/data', {
                headers: { Authorization: currentToken }
            });
            if (data.success && data.user.role === 'admin') {
                setAdmin(data.user);
            } else {
logout();
            }
        } catch (error) {
logout();
        }
    };
    
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            fetchAdminData(token);
        }
    }, [token]);
    const value = {
        token,
        admin,
        login,
        logout,
        axios,
        currency,
        navigate
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