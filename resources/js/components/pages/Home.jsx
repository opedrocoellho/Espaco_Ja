import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20 rounded-lg mb-12">
                <div className="text-center">
                    <h1 className="text-5xl font-bold mb-6">
                        Encontre o Espaço Perfeito
                    </h1>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Reserve salas de reunião, coworking, auditórios e espaços para eventos 
                        de forma rápida e segura
                    </p>
                    <Link
                        to="/espacos"
                        className="bg-white text-purple-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Explorar Espaços
                    </Link>
                </div>
            </section>

            {/* Como Funciona */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold text-center mb-8">Como Funciona</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🔍</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">1. Busque</h3>
                        <p className="text-gray-600">
                            Encontre espaços por localização, capacidade e comodidades
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📅</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">2. Reserve</h3>
                        <p className="text-gray-600">
                            Escolha data e horário disponível e faça sua reserva
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">✅</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">3. Utilize</h3>
                        <p className="text-gray-600">
                            Compareça no local e aproveite seu espaço reservado
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-100 py-12 rounded-lg text-center">
                <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
                <p className="text-gray-600 mb-6">
                    Cadastre-se agora e encontre o espaço ideal para suas necessidades
                </p>
                <Link
                    to="/register"
                    className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                    Criar Conta Gratuita
                </Link>
            </section>
        </div>
    );
}

export default Home;