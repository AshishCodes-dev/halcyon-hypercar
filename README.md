# Halcyon

Cinematic concept website for a fictional electric hypercar brand, featuring scroll-driven 3D presentation, a live accent color system, and an allocation reservation demo.

## Concept Project

Halcyon is a fictional brand. All vehicle specifications, production numbers, pricing, and narrative copy are concept placeholders designed for demonstration purposes only.

## Sections

- **Hero**: Cinematic 3D hypercar canvas with scrub-driven camera movement and telemetry readouts.
- **Models**: Pinned lineup showcase of vehicle variants with count-up specifications.
- **Design**: Technical blueprint viewer with interactive zoom-target hotspots.
- **Performance**: Scroll-driven launch simulation accelerating from 0 to 400 km/h.
- **Colors**: Five-panel expanding finish selector with live accent transitions.
- **Gallery**: Atmospheric chapters exploring the vehicle across distinct environments.
- **Materials**: Macro swatch inspector detailing bespoke tactile surfaces.
- **Reserve**: Allocation counter with a 500-tick radial meter and reservation form.
- **Footer**: Finale layout featuring an interactive, light-filled cropped wordmark.

## Tech Stack

- **React 19**: Component architecture and state management.
- **Vite**: Build tooling and optimized production bundling with Rolldown.
- **React Router**: Client-side single-page routing and route code-splitting.
- **GSAP & ScrollTrigger**: Scroll-driven animation timelines and pinned scenes.
- **Lenis**: Smooth scrolling engine synchronized with animation frames.
- **Framer Motion**: Gesture physics and interface transitions.
- **Three.js & React Three Fiber**: WebGL canvas, 3D model rendering, and post-processing shaders.
- **Firebase Authentication**: Google OAuth sign-in integration.
- **Plain CSS**: Modern CSS tokens, custom properties, and fluid typography without frameworks.

## Features

- Scroll-driven animation synchronized with viewport progress.
- Live accent system synced across the entire site via CSS custom properties.
- Fully responsive layout adapted down to 360px viewports.
- Reduced-motion support respecting system preferences.
- Google sign-in with persistent authentication state.

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in the 4 Firebase credentials.

3. Start the local development server:
   ```bash
   pnpm dev
   ```
   To test on a mobile device on your local network, run `pnpm dev:phone`.

## Firebase Setup

1. Create a project in the Firebase Console.
2. Enable Google sign-in under Authentication > Sign-in method.
3. Register a web application to retrieve your Firebase configuration credentials.
4. Add authorized domains under Authentication > Settings > Authorized domains (`localhost` and your production deployment domain).

## Custom 3D Model

Place a custom GLB model at `public/models/halcyon.glb`. Any materials with names matching `light`, `led`, `strip`, `accent`, or `emissive` will dynamically adopt the active accent color. If the file is absent, the application automatically renders a procedural code-built concept car.

## Gallery Photos

Optional high-resolution photography can be placed at `public/gallery/chapter-01.webp` through `public/gallery/chapter-05.webp`. When present, these override procedural atmospheric canvases.

## Deployment

### Vercel
1. Import the repository into Vercel.
2. Select the **Vite** framework preset.
3. Add the four `VITE_FIREBASE_*` environment variables in the project settings.
4. Deploy. Single-page application rewrites are pre-configured in `vercel.json`.

### Render (Static Site)
1. Create a new Static Site on Render and connect the repository.
2. Build command: `pnpm install && pnpm build`
3. Publish directory: `dist`
4. Add a rewrite rule under Redirects/Rewrites: `/*` -> `/index.html` (Rewrite).
5. Add the four `VITE_FIREBASE_*` environment variables in the Environment tab.

## Screenshots

Screenshots coming soon.

## License & Credits

Concept project. Fictional brand. 3D model credits will be listed here if a third-party model is used.

Built by Ashish.
