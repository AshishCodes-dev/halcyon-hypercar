/* ==========================================================================
   HALCYON CHAPTER CARD COMPONENT
   Editorial card rendering atmospheric procedural SVG scenes or optional photo override,
   with layered parallax, dynamic spotlight tracking, and readable captions.
   ========================================================================== */

import { useState, useEffect, useRef, forwardRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import NightTunnel from './scenes/NightTunnel';
import CoastDusk from './scenes/CoastDusk';
import RainDistrict from './scenes/RainDistrict';
import SaltFlat from './scenes/SaltFlat';
import SummitRoad from './scenes/SummitRoad';
import './scenes/scenes.css';

const SCENE_MAP = {
  'night-tunnel': NightTunnel,
  'coast-dusk': CoastDusk,
  'rain-district': RainDistrict,
  'salt-flat': SaltFlat,
  'summit-road': SummitRoad,
};

const ChapterCard = forwardRef(function ChapterCard(
  {
    chapter,
    index,
    isActive,
    isEntered,
    onCardClick,
  },
  forwardedRef
) {
  const shouldReduceMotion = useReducedMotion();
  const internalRef = useRef(null);
  const cardRef = forwardedRef || internalRef;
  const rafIdRef = useRef(null);

  // Visibility states for pausing continuous scene animations
  const [isCardVisible, setIsCardVisible] = useState(true);
  const [isTabVisible, setIsTabVisible] = useState(true);

  // Photo override detection
  const [photoUrl, setPhotoUrl] = useState(null);

  // Check if an image exists at /gallery/{photoName}.webp or .jpg
  useEffect(() => {
    let isMounted = true;
    const webpUrl = `/gallery/${chapter.photoName}.webp`;
    const jpgUrl = `/gallery/${chapter.photoName}.jpg`;

    const img = new Image();
    img.onload = () => {
      if (isMounted && img.naturalWidth > 0) {
        setPhotoUrl(webpUrl);
      }
    };
    img.onerror = () => {
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        if (isMounted && fallbackImg.naturalWidth > 0) {
          setPhotoUrl(jpgUrl);
        }
      };
      fallbackImg.onerror = () => {
        if (isMounted) setPhotoUrl(null);
      };
      fallbackImg.src = jpgUrl;
    };
    img.src = webpUrl;

    return () => {
      isMounted = false;
    };
  }, [chapter.photoName]);

  // Tab visibility observer
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Card viewport visibility observer for pausing off-screen animations
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsCardVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [cardRef]);

  // Cursor spotlight on desktop fine pointers
  const handleMouseMove = (e) => {
    if (shouldReduceMotion) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => {
      card.style.setProperty('--mx', `${x.toFixed(1)}px`);
      card.style.setProperty('--my', `${y.toFixed(1)}px`);
    });
  };

  const handleMouseLeave = () => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  const SceneComponent = SCENE_MAP[chapter.id] || NightTunnel;
  const isSceneActive = isCardVisible && isTabVisible;

  return (
    <figure
      ref={cardRef}
      id={`chapter-card-${chapter.id}`}
      data-index={index}
      className={`chapter-card ${isActive ? 'is-active' : ''} ${isEntered ? 'is-entered' : ''}`}
      style={{
        '--card-width': chapter.width,
        '--card-height': chapter.height,
        '--card-offset-y': chapter.offsetY,
        '--card-delay': `${index * 0.1}s`,
      }}
      onClick={() => onCardClick?.(index)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 1. Scene or Photo Container */}
      <div className="chapter-scene-wrapper">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={chapter.title}
            className="chapter-photo-img"
            loading="lazy"
          />
        ) : (
          <SceneComponent isVisible={isSceneActive} />
        )}
      </div>

      {/* 2. Soft Cursor Spotlight (Fine pointers only) */}
      {!shouldReduceMotion && (
        <div className="chapter-card-spotlight" aria-hidden="true" />
      )}

      {/* 3. Deep Bottom Readability Vignette Gradient */}
      <div className="chapter-card-vignette" aria-hidden="true" />

      {/* 4. Active & Hover Bottom Accent Border Line */}
      <div className="chapter-card-accent-border" aria-hidden="true" />

      {/* 5. Accessible Caption */}
      <figcaption className="chapter-caption">
        {/* Top Header: Chapter Number */}
        <div className="chapter-caption-top">
          <span className="chapter-number">{chapter.number}</span>
        </div>

        {/* Bottom Block: Title & Atmospheric Subtitle */}
        <div className="chapter-caption-bottom">
          <h3 className="chapter-title">{chapter.title}</h3>
          <p className="chapter-subtitle">{chapter.subtitle}</p>
        </div>
      </figcaption>
    </figure>
  );
});

export default ChapterCard;
