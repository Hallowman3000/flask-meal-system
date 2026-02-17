# flask-meal-system

A meal ordering demo with a modernized web UI and a consolidated Flask backend API.

## Repository Organization

- `pages/` – Front-end HTML pages (`index`, `menu`, `cart`, `admin`)
- `assets/css/` – Shared responsive styles
- `assets/js/` – Client-side app logic for menu, cart, admin flows
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
