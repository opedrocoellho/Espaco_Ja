import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DetalhesReserva = () => {
    const { espacoId } = useParams();
    const navigate = useNavigate();
    
    const [espaco, setEspaco] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reservaData, setReservaData] = useState({
        data_inicio: '',
        data_fim: '',
        adultos: 1,
        criancas: 0,
        bebes: 0,
        pets: 0,
    });

    useEffect(() => {
        fetchEspaco();
    }, [espacoId]);

    const fetchEspaco = async () => {
        try {
            const response = await axios.get(`/espacos/${espacoId}`);
            setEspaco(response.data);
        } catch (error) {
            console.error('Erro ao carregar espaço:', error);
            navigate('/espacos');
        } finally {
            setLoading(false);
        }
    };

    const handleCounterChange = (field, increment) => {
        setReservaData(prev => {
            const newValue = Math.max(0, prev[field] + increment);
            if (field === 'adultos' && newValue < 1) return prev;
            return { ...prev, [field]: newValue };
        });
    };

    const getTotalHospedes = () => {
        return reservaData.adultos + reservaData.criancas + reservaData.bebes;
    };

    const calcularTaxas = () => {
        let taxaAdicional = 0;
        const totalHospedes = getTotalHospedes();
        
        if (reservaData.pets > 0) {
            taxaAdicional += reservaData.pets * 20;
        }
        if (totalHospedes > 4) {
            taxaAdicional += (totalHospedes - 4) * 10;
        }
        
        return taxaAdicional;
    };

    const apagarTudo = () => {
        setReservaData({
            data_inicio: '',
            data_fim: '',
            adultos: 1,
            criancas: 0,
            bebes: 0,
            pets: 0,
        });
    };

    const proximoPasso = () => {
        const totalHospedes = getTotalHospedes();
        if (totalHospedes > espaco.capacidade) {
            alert(`Número de hóspedes (${totalHospedes}) excede a capacidade do espaço (${espaco.capacidade})`);
            return;
        }
        
        if (!reservaData.data_inicio || !reservaData.data_fim) {
            alert('Por favor, selecione as datas');
            return;
        }

        navigate(`/reserva/pagamento/${espacoId}`, { 
            state: { reservaData, espaco } 
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const Counter = ({ label, value, field, subtitle }) => (
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
            <div>
                <div className="font-medium text-gray-900">{label}</div>
                {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
            </div>
            <div className="flex items-center space-x-3">
                <button
                    onClick={() => handleCounterChange(field, -1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-primary-500"
                    disabled={field === 'adultos' && value <= 1}
                >
                    −
                </button>
                <span className="w-8 text-center font-medium">{value}</span>
                <button
                    onClick={() => handleCounterChange(field, 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-primary-500"
                >
                    +
                </button>
            </div>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto">
            <div className="card">
                <h1 className="text-2xl font-bold mb-6">Detalhes da Reserva</h1>
                
                {/* Informações do Espaço */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h2 className="font-semibold text-lg">{espaco.nome}</h2>
                    <p className="text-gray-600">📍 {espaco.cidade}, {espaco.estado}</p>
                    <p className="text-sm text-gray-500">Capacidade máxima: {espaco.capacidade} pessoas</p>
                </div>

                {/* Seleção de Datas */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-3">Selecione as datas</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Data de início
                            </label>
                            <input
                                type="date"
                                value={reservaData.data_inicio}
                                onChange={(e) => setReservaData(prev => ({ ...prev, data_inicio: e.target.value }))}
                                min={new Date().toISOString().split('T')[0]}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Data de fim
                            </label>
                            <input
                                type="date"
                                value={reservaData.data_fim}
                                onChange={(e) => setReservaData(prev => ({ ...prev, data_fim: e.target.value }))}
                                min={reservaData.data_inicio || new Date().toISOString().split('T')[0]}
                                className="input-field"
                            />
                        </div>
                    </div>
                </div>

                {/* Contadores de Hóspedes */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-3">Informe quem vem!</h3>
                    
                    <Counter
                        label="Adultos"
                        subtitle="A partir de 13 anos"
                        value={reservaData.adultos}
                        field="adultos"
                    />
                    
                    <Counter
                        label="Crianças"
                        subtitle="Entre 2 e 12 anos"
                        value={reservaData.criancas}
                        field="criancas"
                    />
                    
                    <Counter
                        label="Bebês"
                        subtitle="Abaixo de 2 anos"
                        value={reservaData.bebes}
                        field="bebes"
                    />
                    
                    <Counter
                        label="Pets"
                        subtitle="Vai vir com seu cão guia?"
                        value={reservaData.pets}
                        field="pets"
                    />
                </div>

                {/* Resumo */}
                <div className="mb-6 p-4 bg-primary-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Total de hóspedes:</span>
                        <span className="font-bold">{getTotalHospedes()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Capacidade do espaço:</span>
                        <span>{espaco.capacidade}</span>
                    </div>
                    {calcularTaxas() > 0 && (
                        <div className="flex justify-between items-center text-primary-600">
                            <span className="font-medium">Taxa adicional:</span>
                            <span className="font-bold">R$ {calcularTaxas().toFixed(2)}</span>
                        </div>
                    )}
                    {getTotalHospedes() > espaco.capacidade && (
                        <div className="mt-2 text-red-600 text-sm">
                            ⚠️ Número de hóspedes excede a capacidade máxima
                        </div>
                    )}
                </div>

                {/* Botões */}
                <div className="flex justify-between">
                    <button
                        onClick={apagarTudo}
                        className="btn-secondary"
                    >
                        Apagar tudo
                    </button>
                    <button
                        onClick={proximoPasso}
                        className="btn-primary"
                        disabled={getTotalHospedes() > espaco.capacidade}
                    >
                        Próximo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetalhesReserva;