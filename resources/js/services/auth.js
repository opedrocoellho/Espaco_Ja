import api from './api';

export const authService = {
    async login(credentials) {
        const response = await api.post('/login', credentials);
        const { token, user } = response.data;
        
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return { token, user };
    },

    async register(userData) {
        const response = await api.post('/register', userData);
        const { token, user } = response.data;
        
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return { token, user };
    },

    async logout() {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        }
    },

    async getUser() {
        const response = await api.get('/user');
        return response.data;
    },

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    getToken() {
        return localStorage.getItem('auth_token');
    },

    isAuthenticated() {
        return !!this.getToken();
    }
};

export default authService;