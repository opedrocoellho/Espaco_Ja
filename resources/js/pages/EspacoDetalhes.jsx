import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import MapaInterativo from '../components/MapaInterativo';

const EspacoDetalhes = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    
    const [espaco, setEspaco] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reservaForm, setReservaForm] = useState({
        data: '',
        horario_inicio: '',
        horario_fim: '',
        adultos: 1,
        criancas: 0,
        bebes: 0,
        pets: 0,
        observacoes: '',
    });
    const [reservaLoading, setReservaLoading] = useState(false);
    const [disponibilidade, setDisponibilidade] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchEspaco();
    }, [id]);

    useEffect(() => {
        if (reservaForm.data) {
            checkDisponibilidade();
        }
    }, [reservaForm.data]);

    const fetchEspaco = async () => {
        try {
            const response = await axios.get(`/api/espacos/${id}`);
            setEspaco(response.data);
        } catch (error) {
            console.error('Erro ao carregar espaço:', error);
            navigate('/espacos');
        } finally {
            setLoading(false);
        }
    };

    const checkDisponibilidade = async () => {
        try {
            const response = await axios.get(`/api/espacos/${id}/disponibilidade?data=${reservaForm.data}`);
            setDisponibilidade(response.data);
        } catch (error) {
            console.error('Erro ao verificar disponibilidade:', error);
        }
    };

    const handleReservaChange = (e) => {
        setReservaForm({
            ...reservaForm,
            [e.target.name]: e.target.value,
        });
    };

    const calcularValorTotal = () => {
        if (!reservaForm.horario_inicio || !reservaForm.horario_fim || !espaco) {
            return 0;
        }

        const inicio = new Date(`2000-01-01T${reservaForm.horario_inicio}`);
        const fim = new Date(`2000-01-01T${reservaForm.horario_fim}`);
        const horas = (fim - inicio) / (1000 * 60 * 60);
        
        return horas > 0 ? horas * espaco.preco_por_hora : 0;
    };

    const handleReserva = async (e) => {
        e.preventDefault();
        
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setReservaLoading(true);
        setMessage('');

        try {
            // Validar dados do formulário
            const espacoId = parseInt(id);
            if (isNaN(espacoId) || espacoId <= 0) {
                throw new Error('ID do espaço inválido');
            }
            
            // Sanitizar dados da reserva
            const dadosReserva = {
                espaco_id: espacoId,
                data: reservaForm.data,
                horario_inicio: reservaForm.horario_inicio,
                horario_fim: reservaForm.horario_fim,
                adultos: parseInt(reservaForm.adultos) || 1,
                criancas: parseInt(reservaForm.criancas) || 0,
                bebes: parseInt(reservaForm.bebes) || 0,
                pets: parseInt(reservaForm.pets) || 0,
                observacoes: reservaForm.observacoes?.trim().replace(/<[^>]*>/g, '') || ''
            };
            
            // Validar capacidade total
            const totalPessoas = dadosReserva.adultos + dadosReserva.criancas + dadosReserva.bebes;
            if (totalPessoas > espaco.capacidade) {
                throw new Error(`Número total de pessoas (${totalPessoas}) excede a capacidade do espaço (${espaco.capacidade})`);
            }
            
            // Validate CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!csrfToken) {
                throw new Error('CSRF token not found');
            }
            
            await axios.post('/api/reservas', dadosReserva, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken
                },
                withCredentials: true
            });
            
            setMessage('Reserva criada com sucesso!');
            setReservaForm({
                data: '',
                horario_inicio: '',
                horario_fim: '',
                adultos: 1,
                criancas: 0,
                bebes: 0,
                pets: 0,
                observacoes: '',
            });
        } catch (error) {
            setMessage(error.response?.data?.message || 'Erro ao criar reserva');
        } finally {
            setReservaLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!espaco) {
        return <div>Espaço não encontrado</div>;
    }

    const valorTotal = calcularValorTotal();

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            {/* Informações do Espaço */}
            <div>
                <div className="mb-6">
                    {espaco.imagens && espaco.imagens.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <img
                                src={`/storage/${espaco.imagens[0]}`}
                                alt={espaco.nome}
                                className="w-full h-64 object-cover rounded-lg"
                            />
                            {espaco.imagens.length > 1 && (
                                <div className="grid grid-cols-2 gap-2">
                                    {espaco.imagens.slice(1, 5).map((imagem, index) => (
                                        <img
                                            key={index}
                                            src={`/storage/${imagem}`}
                                            alt={`${espaco.nome} ${index + 2}`}
                                            className="w-full h-30 object-cover rounded-lg"
                                        />
                                    ))}
                                    {espaco.imagens.length > 5 && (
                                        <div className="w-full h-30 bg-gray-200 rounded-lg flex items-center justify-center">
                                            <span className="text-gray-600 text-sm">
                                                +{espaco.imagens.length - 4} fotos
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-gray-500">Sem imagens disponíveis</span>
                        </div>
                    )}
                </div>

                <h1 className="text-3xl font-bold mb-4">{espaco.nome}</h1>
                
                <div className="flex items-center gap-4 mb-6 text-gray-600">
                    <span>📍 {espaco.endereco}, {espaco.cidade}, {espaco.estado}</span>
                    <span>👥 {espaco.capacidade} pessoas</span>
                </div>

                <div className="mb-6">
                    <span className="text-3xl font-bold text-primary-600">
                        R$ {espaco.preco_por_hora}/hora
                    </span>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Descrição</h3>
                    <p className="text-gray-700 leading-relaxed">{espaco.descricao}</p>
                </div>

                {espaco.amenidades && espaco.amenidades.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-3">Comodidades</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {espaco.amenidades.map((amenidade, index) => (
                                <div key={index} className="flex items-center">
                                    <span className="text-primary-500 mr-2">✓</span>
                                    {amenidade}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Mapa */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Localização</h3>
                    <MapaInterativo
                        latitude={espaco.latitude}
                        longitude={espaco.longitude}
                        endereco={`${espaco.endereco}, ${espaco.cidade}, ${espaco.estado}`}
                        nome={espaco.nome}
                    />
                </div>
            </div>

            {/* Formulário de Reserva */}
            <div>
                <div className="card sticky top-6">
                    <h3 className="text-xl font-semibold mb-4">Fazer Reserva</h3>
                    
                    {message && (
                        <div className={`p-3 rounded mb-4 ${
                            message.includes('sucesso') 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                        }`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleReserva}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Data
                            </label>
                            <input
                                type="date"
                                name="data"
                                value={reservaForm.data}
                                onChange={handleReservaChange}
                                min={new Date().toISOString().split('T')[0]}
                                className="input-field"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Horário Início
                                </label>
                                <input
                                    type="time"
                                    name="horario_inicio"
                                    value={reservaForm.horario_inicio}
                                    onChange={handleReservaChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Horário Fim
                                </label>
                                <input
                                    type="time"
                                    name="horario_fim"
                                    value={reservaForm.horario_fim}
                                    onChange={handleReservaChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                        </div>

                        {disponibilidade && !disponibilidade.disponivel && (
                            <div className="bg-yellow-100 text-yellow-700 p-3 rounded mb-4">
                                ⚠️ Existem conflitos de horário nesta data
                            </div>
                        )}

                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Número de Hóspedes</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">{"Adultos"}</label>
                                    <input
                                        type="number"
                                        name="adultos"
                                        value={reservaForm.adultos}
                                        onChange={handleReservaChange}
                                        min="1"
                                        max={espaco.capacidade}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Crianças</label>
                                    <input
                                        type="number"
                                        name="criancas"
                                        value={reservaForm.criancas}
                                        onChange={handleReservaChange}
                                        min="0"
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Bebês</label>
                                    <input
                                        type="number"
                                        name="bebes"
                                        value={reservaForm.bebes}
                                        onChange={handleReservaChange}
                                        min="0"
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Pets</label>
                                    <input
                                        type="number"
                                        name="pets"
                                        value={reservaForm.pets}
                                        onChange={handleReservaChange}
                                        min="0"
                                        className="input-field"
                                    />
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                                Total: {parseInt(reservaForm.adultos) + parseInt(reservaForm.criancas) + parseInt(reservaForm.bebes)} pessoas
                                {parseInt(reservaForm.pets) > 0 && ` + ${reservaForm.pets} pets`}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Observações (opcional)
                            </label>
                            <textarea
                                name="observacoes"
                                value={reservaForm.observacoes}
                                onChange={handleReservaChange}
                                rows="3"
                                className="input-field"
                                placeholder="Informações adicionais sobre sua reserva..."
                            />
                        </div>

                        {valorTotal > 0 && (
                            <div className="bg-primary-50 p-4 rounded-lg mb-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Valor Total:</span>
                                    <span className="text-xl font-bold text-primary-600">
                                        R$ {valorTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={reservaLoading || !isAuthenticated}
                            className="w-full btn-primary disabled:opacity-50"
                        >
                            {reservaLoading ? 'Criando reserva...' : 
                             !isAuthenticated ? 'Faça login para reservar' : 
                             'Confirmar Reserva'}
                        </button>
                    </form>

                    {!isAuthenticated && (
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => navigate('/login')}
                                className="text-primary-600 hover:underline"
                            >
                                Fazer login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EspacoDetalhes;