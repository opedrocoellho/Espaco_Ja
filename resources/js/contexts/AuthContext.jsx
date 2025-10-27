import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    axios.defaults.headers.common['Accept'] = 'application/json';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.withCredentials = true;

    axios.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
            config.headers['X-CSRF-TOKEN'] = csrfToken;
        }
        
        return config;
    });

    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401 && localStorage.getItem('token')) {
                localStorage.removeItem('token');
                setUser(null);
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            checkAuth();
        } else {
            setLoading(false);
        }
    }, []);

    const checkAuth = async () => {
        try {
            const response = await axios.get('/api/user');
            setUser(response.data);
        } catch (error) {
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const sanitizedEmail = email.trim().toLowerCase();
        const sanitizedPassword = password.trim();
        
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (!csrfToken) {
            throw new Error('CSRF token not found');
        }
        
        const response = await axios.post('/api/login', { 
            email: sanitizedEmail, 
            password: sanitizedPassword
        }, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'X-Requested-With': 'XMLHttpRequest'
            },
            withCredentials: true
        });
        const { user, token } = response.data;
        
        localStorage.setItem('token', token);
        setUser(user);
        
        return user;
    };

    const register = async (userData) => {
        const sanitizedData = {
            ...userData,
            name: userData.name?.trim(),
            email: userData.email?.trim().toLowerCase(),
            whatsapp: userData.whatsapp?.replace(/\D/g, '')
        };
        
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (!csrfToken) {
            throw new Error('CSRF token not found');
        }
        
        const response = await axios.post('/api/register', sanitizedData, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'X-Requested-With': 'XMLHttpRequest'
            },
            withCredentials: true
        });
        const { user, token } = response.data;
        
        localStorage.setItem('token', token);
        setUser(user);
        
        return user;
    };

    const logout = async () => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            await axios.post('/api/logout', {
                _token: csrfToken
            }, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken })
                },
                withCredentials: true
            });
        } catch (error) {
            // Ignorar erros de logout
        } finally {
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};