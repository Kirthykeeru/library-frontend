# Library Frontend

React + TypeScript + Tailwind UI for the [library-backend](https://github.com/Kirthykeeru/library-backend) API — login/registration, book catalog, member management, and borrow-record tracking, with role-based views for students vs. staff.

## Stack

- React 19 + React Router
- TypeScript
- Tailwind CSS
- Vite
- Axios

## Setup

```bash
npm install
cp .env.example .env   # set VITE_API_URL to your backend's URL
npm run dev
```

## Build

```bash
npm run build   # outputs static files to dist/
```

## Deployment

This is a static site once built — deploy `dist/` directly to a free static host (Vercel, Netlify, Cloudflare Pages) rather than using the included `Dockerfile`, which is only needed if you specifically want to run the frontend as a container.

Set the `VITE_API_URL` environment variable on your host to your deployed backend's URL before building — Vite bakes it into the bundle at build time.
