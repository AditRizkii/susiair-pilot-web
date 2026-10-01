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

## Deploy with Dokploy

1. Create an Application service from this repository.
2. Use the included `Dockerfile`; expose container port `3000`.
3. Set `NUXT_PUBLIC_API_BASE` to the public HTTPS API URL.
4. Attach a public domain, then update API `FRONTEND_ORIGIN` to that domain.

The final deployed URL will be recorded here before submission.
