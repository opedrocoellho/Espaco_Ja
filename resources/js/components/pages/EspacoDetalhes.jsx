import React from 'react';
import { useParams } from 'react-router-dom';

function EspacoDetalhes() {
    const { id } = useParams();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Detalhes do Espaço #{id}</h1>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h2 className="text-xl font-semibold mb-4">Em Desenvolvimento</h2>
                <p className="text-gray-600">
                    Os detalhes do espaço serão implementados em breve.
                </p>
            </div>
        </div>
    );
}

export default EspacoDetalhes;