# notifications_service.py
from flask import Flask, jsonify

app = Flask(__name__)

# In-memory notifications for simplicity
notifications = {}

# Endpoint to add a notification
@app.route('/notifications', methods=['POST'])
def add_notification():
    data = request.json
    user_id = data.get("user_id")
    message = data.get("message")
    
    if user_id not in notifications:
        notifications[user_id] = []
    
    notifications[user_id].append(message)
    return jsonify({"message": "Notification added"}), 201

# Endpoint to get notifications for a user
@app.route('/notifications/<int:user_id>', methods=['GET'])
def get_notifications(user_id):
    user_notifications = notifications.get(user_id, [])
    return jsonify(user_notifications), 200

if __name__ == '__main__':
    app.run(port=5003, debug=True)
