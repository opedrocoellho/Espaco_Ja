import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CaixaEntrada = () => {
    const [activeTab, setActiveTab] = useState('mensagens');
    const [mensagens, setMensagens] = useState([]);
    const [notificacoes, setNotificacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [contadores, setContadores] = useState({
        mensagens: 0,
        notificacoes: 0,
    });

    useEffect(() => {
        fetchDados();
    }, []);

    const fetchDados = async () => {
        try {
            const [mensagensRes, notificacoesRes, mensagensNaoLidasRes, notificacoesNaoLidasRes] = await Promise.all([
                axios.get('/mensagens'),
                axios.get('/notificacoes'),
                axios.get('/mensagens/nao-lidas/count'),
                axios.get('/notificacoes/nao-lidas/count'),
            ]);

            setMensagens(mensagensRes.data);
            setNotificacoes(notificacoesRes.data.data);
            setContadores({
                mensagens: mensagensNaoLidasRes.data.count,
                notificacoes: notificacoesNaoLidasRes.data.count,
            });
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatarTempo = (data) => {
        const agora = new Date();
        const dataMsg = new Date(data);
        const diffMs = agora - dataMsg;
        const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDias = Math.floor(diffHoras / 24);

        if (diffDias > 0) {
            return `${diffDias}d`;
        } else if (diffHoras > 0) {
            return `${diffHoras}h`;
        } else {
            return 'Agora';
        }
    };

    const TabButton = ({ id, label, count, isActive, onClick }) => (
        <button
            onClick={() => onClick(id)}
            className={`flex-1 py-3 px-4 text-center relative ${
                isActive 
                    ? 'border-b-2 border-primary-500 text-primary-600 font-medium' 
                    : 'text-gray-500 hover:text-gray-700'
            }`}
        >
            {label}
            {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {count}
                </span>
            )}
        </button>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Caixa de Entrada</h1>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="flex border-b border-gray-200">
                    <TabButton
                        id="mensagens"
                        label="Mensagens"
                        count={contadores.mensagens}
                        isActive={activeTab === 'mensagens'}
                        onClick={setActiveTab}
                    />
                    <TabButton
                        id="notificacoes"
                        label="Notificações"
                        count={contadores.notificacoes}
                        isActive={activeTab === 'notificacoes'}
                        onClick={setActiveTab}
                    />
                </div>

                <div className="p-6">
                    {/* Aba Mensagens */}
                    {activeTab === 'mensagens' && (
                        <div>
                            {mensagens.length > 0 ? (
                                <div className="space-y-4">
                                    {mensagens.map((conversa) => {
                                        const outroUsuario = conversa.remetente_id === conversa.user_id 
                                            ? conversa.destinatario 
                                            : conversa.remetente;
                                        
                                        return (
                                            <div
                                                key={conversa.id}
                                                className="flex items-center p-4 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-100"
                                            >
                                                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                                                    <span className="text-primary-600 font-semibold">
                                                        {outroUsuario?.name?.charAt(0) || 'U'}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-medium text-gray-900">
                                                                {outroUsuario?.name || 'Usuário'}
                                                            </h3>
                                                            <p className="text-sm text-gray-500">
                                                                {outroUsuario?.tipo_usuario === 'anfitriao' && 'Locador'}
                                                            </p>
                                                        </div>
                                                        <span className="text-xs text-gray-400">
                                                            {formatarTempo(conversa.created_at)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1 truncate">
                                                        {conversa.mensagem}
                                                    </p>
                                                </div>
                                                
                                                {!conversa.lida && (
                                                    <div className="w-2 h-2 bg-primary-500 rounded-full ml-2"></div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">💬</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Nenhuma mensagem
                                    </h3>
                                    <p className="text-gray-600">
                                        Suas conversas aparecerão aqui
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Aba Notificações */}
                    {activeTab === 'notificacoes' && (
                        <div>
                            {notificacoes.length > 0 ? (
                                <div className="space-y-4">
                                    {notificacoes.map((notificacao) => (
                                        <div
                                            key={notificacao.id}
                                            className={`p-4 rounded-lg border ${
                                                !notificacao.lida 
                                                    ? 'bg-primary-50 border-primary-200' 
                                                    : 'bg-white border-gray-200'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-900 mb-1">
                                                        {notificacao.titulo}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {notificacao.mensagem}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xs text-gray-400">
                                                        {formatarTempo(notificacao.created_at)}
                                                    </span>
                                                    {!notificacao.lida && (
                                                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🔔</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Fique por dentro de tudo aqui!
                                    </h3>
                                    <p className="text-gray-600">
                                        Suas notificações aparecerão aqui
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CaixaEntrada;