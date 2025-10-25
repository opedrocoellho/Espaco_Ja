import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth';
import Layout from './layout/Layout';
import Home from './pages/Home';
import Espacos from './pages/Espacos';
import EspacoDetalhes from './pages/EspacoDetalhes';
import Login from './pages/Login';
import Register from './pages/Register';
import Perfil from './pages/Perfil';

function App() {
    return (
        <AuthProvider>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/espacos" element={<Espacos />} />
                    <Route path="/espacos/:id" element={<EspacoDetalhes />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/perfil" element={<Perfil />} />
                </Routes>
            </Layout>
        </AuthProvider>
    );
}

export default App;