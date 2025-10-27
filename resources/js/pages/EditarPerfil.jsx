import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const EditarPerfil = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        whatsapp: user?.whatsapp || '',
        tipo_usuario: user?.tipo_usuario || 'locatario',
        descricao: user?.descricao || '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setMessage('');

        if (formData.password && formData.password !== formData.password_confirmation) {
            setErrors({ password_confirmation: ['As senhas não coincidem'] });
            setLoading(false);
            return;
        }

        try {
            const dataToSend = { ...formData };
            if (!dataToSend.password) {
                delete dataToSend.password;
                delete dataToSend.password_confirmation;
            }

            // Sanitizar dados antes do envio
            const dadosSanitizados = {
                ...dataToSend,
                name: dataToSend.name?.trim().replace(/<[^>]*>/g, ''),
                email: dataToSend.email?.trim().toLowerCase(),
                whatsapp: dataToSend.whatsapp?.replace(/\D/g, ''),
                descricao: dataToSend.descricao?.trim().replace(/<[^>]*>/g, '')
            };
            
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(dadosSanitizados.email)) {
                throw new Error('Formato de email inválido');
            }
            
            // Validate CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!csrfToken) {
                throw new Error('CSRF token not found');
            }
            if (csrfToken.length < 40) {
                throw new Error('Invalid CSRF token format');
            }
            
            await axios.put('/perfil', dadosSanitizados, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken
                },
                withCredentials: true
            });
            setMessage('Perfil atualizado com sucesso!');
            setTimeout(() => navigate('/perfil'), 2000);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: [error.response?.data?.message || 'Erro ao atualizar perfil'] });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="card">
                <h1 className="text-2xl font-bold mb-6">Editar Perfil</h1>
                
                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {message}
                    </div>
                )}

                {errors.general && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {errors.general[0]}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome Completo *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            WhatsApp
                        </label>
                        <input
                            type="text"
                            name="whatsapp"
                            value={formData.whatsapp}
                            onChange={handleChange}
                            placeholder="(11) 99999-9999"
                            className="input-field"
                        />
                        {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Usuário
                        </label>
                        <select
                            name="tipo_usuario"
                            value={formData.tipo_usuario}
                            onChange={handleChange}
                            className="input-field"
                        >
                            <option value="locatario">Locatário (apenas alugo espaços)</option>
                            <option value="anfitriao">Anfitrião (apenas ofereço espaços)</option>
                            <option value="ambos">Ambos (alugo e ofereço espaços)</option>
                        </select>
                        {errors.tipo_usuario && <p className="text-red-500 text-xs mt-1">{errors.tipo_usuario[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descrição
                        </label>
                        <textarea
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            rows="3"
                            className="input-field"
                            placeholder="Conte um pouco sobre você..."
                        />
                        {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao[0]}</p>}
                    </div>

                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium mb-4">Alterar Senha</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nova Senha
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Deixe em branco para manter a atual"
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirmar Nova Senha
                                </label>
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                                {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation[0]}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between pt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/perfil')}
                            className="btn-secondary"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary disabled:opacity-50"
                        >
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarPerfil;