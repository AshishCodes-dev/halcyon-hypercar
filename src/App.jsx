import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './lib/ThemeContext';
import { AuthProvider } from './lib/AuthContext';
import { useAuth } from './hooks/useAuth';
import SmoothScroll from './components/SmoothScroll';
import Navbar from './components/Navbar';
import SiteBackground from './components/SiteBackground';
import Home from './pages/Home';

// Lazy-load ONLY the Login page
const Login = lazy(() => import('./pages/Login'));

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

  // The navbar and site background show on every route EXCEPT /login
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {!isLoginPage && <SiteBackground variant="site" />}
      {!isLoginPage && <Navbar />}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Suspense
          fallback={
            <div
              style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'var(--bg)',
              }}
            />
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SmoothScroll>
          <AppContent />
        </SmoothScroll>
      </AuthProvider>
    </ThemeProvider>
  );
}
