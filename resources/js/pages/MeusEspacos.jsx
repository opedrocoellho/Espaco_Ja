import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MeusEspacos = () => {
    const [espacos, setEspacos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEspacos();
    }, []);

    const fetchEspacos = async () => {
        try {
            const response = await axios.get('/api/dashboard/meus-espacos', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            setEspacos(response.data.data || []);
        } catch (error) {
            console.error('Erro ao carregar espaços:', error);
            setEspacos([]);
        } finally {
            setLoading(false);
        }
    };

    const removerEspaco = async (id) => {
        if (!confirm('Tem certeza que deseja remover este espaço?')) {
            return;
        }

        try {
            // Validar ID
            const espacoId = parseInt(id);
            if (isNaN(espacoId) || espacoId <= 0) {
                throw new Error('ID do espaço inválido');
            }
            
            // Validate CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!csrfToken || csrfToken.length < 10) {
                throw new Error('CSRF token not found or invalid');
            }
            
            await axios.delete(`/api/espacos/${espacoId}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken
                },
                withCredentials: true
            });
            setEspacos(espacos.filter(espaco => espaco.id !== espacoId));
        } catch (error) {
            console.error('Erro ao remover espaço:', error);
            alert('Erro ao remover espaço');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Meus Espaços</h1>
                <Link to="/espacos/novo" className="btn-primary">
                    + Novo Espaço
                </Link>
            </div>

            {espacos.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {espacos.map((espaco) => (
                        <div key={espaco.id} className="card">
                            <div className="aspect-w-16 aspect-h-9 mb-4">
                                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                                    {espaco.imagens && espaco.imagens.length > 0 ? (
                                        <img 
                                            src={`/storage/${espaco.imagens[0]}`}
                                            alt={espaco.nome}
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    ) : null}
                                    <span className="text-gray-500" style={{ display: (espaco.imagens && espaco.imagens.length > 0) ? 'none' : 'block' }}>
                                        Sem imagem
                                    </span>
                                </div>
                            </div>
                            
                            <h3 className="text-lg font-semibold mb-2">{espaco.nome}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {espaco.descricao}
                            </p>
                            
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-gray-500">
                                    📍 {espaco.cidade}, {espaco.estado}
                                </span>
                                <span className="text-sm text-gray-500">
                                    👥 {espaco.capacidade} pessoas
                                </span>
                            </div>
                            
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xl font-bold text-primary-600">
                                    R$ {parseFloat(espaco.preco_por_hora).toFixed(2)}/hora
                                </span>
                                <span className="text-sm text-gray-500">
                                    {espaco.reservas_count || 0} reservas
                                </span>
                            </div>
                            
                            <div className="flex gap-2">
                                <Link 
                                    to={`/espacos/${espaco.id}/editar`}
                                    className="flex-1 btn-secondary text-center text-sm"
                                >
                                    Editar
                                </Link>
                                <Link 
                                    to={`/espacos/${espaco.id}`}
                                    className="flex-1 btn-primary text-center text-sm"
                                >
                                    Ver
                                </Link>
                                <button
                                    onClick={() => removerEspaco(espaco.id)}
                                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏢</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Nenhum espaço cadastrado
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Comece criando seu primeiro espaço
                    </p>
                    <Link to="/espacos/novo" className="btn-primary">
                        Criar Primeiro Espaço
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MeusEspacos;