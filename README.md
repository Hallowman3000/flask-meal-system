# Meal Hub (Next.js)

This project has been fully refactored to **React + Next.js** and now runs as a single full-stack application.

## What changed

- Frontend pages now use the Next.js App Router (`app/` directory).
- Backend Flask services were replaced by Next.js API routes under `app/api`.
- Shared state helpers and server-side storage helpers are in `lib/`.
- Static images and JSON content are served from `public/assets`.

## Routes

- `/` home
- `/menu`
- `/cart`
- `/admin`
- `/login`
- `/register`

API routes:

- `GET /api/health`
- `POST /api/login`
- `GET /api/menu`
- `POST /api/menu` (requires `X-Admin-Token`)
- `POST /api/orders`

## Development

```bash
npm install
npm run dev
```

Admin token defaults to `admin-secret-token` and can be changed with `ADMIN_TOKEN`.


## Asset policy

This repository avoids committing binary assets. Image references in seed/content data use external HTTPS URLs.
