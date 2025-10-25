import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <Link to="/" className="text-2xl font-bold text-purple-600">
                        Espaço-Já
                    </Link>
                    
                    <nav className="hidden md:flex space-x-6">
                        <Link to="/" className="text-gray-700 hover:text-purple-600">
                            Início
                        </Link>
                        <Link to="/espacos" className="text-gray-700 hover:text-purple-600">
                            Espaços
                        </Link>
                    </nav>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link to="/perfil" className="text-gray-700 hover:text-purple-600">
                                    Meu Perfil
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                                >
                                    Sair
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-purple-600 hover:text-purple-700"
                                >
                                    Entrar
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                                >
                                    Cadastrar
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;