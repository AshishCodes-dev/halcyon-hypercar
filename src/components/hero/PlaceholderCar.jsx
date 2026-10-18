/* ==========================================================================
   PLACEHOLDER HYPERCAR
   Stylized procedural concept model displayed when /models/halcyon.glb is not present.
   Built with extruded aerodynamic body, clearcoat piano-black finish,
   aerodynamic glass canopy, 4 rotating wheels, and emissive accent light blades.
   ========================================================================== */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Subcomponent for emissive accent blades to avoid accessing ref.current during render
function EmissiveAccentBlade({
  position,
  args,
  accentColor,
  emissiveIntensityRef,
}) {
  const matRef = useRef();

  useFrame(() => {
    if (matRef.current) {
      matRef.current.emissive.set(accentColor);
      matRef.current.color.set(accentColor);
      if (emissiveIntensityRef?.current !== undefined) {
        matRef.current.emissiveIntensity = emissiveIntensityRef.current;
      }
    }
  });

  return (
    <mesh position={position}>
      <boxGeometry args={args} />
      <meshStandardMaterial
        ref={matRef}
        color={accentColor}
        emissive={accentColor}
        emissiveIntensity={2.0}
        roughness={0.2}
        metalness={0.1}
      />
    </mesh>
  );
}

// Subcomponent for rotating wheel assembly
function HypercarWheel({
  position,
  scrollProgressRef,
  accentColor,
  emissiveIntensityRef,
}) {
  const wheelAssemblyRef = useRef();
  const hubMatRef = useRef();

  useFrame(() => {
    const scrollProg = scrollProgressRef?.current ?? 0;
    if (wheelAssemblyRef.current) {
      wheelAssemblyRef.current.rotation.z = -scrollProg * Math.PI * 14;
    }
    if (hubMatRef.current) {
      hubMatRef.current.emissive.set(accentColor);
      hubMatRef.current.color.set(accentColor);
      if (emissiveIntensityRef?.current !== undefined) {
        hubMatRef.current.emissiveIntensity = emissiveIntensityRef.current;
      }
    }
  });

  return (
    <group position={position}>
      <group ref={wheelAssemblyRef} rotation={[Math.PI / 2, 0, 0]}>
        {/* Rubber Tire */}
        <mesh castShadow>
          <cylinderGeometry args={[0.33, 0.33, 0.24, 32]} />
          <meshStandardMaterial color="#141414" roughness={0.88} metalness={0.08} />
        </mesh>

        {/* Dark Machined Multi-Spoke Rim */}
        <mesh>
          <cylinderGeometry args={[0.24, 0.24, 0.245, 24]} />
          <meshStandardMaterial color="#0e0e0e" roughness={0.2} metalness={0.92} />
        </mesh>

        {/* Accent Center Hub Cap */}
        <mesh>
          <cylinderGeometry args={[0.045, 0.045, 0.25, 16]} />
          <meshStandardMaterial
            ref={hubMatRef}
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={2.0}
          />
        </mesh>
      </group>
    </group>
  );
}

