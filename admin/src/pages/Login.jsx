import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import './Login.css';

const Login = () => {
    const { login, axios } = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await axios.post('/api/user/login', { email, password });
            if (data.success) {
                // Check if the user is an admin before logging in
                const userResponse = await axios.get('/api/user/data', {
                    headers: { Authorization: data.token }
                });
                if (userResponse.data.success && userResponse.data.user.role === 'admin') {
                    login(data.token);
                    toast.success("Admin login successful!");
                } else {
                    toast.error("You are not authorized to access the admin panel.");
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("An error occurred during login.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1>🚴 Bike Rental</h1>
                    <h2>Admin Panel</h2>
                    <p>Please sign in to access the admin dashboard</p>
                </div>
                
                <form className="login-form-admin" onSubmit={handleLogin}>
                    <div className="form-group-admin">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="form-group-admin">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" disabled={isLoading} className="login-button">
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                
                <div className="login-footer">
                    <p>Only authorized administrators can access this panel</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
