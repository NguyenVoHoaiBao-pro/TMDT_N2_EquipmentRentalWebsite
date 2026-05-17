-- Turn off foreign key checks to avoid issues when dropping tables with dependencies
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

-- Enable foreign key checks after dropping tables successfully
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE roles
(
    id        INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE users
(
    id             INT AUTO_INCREMENT PRIMARY KEY,
    user_name      VARCHAR(255) NOT NULL UNIQUE,
    password       VARCHAR(255) NOT NULL,
    full_name      VARCHAR(255),
    email          VARCHAR(255) NOT NULL UNIQUE,
    phone_number   VARCHAR(20),
    id_card_number VARCHAR(16),
    trust_score    DECIMAL(3, 2),
    enabled        BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE TABLE user_roles
(
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (role_id) REFERENCES roles (id)
);

CREATE TABLE products
(
    id            INT AUTO_INCREMENT PRIMARY KEY,
    owner_id      INT,
    name          VARCHAR(255)   NOT NULL,
    description   VARCHAR(255),
    price_per_day DECIMAL(10, 2) NOT NULL,
    status        VARCHAR(50) DEFAULT 'AVAILABLE',
    image_url     VARCHAR(255),
    FOREIGN KEY (owner_id) REFERENCES users (id)
);

CREATE TABLE orders
(
    id             INT AUTO_INCREMENT PRIMARY KEY,
    product_id     INT,
    renter_id      INT,
    owner_id       INT,
    start_date     DATE        NOT NULL,
    end_date       DATE        NOT NULL,
    total_price    DECIMAL(10, 2),
    deposit_amount DECIMAL(10, 2),
    status         VARCHAR(50) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products (id),
    FOREIGN KEY (renter_id) REFERENCES users (id),
    FOREIGN KEY (owner_id) REFERENCES users (id)
);
