import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginBackground from '../components/LoginBackground';
import LoginHeadline from '../components/LoginHeadline';
import LoginPanel from '../components/LoginPanel';
import './Login.css';

export default function Login() {
  const { user, loading } = useAuth();

  useEffect(() => {
    document.title = 'Sign in | Halcyon';
  }, []);

  // If already authenticated, redirect to "/" immediately without rendering login screen
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="login-page-root">
      {/* Background with reactive glow and subtle grid */}
      <LoginBackground />

      {/* Main interactive split container */}
      <div className="login-page-container">
        {/* Left ~60%: Typographic Block */}
        <section className="login-layout-left" aria-label="Brand and Reserve Access">
          <LoginHeadline />
        </section>

        {/* Right ~40%: Centered Auth Card */}
        <section className="login-layout-right" aria-label="Sign-in Access Panel">
          <LoginPanel />
        </section>
      </div>
    </main>
  );
}
