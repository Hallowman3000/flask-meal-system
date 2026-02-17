# menu_service.py
from flask import Flask, request, jsonify
import psycopg2

app = Flask(__name__)

# Database connection function
def get_db_connection():
    return psycopg2.connect(
        dbname="meal_ordering_system",
        user="your_db_user",
        password="your_db_password",
        host="localhost"
    )

# Route to retrieve all menu items
@app.route('/menu', methods=['GET'])
def get_menu():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT item_id, name, description, price FROM menu")
        menu_items = cur.fetchall()
        cur.close()
        conn.close()
        
        # Return JSON for the client to render in HTML
        return jsonify([{"id": item[0], "name": item[1], "description": item[2], "price": item[3]} for item in menu_items]), 200
    except Exception as e:
        print(e)
        return jsonify({"message": "Error retrieving menu items"}), 500

# Route to add a new menu item
@app.route('/menu', methods=['POST'])
def add_menu_item():
    data = request.json
    name = data.get("name")
    description = data.get("description")
    price = data.get("price")
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("INSERT INTO menu (name, description, price) VALUES (%s, %s, %s) RETURNING item_id",
                    (name, description, price))
        conn.commit()
        item_id = cur.fetchone()[0]
        cur.close()
        conn.close()
        
        return jsonify({"message": "Menu item added", "itemId": item_id}), 201
    except Exception as e:
        print(e)
        return jsonify({"message": "Error adding menu item"}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
