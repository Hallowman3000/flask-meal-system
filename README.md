# flask-meal-system

A meal ordering demo with a React + Tailwind front-end and a consolidated Flask backend API.

## Repository Organization

- `pages/` – Entry HTML pages that mount the React app (`index`, `menu`, `cart`, `admin`)
- `assets/js/react-app.jsx` – Vite source entry for the shared React application
- `assets/js/react-app.js` – Legacy non-bundled React source retained for reference
- `assets/dist/react-app.bundle.js` – Vite production output (generated)
- `assets/data/home-content.json` – JSON content source for landing page featured items
- `services/app.py` – Primary Flask server (serves UI + REST API)
- `services/` – Legacy microservice files kept for reference
- `database/` – SQL scripts and generated SQLite database (`meal_system.db`)

## Run the application

```bash
python services/app.py
```

Then open:

- `http://localhost:5000/` – Landing page
- `http://localhost:5000/pages/menu.html` – Menu page
- `http://localhost:5000/pages/cart.html` – Cart/checkout
- `http://localhost:5000/pages/admin.html` – Admin page

## API Overview

- `GET /api/health` – API health check
- `GET /api/menu` – List menu items
- `POST /api/menu` – Create menu item (requires `X-Admin-Token` header)
- `POST /api/orders` – Submit an order from cart items

Default admin token: `dev-admin-token` (override with `MEAL_ADMIN_TOKEN`).

## Front-end build (Vite)

Install dependencies and build the production bundle:

```bash
npm install
npm run build
```

The pages now load only the Vite bundle (`assets/dist/react-app.bundle.js`). Run the app through `python services/app.py` (or any local HTTP server) instead of opening HTML files with `file://` to avoid browser module/CORS issues.


## Troubleshooting browser console warnings

If you open `pages/*.html` directly from disk, the browser can show warnings/errors about React DevTools, Babel, or blocked module scripts. Use this flow instead:

```bash
npm install
npm run build
python services/app.py
```

Then visit `http://localhost:5000/`.
