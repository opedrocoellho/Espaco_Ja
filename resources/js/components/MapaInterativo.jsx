import React, { useEffect, useRef } from 'react';

const MapaInterativo = ({ latitude, longitude, endereco, nome }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!latitude || !longitude) return;

        // Criar mapa usando Leaflet (biblioteca gratuita)
        const initMap = () => {
            // Limpar mapa anterior se existir
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
            }

            // Criar novo mapa
            const L = window.L;
            if (!L) {
                console.error('Leaflet não carregado');
                return;
            }

            const map = L.map(mapRef.current).setView([latitude, longitude], 15);

            // Adicionar tiles do OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Adicionar marcador
            const marker = L.marker([latitude, longitude]).addTo(map);
            
            if (nome && endereco) {
                // Sanitize input to prevent XSS
                const safeName = String(nome).replace(/[<>"'&]/g, (match) => {
                    const escapeMap = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
                    return escapeMap[match];
                });
                const safeEndereco = String(endereco).replace(/[<>"'&]/g, (match) => {
                    const escapeMap = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
                    return escapeMap[match];
                });
                marker.bindPopup(`<b>${safeName}</b><br>${safeEndereco}`);
            }

            mapInstanceRef.current = map;
        };

        // Carregar Leaflet se não estiver carregado
        if (!window.L) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);

            const script = document.createElement('script');
            const scriptSrc = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            // Validate script source
            if (!scriptSrc.startsWith('https://unpkg.com/leaflet@')) {
                console.error('Invalid script source');
                return;
            }
            script.src = scriptSrc;
            script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
            script.crossOrigin = 'anonymous';
            script.type = 'text/javascript';
            script.onload = () => {
                if (typeof window.L !== 'undefined') {
                    initMap();
                } else {
                    console.error('Leaflet failed to load properly');
                }
            };
            script.onerror = () => {
                console.error('Erro ao carregar Leaflet');
            };
            document.head.appendChild(script);
        } else {
            initMap();
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [latitude, longitude, endereco, nome]);

    if (!latitude || !longitude) {
        return (
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-2">📍</div>
                    <p className="text-gray-500">Localização não disponível</p>
                    <p className="text-sm text-gray-400">{endereco}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-200">
            <div ref={mapRef} className="w-full h-full"></div>
        </div>
    );
};

export default MapaInterativo;