import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { user, signOut } = useAuth();

  useEffect(() => {
    document.title = 'Halcyon';
  }, []);

  const firstName = user?.displayName ? user.displayName.split(' ')[0] : 'Member';

  return (
    <main className="placeholder-page">
      {/* Temporary top-right authenticated user status */}
      {user && (
        <aside className="user-home-badge" aria-label="Account details">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={`${user.displayName || 'User'} profile avatar`}
              className="user-avatar-img"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div
              className="user-avatar-img"
              style={{
                backgroundColor: 'var(--line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                color: 'var(--text)',
              }}
            >
              {firstName.charAt(0)}
            </div>
          )}
          <span className="user-display-name">{firstName}</span>
          <button
            type="button"
            className="user-signout-btn"
            onClick={signOut}
            aria-label="Sign out of Halcyon"
          >
            Sign out
          </button>
        </aside>
      )}

      {/* Unauthenticated subtle link to access login */}
      {!user && (
        <aside
          style={{
            position: 'fixed',
            top: 'clamp(1rem, 0.8rem + 1vw, 1.75rem)',
            right: 'clamp(1rem, 0.8rem + 1vw, 1.75rem)',
            zIndex: 100,
          }}
        >
          <Link
            to="/login"
            style={{
              fontSize: '0.8125rem',
              color: 'var(--muted)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              border: '1px solid var(--line)',
              borderRadius: '9999px',
              padding: '0.35rem 0.85rem',
              transition: 'color 0.2s ease, border-color 0.2s ease',
            }}
          >
            Access / Sign In
          </Link>
        </aside>
      )}

      <h1>Home</h1>
    </main>
  );
}
