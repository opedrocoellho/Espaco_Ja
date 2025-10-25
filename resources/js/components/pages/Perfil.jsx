import React from 'react';
import { useAuth } from '../../hooks/useAuth';

function Perfil() {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Acesso Negado</h1>
                <p className="text-gray-600">Você precisa estar logado para acessar esta página.</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Nome
                            </label>
                            <p className="text-gray-900">{user.name}</p>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Email
                            </label>
                            <p className="text-gray-900">{user.email}</p>
                        </div>
                        {user.whatsapp && (
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    WhatsApp
                                </label>
                                <p className="text-gray-900">{user.whatsapp}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Minhas Reservas</h2>
                    <div className="text-center py-8 text-gray-600">
                        <p>Nenhuma reserva encontrada.</p>
                        <p className="text-sm mt-2">As reservas serão implementadas em breve.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Perfil;