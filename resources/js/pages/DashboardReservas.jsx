import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardReservas = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('todas');
    const [error, setError] = useState(null);

    const atualizarStatus = async (reservaId, novoStatus) => {
        try {
            // Validar status permitidos
            const statusPermitidos = ['pendente', 'confirmada', 'cancelada'];
            if (!statusPermitidos.includes(novoStatus)) {
                throw new Error('Status inválido');
            }
            
            // Validar ID da reserva
            const reservaIdNum = parseInt(reservaId);
            if (isNaN(reservaIdNum) || reservaIdNum <= 0) {
                throw new Error('ID da reserva inválido');
            }
            
            // Validate API endpoint to prevent SSRF
            const apiEndpoint = `/api/dashboard/reservas-recebidas/${reservaIdNum}`;
            if (!apiEndpoint.startsWith('/api/dashboard/reservas-recebidas/')) {
                throw new Error('Invalid API endpoint');
            }
            
            // Validate CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!csrfToken) {
                throw new Error('CSRF token not found');
            }
            
            await axios.put(apiEndpoint, 
                { status: novoStatus },
                {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    withCredentials: true
                }
            );
            fetchReservas();
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            setError('Erro ao atualizar status da reserva');
        }
    };

    useEffect(() => {
        fetchReservas();
    }, [filtro]);

    const fetchReservas = async () => {
        try {
            setError(null);
            
            // Validar filtro
            const filtrosPermitidos = ['todas', 'pendente', 'confirmada', 'cancelada'];
            const filtroSeguro = filtrosPermitidos.includes(filtro) ? filtro : 'todas';
            
            const params = filtroSeguro !== 'todas' ? `?status=${encodeURIComponent(filtroSeguro)}` : '';
            const response = await axios.get(`/api/dashboard/reservas-recebidas${params}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            const reservasData = Array.isArray(response.data) ? response.data : (response.data.data || []);
            setReservas(reservasData);
        } catch (error) {
            console.error('Erro ao carregar reservas:', error);
            const errorMessage = error.response?.status === 403 
                ? 'Acesso negado' 
                : 'Erro ao carregar reservas';
            setError(errorMessage);
            setReservas([]);
        } finally {
            setLoading(false);
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

    const reservasFiltradas = Array.isArray(reservas) ? reservas.filter(reserva => {
        if (filtro === 'todas') return true;
        return reserva.status === filtro;
    }) : [];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-red-600 mb-2">Erro</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button 
                    onClick={() => {
                        setError(null);
                        setLoading(true);
                        fetchReservas();
                    }}
                    className="btn-primary"
                >
                    Tentar Novamente
                </button>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Reservas dos Meus Espaços</h1>

            {/* Filtros */}
            <div className="mb-6">
                <div className="flex space-x-4">
                    {['todas', 'pendente', 'confirmada', 'cancelada'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFiltro(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                filtro === status
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                            <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                                {status === 'todas' 
                                    ? (Array.isArray(reservas) ? reservas.length : 0)
                                    : (Array.isArray(reservas) ? reservas.filter(r => r.status === status).length : 0)
                                }
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Lista de Reservas */}
            {reservasFiltradas.length > 0 ? (
                <div className="space-y-4">
                    {reservasFiltradas.map((reserva) => (
                        <div key={reserva.id} className="card">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {reserva.espaco?.nome || 'Espaço não encontrado'}
                                    </h3>
                                    <p className="text-gray-600">
                                        Cliente: {reserva.user?.name || 'Usuário não encontrado'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        📍 {reserva.espaco?.cidade || ''}, {reserva.espaco?.estado || ''}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reserva.status)}`}>
                                    {reserva.status.charAt(0).toUpperCase() + reserva.status.slice(1)}
                                </span>
                            </div>

                            <div className="grid md:grid-cols-4 gap-4 mb-4">
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
                                    <p className="text-sm text-gray-600">Hóspedes</p>
                                    <p className="font-medium">
                                        {(reserva.adultos || 0) + (reserva.criancas || 0) + (reserva.bebes || 0)} pessoas
                                        {(reserva.pets || 0) > 0 && ` + ${reserva.pets} pets`}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Valor Total</p>
                                    <p className="font-medium text-primary-600">
                                        R$ {parseFloat(reserva.valor_total).toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {reserva.observacoes && (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600">Observações</p>
                                    <p className="text-sm">{reserva.observacoes}</p>
                                </div>
                            )}

                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                    <span>Reserva criada em {formatDate(reserva.created_at)}</span>
                                    <br />
                                    <span>Contato: {reserva.user.whatsapp || reserva.user.email}</span>
                                </div>
                                {reserva.status === 'pendente' && (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => atualizarStatus(reserva.id, 'confirmada')}
                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Confirmar
                                        </button>
                                        <button
                                            onClick={() => atualizarStatus(reserva.id, 'cancelada')}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Recusar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📅</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Nenhuma reserva encontrada
                    </h3>
                    <p className="text-gray-600">
                        {filtro === 'todas' 
                            ? 'Ainda não há reservas para seus espaços'
                            : `Não há reservas com status "${filtro}"`
                        }
                    </p>
                </div>
            )}
        </div>
    );
};

export default DashboardReservas;