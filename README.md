# flask-meal-system

## Repository Organization

The repository is organized by concern:

- `pages/` – Front-end HTML pages and navigation entry points
- `assets/css/` – Front-end stylesheets
- `assets/js/` – Front-end JavaScript and TypeScript files
- `assets/images/` – Image assets used by the UI
- `assets/archive/` – Archived static bundles (for example `images.zip`)
- `services/` – Flask microservices (`menu`, `cart`, `notifications`, `admin`)
- `database/` – SQL schema and data scripts

## Running services

Each service can be started independently, for example:

```bash
python services/menu.py
python services/cart.py
python services/notifications.py
python services/admin.py
```
