// AuthContext - Authentication state management for the frontend
// This provides user login state and functions to all components

import { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext(null);

// API base URL
const API_URL = 'http://localhost:5000/api';

// Provider component that wraps the app
export function AuthProvider({ children }) {
    // State for user data and loading status
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Check if user is logged in when app loads
    useEffect(() => {
        checkAuth();
    }, []);

    // Function to check if user is authenticated
    async function checkAuth() {
        const savedToken = localStorage.getItem('token');
        
        if (!savedToken) {
            setLoading(false);
            return;
        }

        try {
            // Call the /me endpoint to get user data
            const response = await fetch(`${API_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${savedToken}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setUser(data.user);
                setToken(savedToken);
            } else {
                // Token is invalid, clear it
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            }
        } catch (error) {
            console.error('Auth check failed:', error.message);
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    // Login function
    async function login(email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                // Save token to localStorage
                localStorage.setItem('token', data.token);
                setToken(data.token);
                setUser(data.user);
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Login failed:', error.message);
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    // Logout function
    function logout() {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    }

    // Value to provide to all components
    const value = {
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token
    };

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use the auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
