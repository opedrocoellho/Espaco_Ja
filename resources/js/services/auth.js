import api from './api';

export const authService = {
    async login(credentials) {
        // Sanitizar credenciais
        const sanitizedCredentials = {
            email: credentials.email?.trim().toLowerCase(),
            password: credentials.password?.trim()
        };
        
        // Validar formato do email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sanitizedCredentials.email)) {
            throw new Error('Formato de email inválido');
        }
        
        const response = await api.post('/login', sanitizedCredentials);
        const { token, user } = response.data;
        
        // Sanitizar dados antes de armazenar
        const sanitizedUser = {
            ...user,
            name: user.name?.replace(/<[^>]*>/g, ''),
            email: user.email?.replace(/<[^>]*>/g, '')
        };
        
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(sanitizedUser));
        
        return { token, user };
    },

    async register(userData) {
        // Sanitizar dados do usuário
        const sanitizedData = {
            name: userData.name?.trim().replace(/<[^>]*>/g, ''), // Remove HTML tags
            email: userData.email?.trim().toLowerCase(),
            password: userData.password?.trim(),
            password_confirmation: userData.password_confirmation?.trim(),
            whatsapp: userData.whatsapp?.replace(/\D/g, '') // Apenas números
        };
        
        // Validar formato do email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sanitizedData.email)) {
            throw new Error('Formato de email inválido');
        }
        
        const response = await api.post('/register', sanitizedData);
        const { token, user } = response.data;
        
        // Sanitizar dados antes de armazenar
        const sanitizedUser = {
            ...user,
            name: user.name?.replace(/<[^>]*>/g, ''),
            email: user.email?.replace(/<[^>]*>/g, '')
        };
        
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(sanitizedUser));
        
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
        if (!user) return null;
        try {
            const parsedUser = JSON.parse(user);
            // Sanitize user data
            if (parsedUser && typeof parsedUser === 'object') {
                return {
                    ...parsedUser,
                    name: parsedUser.name?.replace(/<[^>]*>/g, ''),
                    email: parsedUser.email?.replace(/<[^>]*>/g, '')
                };
            }
            return null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    },

    getToken() {
        return localStorage.getItem('auth_token');
    },

    isAuthenticated() {
        return !!this.getToken();
    }
};

export default authService;