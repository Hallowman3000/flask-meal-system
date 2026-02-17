from flask import Flask, jsonify, request
import psycopg2

app = Flask(__name__)


def get_db_connection():
    return psycopg2.connect(
        dbname="meal_ordering_system",
        user="your_db_user",
        password="your_db_password",
        host="localhost"
    )


@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    return response


@app.route('/menu', methods=['GET'])
def get_menu():
    query = request.args.get('q', '').strip().lower()

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT item_id, name, description, price FROM menu ORDER BY name ASC')
        menu_items = cur.fetchall()
        cur.close()
        conn.close()

        results = [
            {
                'id': item[0],
                'name': item[1],
                'description': item[2],
                'price': float(item[3])
            }
            for item in menu_items
        ]

        if query:
            results = [
                item for item in results
                if query in item['name'].lower() or query in item['description'].lower()
            ]

        return jsonify(results), 200
    except Exception as error:
        print(error)
        return jsonify({'message': 'Error retrieving menu items'}), 500


@app.route('/menu', methods=['POST'])
def add_menu_item():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    description = data.get('description', '').strip()
    price = data.get('price')

    if not name or not description or price is None:
        return jsonify({'message': 'name, description, and price are required'}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            'INSERT INTO menu (name, description, price) VALUES (%s, %s, %s) RETURNING item_id',
            (name, description, price)
        )
        conn.commit()
        item_id = cur.fetchone()[0]
        cur.close()
        conn.close()

        return jsonify({'message': 'Menu item added', 'itemId': item_id}), 201
    except Exception as error:
        print(error)
        return jsonify({'message': 'Error adding menu item'}), 500


@app.route('/highlights', methods=['GET'])
def get_highlights():
    highlights = [
        {
            'kitchen': 'Sironi Restaurant',
            'dish': 'Classic Biryani Rice',
            'description': 'Aromatic basmati rice with warm spices and slow-cooked flavor.',
            'image': 'Screenshot (16).png'
        },
        {
            'kitchen': "Paul's Café",
            'dish': 'Freshly Baked Croissants',
            'description': 'Buttery, flaky pastries baked daily and served warm.',
            'image': 'Screenshot (20).png'
        },
        {
            'kitchen': 'Sironi Restaurant',
            'dish': 'Homemade Red Sauce Pasta',
            'description': 'Comfort pasta with rich tomato sauce and garden herbs.',
            'image': 'Screenshot (18).png'
        }
    ]
    return jsonify(highlights), 200


if __name__ == '__main__':
    app.run(port=5001, debug=True)
