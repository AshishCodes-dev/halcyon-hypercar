/* ==========================================================================
   CAR MODEL LOADER & ERROR BOUNDARY
   Attempts to load /models/halcyon.glb with Draco support via useGLTF.
   Falls back seamlessly to PlaceholderCar on 404, HTML return, or parse error.
   Auto-centers and auto-scales any model with Box3 so it sits on the floor at y=0.
   ========================================================================== */

import { Component, Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import PlaceholderCar from './PlaceholderCar';

// React Error Boundary for 3D GLTF loader failures
class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // Expected fallback when /models/halcyon.glb is not present on the server
    console.info('Halcyon 3D: /models/halcyon.glb not found or invalid. Using procedural concept placeholder.', error?.message || '');
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Inner component that loads the actual GLTF file
function GLTFModel({
  accentColor = '#2BFF88',
  emissiveIntensityRef,
  scrollProgressRef,
}) {
  // Pass true to enable Draco decoding
  const gltf = useGLTF('/models/halcyon.glb', true);
  const modelRef = useRef();
  const wheelsRef = useRef([]);

  // Clone scene so materials can be safely mutated
  const clonedScene = useMemo(() => {
    return gltf.scene.clone(true);
  }, [gltf.scene]);

  // Auto-center and normalize size using Box3
  useLayoutEffect(() => {
    if (!modelRef.current) return;

    const box = new THREE.Box3().setFromObject(modelRef.current);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Target car length ~ 4.6 units
    const maxDimension = Math.max(size.x, size.z);
    const targetScale = maxDimension > 0 ? 4.6 / maxDimension : 1;

    modelRef.current.scale.setScalar(targetScale);

    // Re-compute bounding box with applied scale
    box.setFromObject(modelRef.current);
    box.getCenter(center);

    // Center in X and Z, and place base of wheels flush with floor at y=0
    modelRef.current.position.x = -center.x;
    modelRef.current.position.z = -center.z;
    modelRef.current.position.y = -box.min.y;
  }, [clonedScene]);

  // Find wheels and configure materials for accent reactivity
  useEffect(() => {
    const wheels = [];
    const intensity = emissiveIntensityRef?.current ?? 2.0;

    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          const mat = child.material;
          const matName = mat.name || '';
          const meshName = child.name || '';

          // Match light/LED/accent materials
          if (/light|led|strip|accent|emissive|headlight|taillight/i.test(matName + meshName)) {
            mat.emissive = new THREE.Color(accentColor);
            mat.emissiveIntensity = intensity;
          }

          if ('envMapIntensity' in mat) {
            mat.envMapIntensity = 1.3;
          }
        }

        // Detect wheel meshes for rotation
        if (/wheel|tire|rim/i.test(child.name)) {
          wheels.push(child);
        }
      }
    });

    wheelsRef.current = wheels;
  }, [clonedScene, accentColor, emissiveIntensityRef]);

  // Update emissive intensity and wheel rotation per frame
  useFrame(() => {
    const currentIntensity = emissiveIntensityRef?.current ?? 2.0;

    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        const mat = child.material;
        const matName = mat.name || '';
        const meshName = child.name || '';
        if (/light|led|strip|accent|emissive|headlight|taillight/i.test(matName + meshName)) {
          mat.emissive.set(accentColor);
          mat.emissiveIntensity = currentIntensity;
        }
      }
    });

    const scrollProg = scrollProgressRef?.current ?? 0;
    const rotationAngle = scrollProg * Math.PI * 14;
    wheelsRef.current.forEach((wheel) => {
      wheel.rotation.x = -rotationAngle;
    });
  });

  return (
    <group ref={modelRef}>
      <primitive object={clonedScene} />
    </group>
  );
}

export default function CarModel(props) {
  return (
    <ModelErrorBoundary fallback={<PlaceholderCar {...props} />}>
      <Suspense fallback={<PlaceholderCar {...props} />}>
        <GLTFModel {...props} />
      </Suspense>
    </ModelErrorBoundary>
  );
}
