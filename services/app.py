from __future__ import annotations

import os
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Any

from flask import Flask, jsonify, request, send_from_directory

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "database" / "meal_system.db"
ADMIN_TOKEN = os.getenv("MEAL_ADMIN_TOKEN", "dev-admin-token")

app = Flask(__name__, static_folder=str(BASE_DIR), static_url_path="")


def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def initialize_database() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with get_db_connection() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS menu_items (
                item_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                image_url TEXT,
                price REAL NOT NULL CHECK(price >= 0),
                is_available INTEGER NOT NULL DEFAULT 1,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS orders (
                order_id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_name TEXT NOT NULL,
                customer_email TEXT NOT NULL,
                total_price REAL NOT NULL CHECK(total_price >= 0),
                status TEXT NOT NULL DEFAULT 'Pending',
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS order_items (
                order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER NOT NULL,
                item_id INTEGER,
                item_name TEXT NOT NULL,
                quantity INTEGER NOT NULL CHECK(quantity > 0),
                unit_price REAL NOT NULL CHECK(unit_price >= 0),
                notes TEXT,
                FOREIGN KEY(order_id) REFERENCES orders(order_id)
            );
            """
        )

        existing_count = conn.execute("SELECT COUNT(*) as c FROM menu_items").fetchone()["c"]
        if existing_count == 0:
            seed_data = [
                ("Pasta Pomodoro", "Fresh pasta in rich tomato sauce.", "../assets/images/pasta and red sauce.jpg", 300.0, 1),
                ("Fried Chicken", "Crispy seasoned chicken served hot.", "../assets/images/chicken.jpg", 450.0, 1),
                ("Herb Fried Rice", "Fragrant rice with herbs and vegetables.", "../assets/images/fried rice.jpg", 260.0, 1),
                ("Loaded Fries", "Golden fries with house seasoning.", "../assets/images/fries.jpg", 180.0, 1),
            ]
            now = datetime.utcnow().isoformat()
            conn.executemany(
                """
                INSERT INTO menu_items (name, description, image_url, price, is_available, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                [(name, desc, img, price, available, now) for name, desc, img, price, available in seed_data],
            )
        conn.commit()


initialize_database()


def parse_json(required_fields: list[str]) -> tuple[dict[str, Any], str | None]:
    data = request.get_json(silent=True) or {}
    for field in required_fields:
        if not data.get(field):
            return {}, f"'{field}' is required"
    return data, None


@app.get("/")
def home() -> Any:
    return send_from_directory(BASE_DIR / "pages", "index.html")


@app.get("/pages/<path:filename>")
def pages(filename: str) -> Any:
    return send_from_directory(BASE_DIR / "pages", filename)


@app.get("/api/health")
def health() -> Any:
    return jsonify({"status": "ok", "database": str(DB_PATH)})


@app.get("/api/menu")
def get_menu() -> Any:
    with get_db_connection() as conn:
        rows = conn.execute(
            "SELECT item_id, name, description, image_url, price, is_available FROM menu_items ORDER BY item_id DESC"
        ).fetchall()
    return jsonify([
        {
            "id": row["item_id"],
            "name": row["name"],
            "description": row["description"],
            "imageUrl": row["image_url"],
            "price": float(row["price"]),
            "isAvailable": bool(row["is_available"]),
        }
        for row in rows
    ])


@app.post("/api/menu")
def add_menu_item() -> Any:
    if request.headers.get("X-Admin-Token") != ADMIN_TOKEN:
        return jsonify({"message": "Unauthorized"}), 401

    data, error = parse_json(["name", "description", "price"])
    if error:
        return jsonify({"message": error}), 400

    try:
        price = float(data["price"])
        if price < 0:
            raise ValueError
    except (TypeError, ValueError):
        return jsonify({"message": "'price' must be a positive number"}), 400

    is_available = 1 if data.get("isAvailable", True) else 0
    image_url = data.get("imageUrl") or "../assets/images/fried.jpg"

    with get_db_connection() as conn:
        cur = conn.execute(
            """
            INSERT INTO menu_items (name, description, image_url, price, is_available, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (data["name"].strip(), data["description"].strip(), image_url, price, is_available, datetime.utcnow().isoformat()),
        )
        conn.commit()

    return jsonify({"message": "Menu item created", "id": cur.lastrowid}), 201


@app.post("/api/orders")
def create_order() -> Any:
    data, error = parse_json(["customerName", "customerEmail", "items"])
    if error:
        return jsonify({"message": error}), 400

    items = data.get("items", [])
    if not isinstance(items, list) or not items:
        return jsonify({"message": "'items' must be a non-empty list"}), 400

    normalized_items: list[dict[str, Any]] = []
    total = 0.0
    for item in items:
        try:
            quantity = int(item.get("quantity", 1))
            unit_price = float(item["price"])
            name = str(item["name"]).strip()
        except (KeyError, TypeError, ValueError):
            return jsonify({"message": "Invalid item payload"}), 400

        if not name or quantity <= 0 or unit_price < 0:
            return jsonify({"message": "Invalid order item values"}), 400

        subtotal = quantity * unit_price
        total += subtotal
        normalized_items.append(
            {
                "item_id": item.get("id"),
                "item_name": name,
                "quantity": quantity,
                "unit_price": unit_price,
                "notes": str(item.get("notes", "")).strip(),
            }
        )

    with get_db_connection() as conn:
        cur = conn.execute(
            """
            INSERT INTO orders (customer_name, customer_email, total_price, status, created_at)
            VALUES (?, ?, ?, 'Pending', ?)
            """,
            (data["customerName"].strip(), data["customerEmail"].strip(), round(total, 2), datetime.utcnow().isoformat()),
        )
        order_id = cur.lastrowid
        conn.executemany(
            """
            INSERT INTO order_items (order_id, item_id, item_name, quantity, unit_price, notes)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            [
                (order_id, item["item_id"], item["item_name"], item["quantity"], item["unit_price"], item["notes"])
                for item in normalized_items
            ],
        )
        conn.commit()

    return jsonify({"message": "Order created", "orderId": order_id, "total": round(total, 2)}), 201


if __name__ == "__main__":
    initialize_database()
    app.run(host="0.0.0.0", port=5000, debug=True)
