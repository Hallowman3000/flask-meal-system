-- Table for user notification preferences
CREATE TABLE notification_preferences (
    preference_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    receive_email BOOLEAN DEFAULT TRUE,
    receive_sms BOOLEAN DEFAULT TRUE,
    receive_push BOOLEAN DEFAULT TRUE
);

-- Table for notifications
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    order_id INT REFERENCES orders(order_id), -- optional, for order-specific notifications
    type VARCHAR(50) NOT NULL, -- e.g., Order Update, Promotion
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for failed notifications (e.g., if email/SMS fails to send)
CREATE TABLE notification_failures (
    failure_id SERIAL PRIMARY KEY,
    notification_id INT REFERENCES notifications(notification_id),
    failure_reason TEXT,
    retry_count INT DEFAULT 0,
    last_attempt TIMESTAMP
);
