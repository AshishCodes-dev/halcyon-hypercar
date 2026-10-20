/* ==========================================================================
   HERO 3D SCENE (R3F Canvas)
   Cinematic WebGL canvas featuring the Halcyon hypercar, custom Lightformers,
   reflective dark floor, soft accent glow pool, and desktop Bloom post-processing.
   Loaded via React.lazy to keep initial main bundle small.
   ========================================================================== */

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, MeshReflectorMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import CarModel from './CarModel';

// Inner 3D World Scene containing lights, car, floor, and animation updates
function SceneContent({
  accentColor = '#2BFF88',
  scrollProgressRef,
  pointerRef,
  shouldReduceMotion = false,
  isMobile = false,
  onSceneReady,
}) {
  const { camera } = useThree();
  const carGroupRef = useRef();
  const rimLightRef = useRef();
  const floorGlowMaterialRef = useRef();

  // Dynamic accent color lerp reference
  const currentAccent = useRef(new THREE.Color(accentColor));
  const targetAccent = useMemo(() => new THREE.Color(accentColor), [accentColor]);

  // Animation states for Intro
  const introTimeRef = useRef(0);
  const [introFinished, setIntroFinished] = useState(shouldReduceMotion);
  const emissiveIntensityRef = useRef(shouldReduceMotion ? 2.0 : 0);

  // Pointer tilt physics
  const tiltRef = useRef({ x: 0, y: 0 });

  // Generate procedural soft radial glow texture for the floor
  const floorGlowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
    grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.45)');
    grad.addColorStop(0.45, 'rgba(255, 255, 255, 0.16)');
    grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.03)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  // Notify parent component that 3D scene is mounted and ready
  useEffect(() => {
    if (onSceneReady) {
      onSceneReady();
    }
  }, [onSceneReady]);

  // Main per-frame animation loop (runs only when hero is in viewport)
  useFrame((_, delta) => {
    // 1. Smoothly lerp active accent color (approx 0.08 factor)
    currentAccent.current.lerp(targetAccent, 0.08);

    if (rimLightRef.current) {
      rimLightRef.current.color.copy(currentAccent.current);
    }
    if (floorGlowMaterialRef.current) {
      floorGlowMaterialRef.current.color.copy(currentAccent.current);
    }

    // 2. Intro Animation Phase (approx 2s glide and light flicker)
    let introGlideZ = 0;
    let introRotOffset = 0;

    if (!shouldReduceMotion && !introFinished) {
      introTimeRef.current += delta;
      const t = introTimeRef.current;

      // Glide from deeper in the scene (z: -1.2 -> 0)
      const glideProgress = Math.min(1, t / 1.8);
      const easeGlide = 1 - Math.pow(1 - glideProgress, 3);
      introGlideZ = (1 - easeGlide) * -1.2;
      introRotOffset = (1 - easeGlide) * 0.18;

      // Light strip startup double-flicker sequence
      if (t < 0.35) {
        emissiveIntensityRef.current = 0;
      } else if (t < 0.55) {
        emissiveIntensityRef.current = (t - 0.35) * 11; // spike
      } else if (t < 0.7) {
        emissiveIntensityRef.current = 0.25; // flicker dip 1
      } else if (t < 0.9) {
        emissiveIntensityRef.current = 2.8; // spike 2
      } else if (t < 1.1) {
        emissiveIntensityRef.current = 0.8; // dip 2
      } else {
        emissiveIntensityRef.current = 2.0; // steady state
      }

      if (t >= 2.0) {
        setIntroFinished(true);
      }
    } else {
      emissiveIntensityRef.current = 2.0;
    }

    // 3. Scroll-driven timeline scrubbing (GSAP mutable progress 0 to 1)
    const scrollProg = scrollProgressRef?.current || 0;

    // Pointer cursor tilt (max ~4deg, lerp 0.06, desktop only)
    if (!isMobile && !shouldReduceMotion && pointerRef?.current) {
      const targetTiltX = pointerRef.current.y * 0.045;
      const targetTiltY = pointerRef.current.x * 0.065;
      tiltRef.current.x += (targetTiltX - tiltRef.current.x) * 0.06;
      tiltRef.current.y += (targetTiltY - tiltRef.current.y) * 0.06;
    }

    // Base Car Orientation: 3/4 front view (~0.22*PI)
    let carRotY = Math.PI * 0.22 + introRotOffset;
    let camY = isMobile ? 1.55 : 1.45;
    let camZ = isMobile ? 7.6 : 5.8;
    let carPosY = isMobile ? 0.32 : 0;
    let floorGlowOpacity = isMobile ? 0.22 : 0.38;

    if (!shouldReduceMotion) {
      if (scrollProg <= 0.4) {
        // Phase 1 (0 -> 0.4): Rotate from 3/4 front to clean side profile (0.5*PI), camera dollies closer
        const p1 = scrollProg / 0.4;
        const easeP1 = 0.5 - Math.cos(p1 * Math.PI) / 2;
        carRotY = THREE.MathUtils.lerp(Math.PI * 0.22, Math.PI * 0.5, easeP1);
        camZ = THREE.MathUtils.lerp(isMobile ? 7.6 : 5.8, isMobile ? 6.8 : 5.0, easeP1);
        camY = THREE.MathUtils.lerp(isMobile ? 1.55 : 1.45, isMobile ? 1.45 : 1.35, easeP1);
        floorGlowOpacity = THREE.MathUtils.lerp(isMobile ? 0.22 : 0.38, isMobile ? 0.32 : 0.5, easeP1);
      } else if (scrollProg <= 0.8) {
        // Phase 2 (0.4 -> 0.8): Rotate toward rear 3/4 view, floor glow intensifies
        const p2 = (scrollProg - 0.4) / 0.4;
        const easeP2 = 0.5 - Math.cos(p2 * Math.PI) / 2;
        carRotY = THREE.MathUtils.lerp(Math.PI * 0.5, Math.PI * 0.82, easeP2);
        camZ = THREE.MathUtils.lerp(isMobile ? 6.8 : 5.0, isMobile ? 7.2 : 5.4, easeP2);
        camY = THREE.MathUtils.lerp(isMobile ? 1.45 : 1.35, isMobile ? 1.55 : 1.48, easeP2);
        floorGlowOpacity = THREE.MathUtils.lerp(isMobile ? 0.32 : 0.5, isMobile ? 0.45 : 0.8, easeP2);
      } else {
        // Phase 3 (0.8 -> 1.0): Camera pulls back, car descends slightly and releases into #models
        const p3 = (scrollProg - 0.8) / 0.2;
        carRotY = Math.PI * 0.82 + p3 * 0.15;
        camZ = THREE.MathUtils.lerp(isMobile ? 7.2 : 5.4, isMobile ? 8.2 : 6.4, p3);
        camY = THREE.MathUtils.lerp(isMobile ? 1.55 : 1.48, isMobile ? 1.80 : 1.75, p3);
        carPosY = (isMobile ? 0.32 : 0) - p3 * 0.55;
        floorGlowOpacity = THREE.MathUtils.lerp(isMobile ? 0.45 : 0.8, 0.1, p3);
      }
    }

    // Apply Camera transforms
    camera.position.set(0, camY, camZ);
    camera.lookAt(0, isMobile ? 0.18 : 0.42, 0);

    // Apply Car Group transforms
    if (carGroupRef.current) {
      carGroupRef.current.position.y = carPosY;
      carGroupRef.current.position.z = introGlideZ;
      carGroupRef.current.rotation.y = carRotY + tiltRef.current.y;
      carGroupRef.current.rotation.x = tiltRef.current.x;
      carGroupRef.current.rotation.z = -tiltRef.current.y * 0.25;
    }

    // Apply dynamic floor glow opacity
    if (floorGlowMaterialRef.current) {
      floorGlowMaterialRef.current.opacity = floorGlowOpacity;
    }
  });

  return (
    <>
      {/* Studio Lighting without external HDR files (Lightformer panels inside Environment) */}
      <Environment resolution={256}>
        {/* Soft overhead strip light */}
        <Lightformer
          form="rect"
          intensity={2.2}
          position={[0, 4.5, 0]}
          scale={[10, 1.2, 1]}
          rotation={[Math.PI / 2, 0, 0]}
          color="#ffffff"
        />
        {/* Two aerodynamic flank strips */}
        <Lightformer
          form="rect"
          intensity={1.8}
          position={[-4.5, 2.2, 0]}
          scale={[9, 1.1, 1]}
          rotation={[0, Math.PI / 2, 0]}
          color="#e4ecff"
        />
        <Lightformer
          form="rect"
          intensity={1.8}
          position={[4.5, 2.2, 0]}
          scale={[9, 1.1, 1]}
          rotation={[0, -Math.PI / 2, 0]}
          color="#ffffff"
        />
        {/* Warm-neutral soft front fill */}
        <Lightformer
          form="ring"
          intensity={1.2}
          position={[0, 1.2, 5.5]}
          scale={[4.5, 4.5, 1]}
          color="#fdf5ec"
        />
        {/* Accent-colored rim light reflection panel behind car */}
        <Lightformer
          form="rect"
          intensity={3.5}
          position={[0, 1.6, -4.5]}
          scale={[7, 0.6, 1]}
          color={accentColor}
        />
      </Environment>

      {/* Directional Key & Fill Lights */}
      <directionalLight position={[4.5, 6, 4]} intensity={1.4} color="#ffffff" castShadow />
      <directionalLight position={[-4, 4, -3]} intensity={0.8} color="#a6b8d4" />

      {/* Dedicated Accent Rim Light behind hypercar */}
      <pointLight
        ref={rimLightRef}
        position={[0, 1.4, -3.8]}
        intensity={3.2}
        distance={11}
        color={accentColor}
      />

      {/* Hypercar Model Group */}
      <group
        ref={carGroupRef}
        scale={isMobile ? 0.65 : 1.0}
      >
        <CarModel
          accentColor={accentColor}
          emissiveIntensityRef={emissiveIntensityRef}
          scrollProgressRef={scrollProgressRef}
        />
      </group>

      {/* Dark Glossy Reflective Floor (drei MeshReflectorMaterial on desktop, simple matte on mobile) */}
      {!isMobile ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]}>
          <planeGeometry args={[32, 32]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={512}
            mixBlur={1.0}
            mixStrength={14}
            roughness={0.65}
            depthScale={1.1}
            minDepthThreshold={0.35}
            maxDepthThreshold={1.4}
            color="#060606"
            metalness={0.65}
            mirror={0.38}
          />
        </mesh>
      ) : (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]}>
          <planeGeometry args={[24, 24]} />
          <meshStandardMaterial color="#080808" roughness={0.35} metalness={0.7} />
        </mesh>
      )}

      {/* Soft Accent Glow Pool under the hypercar */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, isMobile ? 0.32 : 0.003, 0]}>
        <planeGeometry args={[isMobile ? 6 : 8, isMobile ? 6 : 8]} />
        <meshBasicMaterial
          ref={floorGlowMaterialRef}
          map={floorGlowTexture}
          color={accentColor}
          transparent
          opacity={isMobile ? 0.22 : 0.38}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Desktop-only Post-Processing (Bloom on light strips + subtle vignette) */}
      {!isMobile && (
        <EffectComposer disableNormalPass multisampling={0}>
          <Bloom
            luminanceThreshold={0.86}
            luminanceSmoothing={0.25}
            intensity={1.15}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.16} darkness={0.62} />
        </EffectComposer>
      )}
    </>
  );
}

// Default export wrapper around R3F Canvas
export default function HeroScene({
  accentColor = '#2BFF88',
  scrollProgressRef,
  pointerRef,
  shouldReduceMotion = false,
  isOnScreen = true,
  onSceneReady,
  onWebGLError,
}) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 860
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 860);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="hero-canvas-container"
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        touchAction: 'pan-y',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 85%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 85%, transparent 100%)',
      }}
      aria-hidden="true"
    >
      <Canvas
        dpr={isMobile ? [1, 1.25] : [1, 1.75]}
        frameloop={isOnScreen ? 'always' : 'never'}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        camera={{ position: [0, 1.45, 5.8], fov: 35 }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            console.warn('Halcyon: WebGL context lost. Switching to fallback.');
            if (onWebGLError) onWebGLError();
          });
        }}
      >
        <Suspense fallback={null}>
          <SceneContent
            accentColor={accentColor}
            scrollProgressRef={scrollProgressRef}
            pointerRef={pointerRef}
            shouldReduceMotion={shouldReduceMotion}
            isMobile={isMobile}
            onSceneReady={onSceneReady}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
