import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Decisao = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">O que você deseja?</h1>
            <p className="text-xl text-gray-600 mb-12">
                Escolha como você quer usar o Espaço-Já
            </p>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Alugar Espaços */}
                <div className="card hover:shadow-xl transition-shadow cursor-pointer group">
                    <Link to="/espacos" className="block">
                        <div className="text-center p-8">
                            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
                                <span className="text-4xl">🔍</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-4 text-gray-900">
                                Alugar Espaços
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Encontre o espaço perfeito para seu evento, reunião ou trabalho
                            </p>
                            <div className="space-y-2 text-sm text-gray-500">
                                <p>✓ Milhares de espaços disponíveis</p>
                                <p>✓ Reserva instantânea</p>
                                <p>✓ Preços transparentes</p>
                                <p>✓ Avaliações reais</p>
                            </div>
                            <div className="mt-6">
                                <span className="btn-primary inline-block">
                                    Explorar Espaços
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Anunciar Espaço */}
                <div className="card hover:shadow-xl transition-shadow cursor-pointer group">
                    <Link to={user && ['anfitriao', 'ambos'].includes(user.tipo_usuario) ? "/dashboard" : "/espacos/novo"} className="block">
                        <div className="text-center p-8">
                            <div className="w-24 h-24 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-300 transition-colors">
                                <span className="text-4xl">🏢</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-4 text-gray-900">
                                Anunciar Meu Espaço
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Monetize seu espaço e ganhe uma renda extra hospedando eventos
                            </p>
                            <div className="space-y-2 text-sm text-gray-500">
                                <p>✓ Cadastro gratuito</p>
                                <p>✓ Você define o preço</p>
                                <p>✓ Pagamentos seguros</p>
                                <p>✓ Suporte 24/7</p>
                            </div>
                            <div className="mt-6">
                                <span className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-block">
                                    {user?.tipo_usuario && ['anfitriao', 'ambos'].includes(user.tipo_usuario) ? 'Ir para Dashboard' : 'Começar a Anunciar'}
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Seção de Benefícios */}
            <div className="mt-16 bg-gray-50 rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-6">Por que escolher o Espaço-Já?</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🛡️</span>
                        </div>
                        <h4 className="font-semibold mb-2">Segurança Garantida</h4>
                        <p className="text-sm text-gray-600">
                            Todos os espaços são verificados e os pagamentos são protegidos
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">⚡</span>
                        </div>
                        <h4 className="font-semibold mb-2">Reserva Instantânea</h4>
                        <p className="text-sm text-gray-600">
                            Reserve em segundos e receba confirmação imediata
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">💬</span>
                        </div>
                        <h4 className="font-semibold mb-2">Suporte Completo</h4>
                        <p className="text-sm text-gray-600">
                            Nossa equipe está sempre pronta para ajudar você
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Decisao;