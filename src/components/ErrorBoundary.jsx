import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('[Halcyon] Caught application crash in ErrorBoundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100svh',
            width: '100vw',
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
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              margin: '0 0 24px 0',
            }}
          >
            Something went wrong.
          </h1>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              color: 'var(--bg)',
              backgroundColor: 'var(--accent)',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'opacity 0.2s ease',
            }}
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
