import React from 'react';
import { Link } from 'react-router-dom';

const EspacoCard = ({ espaco }) => {
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        return `/storage/${imagePath}`;
    };

    const imagens = Array.isArray(espaco.imagens) ? espaco.imagens : [];
    const amenidades = Array.isArray(espaco.amenidades) ? espaco.amenidades : [];
    const primaryImage = imagens.length > 0 ? imagens[0] : null;

    return (
        <div className="card hover:shadow-lg transition-shadow">
            <div className="aspect-w-16 aspect-h-9 mb-4">
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    {primaryImage ? (
                        <img 
                            src={getImageUrl(primaryImage)}
                            alt={espaco.nome}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    ) : null}
                    <span className="text-gray-500" style={{ display: primaryImage ? 'none' : 'block' }}>
                        📷 Sem imagem
                    </span>
                </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {espaco.nome}
            </h3>
            
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
            
            <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-primary-600">
                    R$ {espaco.preco_por_hora}/hora
                </span>
                <Link 
                    to={`/espacos/${espaco.id}`}
                    className="btn-primary text-sm"
                >
                    Ver Detalhes
                </Link>
            </div>
            
            {amenidades.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex flex-wrap gap-1">
                        {amenidades.slice(0, 3).map((amenidade, index) => (
                            <span 
                                key={index}
                                className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded"
                            >
                                {amenidade}
                            </span>
                        ))}
                        {amenidades.length > 3 && (
                            <span className="text-xs text-gray-500">
                                +{amenidades.length - 3} mais
                            </span>
                        )}
                    </div>
                </div>
            )}
            
            {imagens.length > 1 && (
                <div className="mt-2">
                    <span className="text-xs text-gray-500">
                        📷 {imagens.length} fotos
                    </span>
                </div>
            )}
        </div>
    );
};

export default EspacoCard;