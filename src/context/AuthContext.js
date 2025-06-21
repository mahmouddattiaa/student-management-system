import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if token exists and is valid on component mount
    useEffect(() => {
        const checkAuth = async() => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setIsLoading(false);
                    return;
                }

                // Check if token is expired
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                    setIsLoading(false);
                    return;
                }

                // Set axios default header
                axios.defaults.headers.common['x-auth-token'] = token;

                // Get user data from API
                const response = await axios.get('http://localhost:5000/api/auth/user');
                setUser(response.data);
                setIsAuthenticated(true);
                setIsLoading(false);
            } catch (err) {
                console.error('Auth Error:', err);
                localStorage.removeItem('token');
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const register = async(userData) => {
        setError(null);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', userData);
            const { token } = response.data;

            localStorage.setItem('token', token);
            axios.defaults.headers.common['x-auth-token'] = token;

            setUser(response.data.user);
            setIsAuthenticated(true);
            return true;
        } catch (err) {
            const errorMessage = err.response && err.response.data && err.response.data.error ?
                err.response.data.error :
                'Registration failed';
            setError(errorMessage);
            return false;
        }
    };

    const login = async(userData) => {
        setError(null);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', userData);
            const { token } = response.data;

            localStorage.setItem('token', token);
            axios.defaults.headers.common['x-auth-token'] = token;

            setUser(response.data.user);
            setIsAuthenticated(true);
            return true;
        } catch (err) {
            const errorMessage = err.response && err.response.data && err.response.data.error ?
                err.response.data.error :
                'Login failed';
            setError(errorMessage);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
        setUser(null);
        setIsAuthenticated(false);
    };

    const clearError = () => {
        setError(null);
    };

    return ( <
        AuthContext.Provider value = {
            {
                user,
                isAuthenticated,
                isLoading,
                error,
                register,
                login,
                logout,
                clearError
            }
        } >
        { children } <
        /AuthContext.Provider>
    );
};

export default AuthContext;