import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    // Accommodate the lazy-loaded 3D HeroScene chunk (Three.js + R3F + postprocessing)
    chunkSizeWarningLimit: 1250,
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Keep three, @react-three, and postprocessing out so they stay in lazy HeroScene
            if (
              id.includes('three') ||
              id.includes('@react-three') ||
              id.includes('postprocessing')
            ) {
              return;
            }
            if (
              id.includes('/react/') ||
              id.includes('\\react\\') ||
              id.includes('/react-dom/') ||
              id.includes('\\react-dom\\') ||
              id.includes('/react-router/') ||
              id.includes('\\react-router\\') ||
              id.includes('/react-router-dom/') ||
              id.includes('\\react-router-dom\\') ||
              id.includes('/scheduler/') ||
              id.includes('\\scheduler\\')
            ) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-framer';
            }
            if (id.includes('gsap') || id.includes('lenis')) {
              return 'vendor-gsap-lenis';
            }
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
          }
        },
      },
    },
  },
})
