# order_service.py
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

# Route to place a new order
@app.route('/order', methods=['POST'])
def place_order():
    data = request.json
    user_id = data.get("user_id")
    item_ids = data.get("item_ids")
    total_price = data.get("total_price")
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("INSERT INTO orders (user_id, item_ids, total_price) VALUES (%s, %s, %s) RETURNING order_id",
                    (user_id, item_ids, total_price))
        conn.commit()
        order_id = cur.fetchone()[0]
        cur.close()
        conn.close()
        
        return jsonify({"message": "Order placed", "orderId": order_id}), 201
    except Exception as e:
        print(e)
        return jsonify({"message": "Error placing order"}), 500

# Route to get all orders for a user
@app.route('/orders/<int:user_id>', methods=['GET'])
def get_orders(user_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT order_id, item_ids, total_price, status FROM orders WHERE user_id = %s", (user_id,))
        orders = cur.fetchall()
        cur.close()
        conn.close()
        
        return jsonify([{"order_id": order[0], "item_ids": order[1], "total_price": order[2], "status": order[3]} for order in orders]), 200
    except Exception as e:
        print(e)
        return jsonify({"message": "Error retrieving orders"}), 500

if __name__ == '__main__':
    app.run(port=5003, debug=True)
