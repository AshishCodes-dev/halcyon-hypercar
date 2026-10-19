import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Not found | Halcyon';
  }, []);

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100svh',
        width: '100%',
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
        textAlign: 'center',
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
          letterSpacing: '-0.04em',
          lineHeight: 1.1,
          margin: '0 0 24px 0',
        }}
      >
        Page not found.
      </h1>
      <Link
        to="/"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          color: 'var(--accent)',
          textDecoration: 'none',
          borderBottom: '1px solid var(--accent)',
          paddingBottom: '2px',
          transition: 'opacity 0.2s ease',
        }}
      >
        Back to Halcyon
      </Link>
    </main>
  );
}
