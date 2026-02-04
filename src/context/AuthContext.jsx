import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // Store phone temporarily for registration flow
    const [pendingPhone, setPendingPhone] = useState(null);

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const res = await api.get('/auth/me');
                if (res.data.success) {
                    setUser(res.data.user);
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                console.error("Auth Check Failed:", error);
                localStorage.removeItem('token');
                setIsAuthenticated(false);
                setUser(null);
            }
        }
        setLoading(false);
    };

    const sendOtp = async (phone) => {
        try {
            // Store phone for registration flow
            setPendingPhone(phone);
            const res = await api.post('/auth/send-otp', { phone });
            return res.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to send OTP';
        }
    };

    const verifyOtp = async (phone, otp) => {
        try {
            const res = await api.post('/auth/verify-otp', { phone, otp });

            if (res.data.isNewUser) {
                // New user - don't set auth yet, wait for registration
                setPendingPhone(phone);
                return { isNewUser: true };
            } else {
                // Existing user - set auth
                localStorage.setItem('token', res.data.token);
                setUser(res.data.user);
                setIsAuthenticated(true);
                return { isNewUser: false, user: res.data.user };
            }
        } catch (error) {
            throw error.response?.data?.message || 'OTP verification failed';
        }
    };

    const register = async (name, role) => {
        if (!pendingPhone) {
            throw 'Phone number not found. Please verify OTP first.';
        }

        try {
            const res = await api.post('/auth/register', {
                phone: pendingPhone,
                name,
                role
            });

            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            setIsAuthenticated(true);
            setPendingPhone(null);
            return res.data.user;
        } catch (error) {
            throw error.response?.data?.message || 'Registration failed';
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (e) {
            console.error(e);
        }
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        setPendingPhone(null);
    };

    // Alias for backward compatibility
    const login = verifyOtp;

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated,
            pendingPhone,
            login,
            verifyOtp,
            register,
            logout,
            sendOtp
        }}>
            {children}
        </AuthContext.Provider>
    );
};
