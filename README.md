# Susi Air Pilot Web

Nuxt 3 mobile web application for the Susi Air Pilot App technical test.

## Requirements

- Node.js 22+
- A running Susi Air Pilot API

## Run locally

```bash
copy .env.example .env
npm install
npm run dev
```

Set `NUXT_PUBLIC_API_BASE=http://localhost:3001` for local development.

## Commands

```bash
npm run build
npm run start
```

## Architecture

- Nuxt 3 with Composition API and `<script setup lang="ts">`.
- Pinia owns the authenticated JWT session.
- SCSS implements the Susi Air visual system.
- Chart.js renders only API-provided rolling summaries and regulatory limits.

## Main technical choices

- **Nuxt 3 with Composition API and `<script setup>`:** keeps each screen's state, API requests, and interaction logic close together while remaining type-safe.
- **Pinia plus a cookie-backed session value:** Pinia owns login/logout state and the shared API composable consistently attaches the JWT to protected requests.
- **SCSS and official Susi Air logo asset:** preserves the supplied mobile design direction without introducing a utility-CSS dependency.
- **Chart.js loaded client-side only:** Canvas rendering stays out of SSR while data, chart limits, and rolling-window values remain supplied by the API.
- **One reusable branded loader:** Home and Schedule use the same reduced-motion-aware loading treatment rather than duplicating loading UI.

## With more time

- Add end-to-end browser tests for login, range switching, and month navigation.
- Add skeleton states and finer-grained loading for independent Home sections.
- Move the JWT to an HttpOnly cookie managed by the API and add refresh-token handling.
- Add a visual regression check against the final Figma design at common mobile widths.

## Deploy with Dokploy

1. Create an Application service from this repository.
2. Use the included `Dockerfile`; expose container port `3000`.
3. Set `NUXT_PUBLIC_API_BASE` to the public HTTPS API URL.
4. Attach a public domain, then update API `FRONTEND_ORIGIN` to that domain.

The final deployed URL will be recorded here before submission.
