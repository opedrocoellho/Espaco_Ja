import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Espacos from './pages/Espacos';
import EspacoDetalhes from './pages/EspacoDetalhes';
import Perfil from './pages/Perfil';
import Decisao from './pages/Decisao';
import Dashboard from './pages/Dashboard';
import Pagamento from './pages/Pagamento';
import DetalhesReserva from './pages/DetalhesReserva';
import CaixaEntrada from './pages/CaixaEntrada';
import NovoEspaco from './pages/NovoEspaco';
import EditarPerfil from './pages/EditarPerfil';
import MeusEspacos from './pages/MeusEspacos';
import DashboardReservas from './pages/DashboardReservas';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/decisao" element={<Decisao />} />
                        <Route path="/espacos" element={<Espacos />} />
                        <Route path="/espacos/:id" element={<EspacoDetalhes />} />
                        <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/pagamento/:reservaId" element={<ProtectedRoute><Pagamento /></ProtectedRoute>} />
                        <Route path="/reserva/detalhes/:espacoId" element={<ProtectedRoute><DetalhesReserva /></ProtectedRoute>} />
                        <Route path="/caixa-entrada" element={<ProtectedRoute><CaixaEntrada /></ProtectedRoute>} />
                        <Route path="/espacos/novo" element={<ProtectedRoute><NovoEspaco /></ProtectedRoute>} />
                        <Route path="/perfil/editar" element={<ProtectedRoute><EditarPerfil /></ProtectedRoute>} />
                        <Route path="/dashboard/meus-espacos" element={<ProtectedRoute><MeusEspacos /></ProtectedRoute>} />
                        <Route path="/dashboard/reservas" element={<ProtectedRoute><DashboardReservas /></ProtectedRoute>} />
                        <Route path="/mensagens" element={<ProtectedRoute><CaixaEntrada /></ProtectedRoute>} />
                    </Routes>
                </Layout>
            </Router>
        </AuthProvider>
    );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);