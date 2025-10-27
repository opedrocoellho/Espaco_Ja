import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Pagamento = () => {
    const { reservaId } = useParams();
    const navigate = useNavigate();
    
    const [reserva, setReserva] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processando, setProcessando] = useState(false);
    const [metodoPagamento, setMetodoPagamento] = useState('cartao_credito');
    const [dadosCartao, setDadosCartao] = useState({
        numero: '',
        nome: '',
        validade: '',
        cvv: '',
    });

    useEffect(() => {
        fetchReserva();
    }, [reservaId]);

    const fetchReserva = async () => {
        try {
            // Validar ID da reserva
            const reservaIdNum = parseInt(reservaId);
            if (isNaN(reservaIdNum) || reservaIdNum <= 0) {
                navigate('/perfil');
                return;
            }
            
            const response = await axios.get('/reservas', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            const reservaEncontrada = response.data.data?.find(r => r.id === reservaIdNum);
            if (reservaEncontrada) {
                setReserva(reservaEncontrada);
            } else {
                navigate('/perfil');
            }
        } catch (error) {
            console.error('Erro ao carregar reserva:', error);
            navigate('/perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Sanitizar entrada baseado no campo
        let sanitizedValue = value;
        switch (name) {
            case 'numero':
                sanitizedValue = value.replace(/[^\d\s]/g, '').slice(0, 19);
                break;
            case 'nome':
                sanitizedValue = value.replace(/[<>"']/g, '').slice(0, 50);
                break;
            case 'validade':
                sanitizedValue = value.replace(/[^\d\/]/g, '').slice(0, 5);
                break;
            case 'cvv':
                sanitizedValue = value.replace(/\D/g, '').slice(0, 4);
                break;
        }
        
        setDadosCartao(prev => ({ ...prev, [name]: sanitizedValue }));
    };

    const formatarNumeroCartao = (valor) => {
        return valor.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    };

    const formatarValidade = (valor) => {
        return valor.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessando(true);

        try {
            const dadosPagamento = {
                metodo: metodoPagamento,
                ...(metodoPagamento.includes('cartao') && {
                    cartao: {
                        numero: dadosCartao.numero.replace(/\s/g, ''),
                        nome: dadosCartao.nome,
                        validade: dadosCartao.validade,
                        cvv: dadosCartao.cvv,
                    }
                })
            };

            // Validar ID da reserva
            const reservaIdNum = parseInt(reservaId);
            if (isNaN(reservaIdNum) || reservaIdNum <= 0) {
                throw new Error('ID da reserva inválido');
            }
            
            // Sanitizar dados do cartão
            const dadosSanitizados = {
                reserva_id: reservaIdNum,
                metodo_pagamento: metodoPagamento,
                dados_pagamento: {
                    ...dadosPagamento,
                    ...(dadosPagamento.cartao && {
                        cartao: {
                            numero: dadosPagamento.cartao.numero.replace(/\D/g, ''),
                            nome: dadosPagamento.cartao.nome.trim().replace(/<[^>]*>/g, ''),
                            validade: dadosPagamento.cartao.validade.replace(/\D/g, ''),
                            cvv: dadosPagamento.cartao.cvv.replace(/\D/g, '')
                        }
                    })
                }
            };
            
            // Validate CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!csrfToken) {
                throw new Error('CSRF token not found');
            }
            
            await axios.post('/pagamentos', dadosSanitizados, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken
                },
                withCredentials: true
            });

            navigate('/pagamento/sucesso');
        } catch (error) {
            alert('Erro ao processar pagamento: ' + (error.response?.data?.message || 'Erro desconhecido'));
        } finally {
            setProcessando(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!reserva) {
        return <div>Reserva não encontrada</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Finalizar Pagamento</h1>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Resumo da Reserva */}
                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">Resumo da Reserva</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium text-lg">{reserva.espaco.nome}</h3>
                            <p className="text-gray-600">
                                📍 {reserva.espaco.endereco}, {reserva.espaco.cidade}
                            </p>
                        </div>

                        <div className="border-t pt-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Data:</span>
                                    <div className="font-medium">
                                        {new Date(reserva.data).toLocaleDateString('pt-BR')}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-gray-600">Horário:</span>
                                    <div className="font-medium">
                                        {reserva.horario_inicio} às {reserva.horario_fim}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-gray-600">Capacidade:</span>
                                    <div className="font-medium">{reserva.espaco.capacidade} pessoas</div>
                                </div>
                                <div>
                                    <span className="text-gray-600">Preço/hora:</span>
                                    <div className="font-medium">R$ {parseFloat(reserva.espaco.preco_por_hora).toFixed(2)}</div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Total:</span>
                                <span className="text-primary-600">
                                    R$ {parseFloat(reserva.valor_total).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Formulário de Pagamento */}
                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">Dados do Pagamento</h2>

                    <form onSubmit={handleSubmit}>
                        {/* Método de Pagamento */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Método de Pagamento
                            </label>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="metodo"
                                        value="cartao_credito"
                                        checked={metodoPagamento === 'cartao_credito'}
                                        onChange={(e) => setMetodoPagamento(e.target.value)}
                                        className="mr-2"
                                    />
                                    💳 Cartão de Crédito
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="metodo"
                                        value="cartao_debito"
                                        checked={metodoPagamento === 'cartao_debito'}
                                        onChange={(e) => setMetodoPagamento(e.target.value)}
                                        className="mr-2"
                                    />
                                    💳 Cartão de Débito
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="metodo"
                                        value="pix"
                                        checked={metodoPagamento === 'pix'}
                                        onChange={(e) => setMetodoPagamento(e.target.value)}
                                        className="mr-2"
                                    />
                                    📱 PIX
                                </label>
                            </div>
                        </div>

                        {/* Dados do Cartão */}
                        {metodoPagamento.includes('cartao') && (
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Número do Cartão
                                    </label>
                                    <input
                                        type="text"
                                        name="numero"
                                        value={formatarNumeroCartao(dadosCartao.numero)}
                                        onChange={(e) => handleInputChange({
                                            target: { name: 'numero', value: e.target.value }
                                        })}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength="19"
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nome no Cartão
                                    </label>
                                    <input
                                        type="text"
                                        name="nome"
                                        value={dadosCartao.nome}
                                        onChange={handleInputChange}
                                        placeholder="Nome como está no cartão"
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Validade
                                        </label>
                                        <input
                                            type="text"
                                            name="validade"
                                            value={formatarValidade(dadosCartao.validade)}
                                            onChange={(e) => handleInputChange({
                                                target: { name: 'validade', value: e.target.value }
                                            })}
                                            placeholder="MM/AA"
                                            maxLength="5"
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            CVV
                                        </label>
                                        <input
                                            type="text"
                                            name="cvv"
                                            value={dadosCartao.cvv}
                                            onChange={handleInputChange}
                                            placeholder="123"
                                            maxLength="4"
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PIX */}
                        {metodoPagamento === 'pix' && (
                            <div className="mb-6 p-4 bg-primary-50 rounded-lg">
                                <p className="text-sm text-primary-800">
                                    📱 Após confirmar, você receberá o código PIX para pagamento
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={processando}
                            className="w-full btn-primary disabled:opacity-50 text-lg py-3"
                        >
                            {processando ? 'Processando...' : `Pagar R$ ${parseFloat(reserva.valor_total).toFixed(2)}`}
                        </button>
                    </form>

                    <div className="mt-4 text-xs text-gray-500 text-center">
                        🔒 Seus dados estão protegidos com criptografia SSL
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pagamento;