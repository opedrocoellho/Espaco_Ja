import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import EspacoCard from '../components/EspacoCard';

const Espacos = () => {
    const [espacos, setEspacos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtros, setFiltros] = useState({
        busca: '',
        cidade: '',
        capacidade: '',
        amenidades: '',
    });
    const [searchParams] = useSearchParams();

    useEffect(() => {
        // Carregar filtros da URL
        const buscaParam = searchParams.get('busca') || '';
        setFiltros(prev => ({ ...prev, busca: buscaParam }));
        
        fetchEspacos({ busca: buscaParam });
    }, [searchParams]);

    const fetchEspacos = async (params = {}) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            
            Object.entries({ ...filtros, ...params }).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });

            const response = await axios.get(`/api/espacos?${queryParams}`);
            const espacosData = Array.isArray(response.data) ? response.data : (response.data.data || []);
            setEspacos(espacosData);
        } catch (error) {
            console.error('Erro ao carregar espaços:', error);
            setEspacos([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const aplicarFiltros = (e) => {
        e.preventDefault();
        fetchEspacos();
    };

    const limparFiltros = () => {
        setFiltros({
            busca: '',
            cidade: '',
            capacidade: '',
            amenidades: '',
        });
        fetchEspacos({
            busca: '',
            cidade: '',
            capacidade: '',
            amenidades: '',
        });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Espaços Disponíveis</h1>

            {/* Filtros */}
            <div className="card mb-8">
                <form onSubmit={aplicarFiltros}>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Buscar
                            </label>
                            <input
                                type="text"
                                name="busca"
                                value={filtros.busca}
                                onChange={handleFiltroChange}
                                placeholder="Nome, cidade, descrição..."
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cidade
                            </label>
                            <select
                                name="cidade"
                                value={filtros.cidade}
                                onChange={handleFiltroChange}
                                className="input-field"
                            >
                                <option value="">Todas as cidades</option>
                                <option value="São Paulo">São Paulo</option>
                                <option value="Rio de Janeiro">Rio de Janeiro</option>
                                <option value="Belo Horizonte">Belo Horizonte</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Capacidade Mínima
                            </label>
                            <input
                                type="number"
                                name="capacidade"
                                value={filtros.capacidade}
                                onChange={handleFiltroChange}
                                placeholder="Ex: 10"
                                className="input-field"
                                min="1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Comodidades
                            </label>
                            <select
                                name="amenidades"
                                value={filtros.amenidades}
                                onChange={handleFiltroChange}
                                className="input-field"
                            >
                                <option value="">Todas</option>
                                <option value="Wi-Fi">Wi-Fi</option>
                                <option value="Projetor">Projetor</option>
                                <option value="Ar Condicionado">Ar Condicionado</option>
                                <option value="Estacionamento">Estacionamento</option>
                                <option value="Café">Café</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button type="submit" className="btn-primary">
                            Aplicar Filtros
                        </button>
                        <button 
                            type="button" 
                            onClick={limparFiltros}
                            className="btn-secondary"
                        >
                            Limpar
                        </button>
                    </div>
                </form>
            </div>

            {/* Resultados */}
            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }, (_, i) => (
                        <div key={i} className="card animate-pulse">
                            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded mb-3"></div>
                            <div className="h-3 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            ) : Array.isArray(espacos) && espacos.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {espacos.map((espaco) => (
                        <EspacoCard key={espaco.id} espaco={espaco} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Nenhum espaço encontrado
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Tente ajustar os filtros ou buscar por outros termos
                    </p>
                    <button onClick={limparFiltros} className="btn-primary">
                        Limpar Filtros
                    </button>
                </div>
            )}
        </div>
    );
};

export default Espacos;