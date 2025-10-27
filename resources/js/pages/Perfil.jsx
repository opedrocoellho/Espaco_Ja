import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Perfil = () => {
    const { user } = useAuth();
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('reservas');

    useEffect(() => {
        fetchReservas();
    }, []);

    const fetchReservas = async () => {
        try {
            // Validate CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await axios.get('/api/reservas', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken })
                }
            });
            const reservasData = Array.isArray(response.data) ? response.data : (response.data.data || []);
            setReservas(reservasData);
        } catch (error) {
            console.error('Erro ao carregar reservas:', error);
            setReservas([]);
        } finally {
            setLoading(false);
        }
    };

    const cancelarReserva = async (id) => {
        if (!confirm('Tem certeza que deseja cancelar esta reserva?')) {
            return;
        }

        try {
            // Validar ID da reserva
            const reservaId = parseInt(id);
            if (isNaN(reservaId) || reservaId <= 0) {
                throw new Error('ID da reserva inválido');
            }
            
            // Validate CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!csrfToken) {
                throw new Error('CSRF token not found');
            }
            
            await axios.delete(`/api/reservas/${reservaId}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken
                },
                withCredentials: true
            });
            setReservas(reservas.map(reserva => 
                reserva.id === reservaId 
                    ? { ...reserva, status: 'cancelada' }
                    : reserva
            ));
        } catch (error) {
            console.error('Erro ao cancelar reserva:', error);
            alert('Erro ao cancelar reserva');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmada':
                return 'bg-green-100 text-green-800';
            case 'pendente':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelada':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('reservas')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'reservas'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Minhas Reservas
                    </button>
                    <button
                        onClick={() => setActiveTab('dados')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'dados'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Dados Pessoais
                    </button>
                </nav>
            </div>

            {/* Conteúdo das Tabs */}
            {activeTab === 'reservas' && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Histórico de Reservas</h2>
                    
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="card animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : Array.isArray(reservas) && reservas.length > 0 ? (
                        <div className="space-y-4">
                            {reservas.map((reserva) => (
                                <div key={reserva.id} className="card">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                {reserva.espaco.nome}
                                            </h3>
                                            <p className="text-gray-600">
                                                📍 {reserva.espaco.cidade}, {reserva.espaco.estado}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reserva.status)}`}>
                                            {reserva.status.charAt(0).toUpperCase() + reserva.status.slice(1)}
                                        </span>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Data</p>
                                            <p className="font-medium">{formatDate(reserva.data)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Horário</p>
                                            <p className="font-medium">
                                                {reserva.horario_inicio} às {reserva.horario_fim}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Valor Total</p>
                                            <p className="font-medium text-primary-600">
                                                R$ {parseFloat(reserva.valor_total).toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Criada em</p>
                                            <p className="font-medium">
                                                {formatDate(reserva.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                    {reserva.observacoes && (
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-600">Observações</p>
                                            <p className="text-sm">{reserva.observacoes}</p>
                                        </div>
                                    )}

                                    {reserva.status === 'pendente' && (
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => cancelarReserva(reserva.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                                            >
                                                Cancelar Reserva
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📅</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Nenhuma reserva encontrada
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Você ainda não fez nenhuma reserva
                            </p>
                            <a href="/espacos" className="btn-primary">
                                Explorar Espaços
                            </a>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'dados' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Informações Pessoais</h2>
                        <Link to="/perfil/editar" className="btn-primary text-sm">
                            Editar Perfil
                        </Link>
                    </div>
                    
                    <div className="card max-w-md">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nome
                                </label>
                                <p className="mt-1 text-sm text-gray-900">{user?.name}</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                            </div>
                            
                            {user?.whatsapp && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        WhatsApp
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">{user.whatsapp}</p>
                                </div>
                            )}
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Membro desde
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {formatDate(user?.created_at)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Perfil;