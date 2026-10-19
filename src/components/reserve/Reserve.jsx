import { useState, useEffect, useRef } from 'react';
import { RESERVE_HEADER, ALLOCATION_DATA } from '../../data/reserve';
import TickRing from './TickRing';
import ReserveForm from './ReserveForm';
import './Reserve.css';

export default function Reserve() {
  const sectionRef = useRef(null);
  const [isEntered, setIsEntered] = useState(false);
  const [claimedCount, setClaimedCount] = useState(ALLOCATION_DATA.initialClaimed);
  const [hasNewlyClaimed, setHasNewlyClaimed] = useState(false);

  // Viewport IntersectionObserver to trigger entrance sweeps
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
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleReserveSuccess = () => {
    setClaimedCount((prev) => prev + 1);
    setHasNewlyClaimed(true);
  };

  return (
    <section
      id="reserve"
      ref={sectionRef}
      className={`reserve-section ${isEntered ? 'is-entered' : ''}`}
      aria-labelledby="reserve-heading"
    >
      <div className="reserve-container">
        <div className="reserve-grid">
          {/* Left Column: Heading, Disclaimer & Tick Ring */}
          <div className="reserve-left-col">
            <span className="reserve-eyebrow">{RESERVE_HEADER.eyebrow}</span>
            <h2 id="reserve-heading" className="reserve-heading">
              {RESERVE_HEADER.heading}
            </h2>
            <p className="reserve-disclaimer">{RESERVE_HEADER.disclaimer}</p>

            <TickRing
              claimedCount={claimedCount}
              totalCount={ALLOCATION_DATA.total}
              isEntered={isEntered}
              hasNewlyClaimed={hasNewlyClaimed}
            />
          </div>

          {/* Right Column: Reservation Form */}
          <div className="reserve-right-col">
            <ReserveForm
              claimedCount={claimedCount}
              onReserveSuccess={handleReserveSuccess}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
