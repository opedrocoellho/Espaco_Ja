import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="text-2xl font-bold text-primary-500">
                                Espaço-Já
                            </Link>
                            <div className="ml-10 flex space-x-8">
                                <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                                    Início
                                </Link>
                                <Link to="/espacos" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                                    Espaços
                                </Link>
                                <Link to="/decisao" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                                    Como Funciona
                                </Link>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            {isAuthenticated ? (
                                <>
                                    {user?.tipo_usuario && ['anfitriao', 'ambos'].includes(user.tipo_usuario) && (
                                        <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                                            Dashboard
                                        </Link>
                                    )}
                                    <Link to="/perfil" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                                        Olá, {user?.name}
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                    >
                                        Sair
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                                        Entrar
                                    </Link>
                                    <Link to="/register" className="btn-primary">
                                        Cadastrar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;