-- Table for storing order information
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    status VARCHAR(50) DEFAULT 'Pending', -- e.g., Pending, Preparing, Delivered
    total_price DECIMAL(10, 2) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_date TIMESTAMP,
    is_delivery BOOLEAN DEFAULT FALSE,
    delivery_address_id INT REFERENCES user_addresses(address_id)
);

-- Table for storing items within an order
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id),
    item_id INT REFERENCES menu_items(item_id),
    quantity INT NOT NULL,
    item_price DECIMAL(10, 2) NOT NULL, -- price at time of order
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for storing order item customizations
CREATE TABLE order_item_customizations (
    order_item_customization_id SERIAL PRIMARY KEY,
    order_item_id INT REFERENCES order_items(order_item_id),
    customization_id INT REFERENCES item_customizations(customization_id),
    additional_price DECIMAL(10, 2) NOT NULL
);

-- Table for tracking order status updates
CREATE TABLE order_status_updates (
    status_update_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id),
    status VARCHAR(50) NOT NULL, -- e.g., Preparing, Out for Delivery, Completed
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
