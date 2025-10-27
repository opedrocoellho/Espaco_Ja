import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import EspacoCard from '../components/EspacoCard';

const Home = () => {
    const [espacos, setEspacos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState('');

    useEffect(() => {
        fetchEspacosDestaque();
    }, []);

    const fetchEspacosDestaque = async () => {
        try {
            const response = await axios.get('/api/espacos?per_page=6');
            const espacosData = Array.isArray(response.data) ? response.data : (response.data.data || []);
            setEspacos(espacosData);
        } catch (error) {
            console.error('Erro ao carregar espaços:', error);
            setEspacos([]);
        } finally {
            setLoading(false);
        }
    };

    const handleBusca = (e) => {
        e.preventDefault();
        if (busca.trim()) {
            window.location.href = `/espacos?busca=${encodeURIComponent(busca)}`;
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-20 px-6 rounded-lg mb-12">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Encontre o Espaço Perfeito
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 opacity-90">
                        Salas de reunião, coworking, auditórios e muito mais
                    </p>
                    
                    <form onSubmit={handleBusca} className="max-w-md mx-auto">
                        <div className="flex">
                            <input
                                type="text"
                                placeholder="Buscar por cidade ou tipo de espaço..."
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-white text-primary-600 hover:bg-gray-50 px-6 py-3 rounded-r-lg font-medium transition-colors"
                            >
                                Buscar
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Como Funciona */}
            <div className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🔍</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">1. Busque</h3>
                        <p className="text-gray-600">
                            Encontre o espaço ideal por localização, capacidade e comodidades
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📅</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">2. Reserve</h3>
                        <p className="text-gray-600">
                            Escolha data e horário, verificamos a disponibilidade em tempo real
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">✅</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">3. Utilize</h3>
                        <p className="text-gray-600">
                            Compareça no horário marcado e aproveite seu espaço reservado
                        </p>
                    </div>
                </div>
            </div>

            {/* Espaços em Destaque */}
            <div>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">Espaços em Destaque</h2>
                    <Link to="/espacos" className="btn-primary">
                        Ver Todos
                    </Link>
                </div>

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
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.isArray(espacos) && espacos.length > 0 && espacos.map((espaco) => (
                            <EspacoCard key={espaco.id} espaco={espaco} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;