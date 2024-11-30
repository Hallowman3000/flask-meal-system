-- Table for menu categories (e.g., appetizers, main course, dessert)
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for menu items
CREATE TABLE menu_items (
    item_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(category_id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for special item customizations (e.g., extra cheese, no onions)
CREATE TABLE item_customizations (
    customization_id SERIAL PRIMARY KEY,
    item_id INT REFERENCES menu_items(item_id),
    name VARCHAR(100) NOT NULL,
    additional_price DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
