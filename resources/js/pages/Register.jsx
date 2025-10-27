import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        whatsapp: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        if (formData.password !== formData.password_confirmation) {
            setErrors({ password_confirmation: ['As senhas não coincidem'] });
            setLoading(false);
            return;
        }

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                whatsapp: formData.whatsapp,
            });
            navigate('/');
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: [error.response?.data?.message || 'Erro ao criar conta'] });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="card">
                <h1 className="text-2xl font-bold text-center mb-6">Criar Conta</h1>
                
                {errors.general && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {errors.general[0]}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Nome Completo
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            WhatsApp (opcional)
                        </label>
                        <input
                            type="text"
                            name="whatsapp"
                            value={formData.whatsapp}
                            onChange={handleChange}
                            placeholder="(11) 99999-9999"
                            className="input-field"
                        />
                        {errors.whatsapp && (
                            <p className="text-red-500 text-xs mt-1">{errors.whatsapp[0]}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Senha
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Confirmar Senha
                        </label>
                        <input
                            type="password"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                        {errors.password_confirmation && (
                            <p className="text-red-500 text-xs mt-1">{errors.password_confirmation[0]}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary disabled:opacity-50"
                    >
                        {loading ? 'Criando conta...' : 'Criar Conta'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Já tem uma conta?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Entrar
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;