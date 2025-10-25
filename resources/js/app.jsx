import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Componente principal
function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white shadow-md">
                    <div className="container mx-auto px-4 py-4">
                        <h1 className="text-2xl font-bold text-purple-600">Espaço-Já</h1>
                    </div>
                </header>
                
                <main className="container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/espacos" element={<Espacos />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </main>
                
                <footer className="bg-gray-800 text-white py-8 mt-12">
                    <div className="container mx-auto px-4 text-center">
                        <p>© 2024 Espaço-Já. Todos os direitos reservados.</p>
                    </div>
                </footer>
            </div>
        </BrowserRouter>
    );
}

// Componentes das páginas
function Home() {
    return (
        <div>
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20 rounded-lg mb-12 text-center">
                <h1 className="text-5xl font-bold mb-6">Encontre o Espaço Perfeito</h1>
                <p className="text-xl mb-8">Reserve salas de reunião, coworking e espaços para eventos</p>
                <a href="/espacos" className="bg-white text-purple-600 px-8 py-3 rounded-lg text-lg font-semibold">
                    Explorar Espaços
                </a>
            </div>
        </div>
    );
}

function Espacos() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Espaços Disponíveis</h1>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p>Listagem de espaços será implementada em breve.</p>
            </div>
        </div>
    );
}

function Login() {
    return (
        <div className="max-w-md mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-6">Entrar</h1>
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Senha</label>
                        <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded" />
                    </div>
                    <button type="submit" className="w-full bg-purple-600 text-white py-2 px-4 rounded">
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}

// Renderizar a aplicação
const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}