# flask-meal-system

A meal ordering demo with a React + Tailwind front-end and a consolidated Flask backend API.

## Repository Organization

- `pages/` – Entry HTML pages that mount the React app (`index`, `menu`, `cart`, `admin`)
- `assets/js/react-app.jsx` – Vite source entry for the shared React application
- `assets/js/react-app.js` – Legacy Babel-compatible fallback build
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

The pages first try loading `/assets/dist/react-app.bundle.js` (Vite output). If it is not present, they automatically fall back to the legacy CDN + Babel loader so the app still works in constrained environments.
