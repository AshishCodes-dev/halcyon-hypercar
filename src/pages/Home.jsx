import { useEffect } from 'react';
import Hero from '../components/hero/Hero';
import Models from '../components/models/Models';
import Design from '../components/design/Design';
import Performance from '../components/performance/Performance';
import Colors from '../components/colors/Colors';
import Gallery from '../components/gallery/Gallery';
import Materials from '../components/materials/Materials';

export default function Home() {
  useEffect(() => {
    document.title = 'Halcyon | Hypercar';
  }, []);

  return (
    <main id="main-content" style={{ width: '100%', backgroundColor: 'transparent' }}>
      {/* 3D Cinematic Hero Section with ScrollTrigger scrub */}
      <Hero />

      {/* Models Lineup Section with GSAP pinned scrub */}
      <Models />

      {/* Design Blueprint Section with GSAP pinned scrub */}
      <Design />

      {/* Performance Launch Run Section with GSAP pinned scrub */}
      <Performance />

      {/* Colors Finish Selector Section */}
      <Colors />

      {/* Chapters Atmospheric Gallery Section */}
      <Gallery />

      {/* Tactile Materials Section */}
      <Materials />
    </main>
  );
}
