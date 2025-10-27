import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const [dados, setDados] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await axios.get('/api/dashboard/anfitriao');
            setDados(response.data);
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!dados) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h2>
                <p className="text-gray-600 mb-6">Você precisa ser um anfitrião para acessar esta página.</p>
                <Link to="/tornar-anfitriao" className="btn-primary">
                    Tornar-se Anfitrião
                </Link>
            </div>
        );
    }

    const { 
        estatisticas = {}, 
        reservas_recentes = [], 
        espacos_populares = [], 
        espacos = [] 
    } = dados || {};

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Dashboard do Anfitrião</h1>
                <Link to="/espacos/novo" className="btn-primary">
                    + Novo Espaço
                </Link>
            </div>

            {/* Estatísticas */}
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <div className="card text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">
                        {estatisticas?.total_espacos || 0}
                    </div>
                    <div className="text-sm text-gray-600">Espaços Cadastrados</div>
                </div>
                <div className="card text-center">
                    <div className="text-3xl font-bold text-primary-500 mb-2">
                        {estatisticas?.total_reservas || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total de Reservas</div>
                </div>
                <div className="card text-center">
                    <div className="text-3xl font-bold text-primary-400 mb-2">
                        {estatisticas?.reservas_hoje || 0}
                    </div>
                    <div className="text-sm text-gray-600">Reservas Hoje</div>
                </div>
                <div className="card text-center">
                    <div className="text-3xl font-bold text-primary-700 mb-2">
                        R$ {parseFloat(estatisticas?.receita_mes || 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Receita do Mês</div>
                </div>
                <div className="card text-center">
                    <div className="text-3xl font-bold text-primary-800 mb-2">
                        R$ {parseFloat(estatisticas?.receita_total || 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Receita Total</div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Reservas Recentes */}
                <div className="card">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Reservas Recentes</h2>
                        <Link to="/dashboard/reservas" className="text-primary-600 hover:underline text-sm">
                            Ver todas
                        </Link>
                    </div>
                    
                    {reservas_recentes && reservas_recentes.length > 0 ? (
                        <div className="space-y-3">
                            {reservas_recentes.map((reserva) => (
                                <div key={reserva.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <div className="font-medium">{reserva.espaco.nome}</div>
                                        <div className="text-sm text-gray-600">
                                            {reserva.user.name} • {new Date(reserva.data).toLocaleDateString('pt-BR')}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium text-primary-600">
                                            R$ {parseFloat(reserva.valor_total).toFixed(2)}
                                        </div>
                                        <div className={`text-xs px-2 py-1 rounded-full ${
                                            reserva.status === 'confirmada' ? 'bg-green-100 text-green-800' :
                                            reserva.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {reserva.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">Nenhuma reserva recente</p>
                    )}
                </div>

                {/* Espaços Populares */}
                <div className="card">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Espaços Mais Populares</h2>
                        <Link to="/dashboard/meus-espacos" className="text-primary-600 hover:underline text-sm">
                            Ver todos
                        </Link>
                    </div>
                    
                    {espacos_populares && espacos_populares.length > 0 ? (
                        <div className="space-y-3">
                            {espacos_populares.map((espaco) => (
                                <div key={espaco.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <div className="font-medium">{espaco.nome}</div>
                                        <div className="text-sm text-gray-600">
                                            {espaco.cidade}, {espaco.estado}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium text-primary-600">
                                            {espaco.total_reservas} reservas
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            R$ {parseFloat(espaco.preco_por_hora).toFixed(2)}/hora
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">Nenhum espaço cadastrado</p>
                    )}
                </div>
            </div>

            {/* Ações Rápidas */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
                <div className="grid md:grid-cols-4 gap-4">
                    <Link to="/espacos/novo" className="card hover:shadow-lg transition-shadow text-center">
                        <div className="text-3xl mb-2">➕</div>
                        <div className="font-medium">Novo Espaço</div>
                    </Link>
                    <Link to="/dashboard/meus-espacos" className="card hover:shadow-lg transition-shadow text-center">
                        <div className="text-3xl mb-2">🏢</div>
                        <div className="font-medium">Meus Espaços</div>
                    </Link>
                    <Link to="/dashboard/reservas" className="card hover:shadow-lg transition-shadow text-center">
                        <div className="text-3xl mb-2">📅</div>
                        <div className="font-medium">Reservas</div>
                    </Link>
                    <Link to="/mensagens" className="card hover:shadow-lg transition-shadow text-center">
                        <div className="text-3xl mb-2">💬</div>
                        <div className="font-medium">Mensagens</div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;