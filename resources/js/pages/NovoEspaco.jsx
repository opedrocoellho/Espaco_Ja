import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UploadImagens from '../components/UploadImagens';

const NovoEspaco = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        preco_por_hora: '',
        capacidade: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        latitude: '',
        longitude: '',
        amenidades: [],
        imagens: [],
    });
    const [errors, setErrors] = useState({});

    const amenidadesDisponiveis = [
        'Wi-Fi', 'Projetor', 'Ar Condicionado', 'Café', 'Estacionamento',
        'Som', 'Iluminação', 'Catering', 'Decoração', 'Flipchart',
        'Videoconferência', 'Impressora', 'Lounge'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleAmenidadeToggle = (amenidade) => {
        setFormData(prev => ({
            ...prev,
            amenidades: prev.amenidades.includes(amenidade)
                ? prev.amenidades.filter(a => a !== amenidade)
                : [...prev.amenidades, amenidade]
        }));
    };

    const handleImagensChange = (novasImagens) => {
        setFormData(prev => ({ ...prev, imagens: novasImagens }));
    };

    const buscarCoordenadas = async (endereco, cidade, estado, cep) => {
        try {
            // Sanitizar e validar inputs
            const enderecoLimpo = endereco?.trim().replace(/[<>"']/g, '');
            const cidadeLimpa = cidade?.trim().replace(/[<>"']/g, '');
            const estadoLimpo = estado?.trim().replace(/[<>"']/g, '');
            const cepLimpo = cep?.replace(/\D/g, '');
            
            if (!enderecoLimpo || !cidadeLimpa || !estadoLimpo) {
                throw new Error('Dados de endereço incompletos');
            }
            
            const enderecoCompleto = `${enderecoLimpo}, ${cidadeLimpa}, ${estadoLimpo}, ${cepLimpo}`;
            
            // Usar timeout para evitar requests longos
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos
            
            // Validate allowed domain to prevent SSRF
            const allowedDomain = 'nominatim.openstreetmap.org';
            const url = `https://${allowedDomain}/search?format=json&q=${encodeURIComponent(enderecoCompleto)}&limit=1`;
            
            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'User-Agent': 'EspacoJa/1.0'
                }
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error('Erro na busca de coordenadas');
            }
            
            const data = await response.json();
            
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                
                // Validar coordenadas
                if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
                    throw new Error('Coordenadas inválidas');
                }
                
                return { latitude: lat, longitude: lon };
            }
        } catch (error) {
            console.error('Erro ao buscar coordenadas:', error);
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            // Buscar coordenadas se não fornecidas
            let dadosFinais = { ...formData };
            if (!formData.latitude && !formData.longitude && formData.endereco && formData.cidade) {
                const coords = await buscarCoordenadas(formData.endereco, formData.cidade, formData.estado, formData.cep);
                if (coords) {
                    dadosFinais.latitude = coords.latitude;
                    dadosFinais.longitude = coords.longitude;
                }
            }

            // Sanitizar dados antes do envio
            const dadosSanitizados = {
                ...dadosFinais,
                nome: dadosFinais.nome?.trim().replace(/<[^>]*>/g, ''),
                descricao: dadosFinais.descricao?.trim().replace(/<[^>]*>/g, ''),
                endereco: dadosFinais.endereco?.trim().replace(/<[^>]*>/g, ''),
                cidade: dadosFinais.cidade?.trim().replace(/<[^>]*>/g, ''),
                estado: dadosFinais.estado?.trim().toUpperCase(),
                cep: dadosFinais.cep?.replace(/\D/g, ''),
                preco_por_hora: parseFloat(dadosFinais.preco_por_hora),
                capacidade: parseInt(dadosFinais.capacidade)
            };
            
            // Validate CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!csrfToken) {
                throw new Error('CSRF token not found');
            }
            
            await axios.post('/api/espacos', dadosSanitizados, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken
                },
                withCredentials: true
            });
            navigate('/dashboard');
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: [error.response?.data?.message || 'Erro ao criar espaço'] });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="card">
                <h1 className="text-2xl font-bold mb-6">Qual será o nome do seu espaço?</h1>
                
                {errors.general && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {errors.general[0]}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome do Espaço *
                        </label>
                        <input
                            type="text"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Ex: Sala de Reunião Premium"
                            required
                        />
                        {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descrição *
                        </label>
                        <textarea
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            rows="4"
                            className="input-field"
                            placeholder="Descreva seu espaço, suas características e diferenciais..."
                            required
                        />
                        {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao[0]}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Preço por Hora (R$) *
                            </label>
                            <input
                                type="number"
                                name="preco_por_hora"
                                value={formData.preco_por_hora}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="50.00"
                                min="0"
                                step="0.01"
                                required
                            />
                            {errors.preco_por_hora && <p className="text-red-500 text-xs mt-1">{errors.preco_por_hora[0]}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Capacidade (pessoas) *
                            </label>
                            <input
                                type="number"
                                name="capacidade"
                                value={formData.capacidade}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="10"
                                min="1"
                                required
                            />
                            {errors.capacidade && <p className="text-red-500 text-xs mt-1">{errors.capacidade[0]}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Endereço Completo *
                        </label>
                        <input
                            type="text"
                            name="endereco"
                            value={formData.endereco}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Rua, número, bairro"
                            required
                        />
                        {errors.endereco && <p className="text-red-500 text-xs mt-1">{errors.endereco[0]}</p>}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cidade *
                            </label>
                            <input
                                type="text"
                                name="cidade"
                                value={formData.cidade}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="São Paulo"
                                required
                            />
                            {errors.cidade && <p className="text-red-500 text-xs mt-1">{errors.cidade[0]}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Estado *
                            </label>
                            <input
                                type="text"
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="SP"
                                maxLength="2"
                                required
                            />
                            {errors.estado && <p className="text-red-500 text-xs mt-1">{errors.estado[0]}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                CEP *
                            </label>
                            <input
                                type="text"
                                name="cep"
                                value={formData.cep}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="01310-100"
                                required
                            />
                            {errors.cep && <p className="text-red-500 text-xs mt-1">{errors.cep[0]}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Comodidades
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {amenidadesDisponiveis.map((amenidade) => (
                                <label key={amenidade} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.amenidades.includes(amenidade)}
                                        onChange={() => handleAmenidadeToggle(amenidade)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">{amenidade}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <UploadImagens
                        imagens={formData.imagens}
                        onChange={handleImagensChange}
                        required={true}
                    />
                    {errors.imagens && <p className="text-red-500 text-xs mt-1">{errors.imagens[0]}</p>}

                    <div className="flex justify-between pt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="btn-secondary"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary disabled:opacity-50"
                        >
                            {loading ? 'Criando...' : 'Criar Espaço'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NovoEspaco;