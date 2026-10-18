import { useState, useEffect, useRef } from 'react';
import { MATERIALS_HEADER, MATERIALS } from '../../data/materials';
import MaterialTile from './MaterialTile';
import './Materials.css';

export default function Materials() {
  const sectionRef = useRef(null);
  const [isEntered, setIsEntered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsEntered(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleFirstInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  return (
    <section
      id="materials"
      ref={sectionRef}
      className={`materials-section ${isEntered ? 'is-entered' : ''}`}
      aria-labelledby="materials-heading"
    >
      <div className="materials-container">
        {/* Section Header */}
        <header className="materials-header">
          <span className="materials-eyebrow">{MATERIALS_HEADER.eyebrow}</span>
          <div className="materials-heading-mask">
            <h2 id="materials-heading" className="materials-heading">
              {MATERIALS_HEADER.heading}
            </h2>
          </div>
          <div className="materials-header-meta">
            <p className="materials-disclaimer">{MATERIALS_HEADER.disclaimer}</p>
            <p className={`materials-hint ${hasInteracted ? 'is-faded' : ''}`}>
              <span className="hint-desktop">{MATERIALS_HEADER.desktopHint}</span>
              <span className="hint-touch">{MATERIALS_HEADER.touchHint}</span>
            </p>
          </div>
        </header>

        {/* 12-Column Asymmetric Tactile Grid */}
        <div className="materials-grid">
          {MATERIALS.map((material, idx) => (
            <MaterialTile
              key={material.id}
              material={material}
              index={idx}
              isEntered={isEntered}
              onFirstInteraction={handleFirstInteraction}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
