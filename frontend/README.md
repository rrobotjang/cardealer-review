# Best Cars — frontend (React SPA)

Vite + React + TypeScript SPA with Bootstrap 5. Talks to the Django BFF API
(`/api/*`); in production the compiled bundle is served by Django itself
(assets under `/static/`).

## Development

```bash
npm install
npm run dev        # http://localhost:5173, proxies /api to http://127.0.0.1:8000
```

Requires the backend + microservices running (see root `README.md`).

## Production build

```bash
npm run build      # outputs frontend/dist (index.html + assets/ with hashed files)
```

Django picks the build up automatically:

- `frontend/dist/index.html` is rendered by the SPA catch-all route (`/`),
- `frontend/dist/assets/*` is served from `/static/assets/*` via staticfiles
  (`STATICFILES_DIRS` includes the dist assets dir).

Rebuild after frontend changes; the backend image build (multi-stage Dockerfile)
runs `npm run build` itself.

## Structure

```
src/
  api.ts             typed fetch client (Bearer JWT from sessionStorage)
  auth.tsx           AuthProvider: session, login/register/logout, modal state
  types.ts           API response types
  theme.css          Bootstrap token overrides (IBM blue) + component tweaks
  App.tsx            routes
  components/        Layout (navbar + footer), AuthModal (login/register)
  pages/             Home, Dealers, DealerDetail, PostReview, About, Contact
```

Auth state lives in `sessionStorage` (`jwt`, `username`) for continuity with the
original server-rendered app.
