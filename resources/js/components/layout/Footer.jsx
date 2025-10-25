import React from 'react';

function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-8 mt-12">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h3 className="text-xl font-bold mb-4">Espaço-Já</h3>
                    <p className="text-gray-400 mb-4">
                        Plataforma completa para reserva de espaços compartilhados
                    </p>
                    <p className="text-gray-500 text-sm">
                        © 2024 Espaço-Já. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;