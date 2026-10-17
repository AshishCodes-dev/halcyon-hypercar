import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import { useAuth } from './hooks/useAuth';
import SmoothScroll from './components/SmoothScroll';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';

function AppContent() {
  const { loading } = useAuth();
  const location = useLocation();

  // Minimal full-screen black loader to prevent page flash during auth initialization
  if (loading) {
    return (
      <div className="auth-loader-screen" aria-label="Loading Halcyon">
        <div className="auth-loader-spinner" aria-hidden="true" />
      </div>
    );
  }

  // The navbar shows on every route EXCEPT /login
  const showNavbar = location.pathname !== '/login';

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SmoothScroll>
        <AppContent />
      </SmoothScroll>
    </AuthProvider>
  );
}