export default function PlaceholderCar({
  accentColor = '#2BFF88',
  emissiveIntensityRef,
  scrollProgressRef,
}) {
  // Generate aerodynamic side profile shape for extrusion
  const bodyGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Front splitter
    shape.moveTo(2.35, 0.08);
    // Front nose curve up to low hood
    shape.quadraticCurveTo(2.1, 0.22, 1.7, 0.32);
    // Front hood sweeping to windshield base
    shape.quadraticCurveTo(1.2, 0.42, 0.65, 0.52);
    // Low raked windshield
    shape.quadraticCurveTo(0.25, 0.82, -0.15, 0.94);
    // Sleek teardrop roofline
    shape.quadraticCurveTo(-0.6, 0.95, -1.0, 0.82);
    // Fastback rear deck down to spoiler
    shape.quadraticCurveTo(-1.6, 0.65, -2.1, 0.48);
    // Rear ducktail / lightblade overhang
    shape.lineTo(-2.3, 0.45);
    // Down to rear diffuser
    shape.lineTo(-2.2, 0.18);
    // Diffuser tunnel cutout
    shape.lineTo(-1.8, 0.08);
    // Undertray to front splitter
    shape.lineTo(2.35, 0.08);

    const extrudeSettings = {
      depth: 1.74,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    geom.translate(0, 0.45, 0);
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Aerodynamic cockpit canopy
  const canopyGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0.65, 0.52);
    shape.quadraticCurveTo(0.25, 0.82, -0.15, 0.94);
    shape.quadraticCurveTo(-0.6, 0.95, -1.0, 0.82);
    shape.lineTo(-1.0, 0.52);
    shape.lineTo(0.65, 0.52);

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 1.1,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    });
    geom.center();
    geom.translate(-0.18, 0.72, 0);
    geom.computeVertexNormals();
    return geom;
  }, []);

  return (
    <group name="HalcyonPlaceholderCar">
      {/* 1. Piano-black Clearcoat Main Body */}
      <mesh geometry={bodyGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#080808"
          roughness={0.22}
          metalness={0.65}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
          reflectivity={0.9}
          envMapIntensity={1.4}
        />
      </mesh>

      {/* 2. Glossy Dark Cockpit Canopy */}
      <mesh geometry={canopyGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#030303"
          roughness={0.06}
          metalness={0.9}
          clearcoat={1.0}
          clearcoatRoughness={0.04}
          envMapIntensity={1.8}
        />
      </mesh>

      {/* 3. Front Horizontal Accent LED Light Blade */}
      <EmissiveAccentBlade
        position={[2.28, 0.38, 0]}
        args={[0.04, 0.035, 1.38]}
        accentColor={accentColor}
        emissiveIntensityRef={emissiveIntensityRef}
      />

      {/* 4. Rear Full-Width Accent Light Blade */}
      <EmissiveAccentBlade
        position={[-2.24, 0.54, 0]}
        args={[0.04, 0.035, 1.48]}
        accentColor={accentColor}
        emissiveIntensityRef={emissiveIntensityRef}
      />

      {/* 5. Aerodynamic Front Lower Splitter Blade */}
      <mesh position={[2.2, 0.12, 0]}>
        <boxGeometry args={[0.3, 0.025, 1.6]} />
        <meshStandardMaterial color="#111111" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* 6. Rear Diffuser Blades */}
      <mesh position={[-2.05, 0.14, 0]}>
        <boxGeometry args={[0.4, 0.03, 1.55]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* 7. Side Aero Rocker Blades with Subtle Accent Edge */}
      <EmissiveAccentBlade
        position={[0, 0.12, 0.88]}
        args={[2.4, 0.015, 0.02]}
        accentColor={accentColor}
        emissiveIntensityRef={emissiveIntensityRef}
      />
      <EmissiveAccentBlade
        position={[0, 0.12, -0.88]}
        args={[2.4, 0.015, 0.02]}
        accentColor={accentColor}
        emissiveIntensityRef={emissiveIntensityRef}
      />

      {/* 8. Four Hypercar Wheels */}
      <HypercarWheel
        position={[1.32, 0.32, 0.92]}
        scrollProgressRef={scrollProgressRef}
        accentColor={accentColor}
        emissiveIntensityRef={emissiveIntensityRef}
      />
      <HypercarWheel
        position={[1.32, 0.32, -0.92]}
        scrollProgressRef={scrollProgressRef}
        accentColor={accentColor}
        emissiveIntensityRef={emissiveIntensityRef}
      />
      <HypercarWheel
        position={[-1.34, 0.34, 0.94]}
        scrollProgressRef={scrollProgressRef}
        accentColor={accentColor}
        emissiveIntensityRef={emissiveIntensityRef}
      />
      <HypercarWheel
        position={[-1.34, 0.34, -0.94]}
        scrollProgressRef={scrollProgressRef}
        accentColor={accentColor}
        emissiveIntensityRef={emissiveIntensityRef}
      />
    </group>
  );
}
