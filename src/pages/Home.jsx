import { useEffect } from 'react';

const sections = [
  { id: 'top', title: 'Halcyon', subtitle: 'The Apex of Electric Hypercar Engineering' },
  { id: 'models', title: 'Models', subtitle: 'Bespoke Aerodynamic Monocoques' },
  { id: 'design', title: 'Design', subtitle: 'Form Perfected Through Fluid Dynamics' },
  { id: 'performance', title: 'Performance', subtitle: 'Sub-Two Second Acceleration & Active Vectoring' },
  { id: 'colors', title: 'Colors', subtitle: 'Five Bespoke Signature Finishes' },
];

export default function Home() {
  useEffect(() => {
    document.title = 'Halcyon | Hypercar';
  }, []);

  return (
    <main id="main-content" style={{ width: '100%', backgroundColor: 'var(--bg)' }}>
      {sections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          style={{
            minHeight: '100svh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg)',
            color: 'var(--text)',
            borderBottom: index < sections.length - 1 ? '1px solid var(--line)' : 'none',
            padding: 'clamp(2rem, 1.5rem + 2vw, 4rem) clamp(1rem, 0.8rem + 1.5vw, 2.5rem)',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.75rem, 0.7rem + 0.2vw, 0.875rem)',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              marginBottom: '1rem',
              fontWeight: 600,
            }}
          >
            0{index + 1} / {section.id.toUpperCase()}
          </span>

          <h2
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(2.75rem, 2rem + 4vw, 6.5rem)',
              fontWeight: 750,
              letterSpacing: '-0.04em',
              color: 'var(--text)',
              lineHeight: 1.06,
              marginBottom: '1.25rem',
            }}
          >
            {section.title}
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.95rem, 0.9rem + 0.25vw, 1.25rem)',
              color: 'var(--muted)',
              maxWidth: '560px',
              lineHeight: 1.5,
              fontWeight: 400,
            }}
          >
            {section.subtitle}
          </p>
        </section>
      ))}
    </main>
  );
}
