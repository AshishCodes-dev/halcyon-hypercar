import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import { useAuth } from './hooks/useAuth';
import Home from './pages/Home';
import Login from './pages/Login';

function AppRoutes() {
  const { loading } = useAuth();

  // Minimal full-screen black loader to prevent page flash during auth initialization
  if (loading) {
    return (
      <div className="auth-loader-screen" aria-label="Loading Halcyon">
        <div className="auth-loader-spinner" aria-hidden="true" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
