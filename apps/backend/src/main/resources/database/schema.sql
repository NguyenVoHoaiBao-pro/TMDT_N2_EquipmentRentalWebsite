-- Turn off foreign key checks to avoid issues when dropping tables with dependencies
SET
FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS product_details;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

-- Enable foreign key checks after dropping tables successfully
SET
FOREIGN_KEY_CHECKS = 1;

CREATE TABLE roles
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name  VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP          NOT NULL,
    updated_at TIMESTAMP          NOT NULL
);

CREATE TABLE users
(
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_name      VARCHAR(255) NOT NULL UNIQUE,
    password       VARCHAR(255) NOT NULL,
    full_name      VARCHAR(255),
    email          VARCHAR(255) NOT NULL UNIQUE,
    phone_number   VARCHAR(20),
    id_card_number VARCHAR(16),
    trust_score    DECIMAL(3, 2),
    enabled        BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMP    NOT NULL,
    updated_at     TIMESTAMP    NOT NULL
);

CREATE TABLE user_roles
(
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (role_id) REFERENCES roles (id)
);

CREATE TABLE categories
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at  TIMESTAMP           NOT NULL,
    updated_at  TIMESTAMP           NOT NULL
);

CREATE TABLE products
(
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id   BIGINT,
    owner_id      BIGINT,
    name          VARCHAR(255)   NOT NULL,
    description   VARCHAR(255),
    price_per_day DECIMAL(10, 2) NOT NULL,
    status        VARCHAR(50) DEFAULT 'AVAILABLE',
    FOREIGN KEY (owner_id) REFERENCES users (id),
    FOREIGN KEY (category_id) REFERENCES categories (id),
    created_at    TIMESTAMP      NOT NULL,
    updated_at    TIMESTAMP      NOT NULL
);

CREATE TABLE product_details
(
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id     BIGINT UNIQUE NOT NULL,
    brand          VARCHAR(100),
    model          VARCHAR(100),
    lens_mount     VARCHAR(50), -- For body/lens
    specifications TEXT,        -- Other specifications
    accessories    TEXT,        -- Accessories
    FOREIGN KEY (product_id) REFERENCES products (id),
    created_at     TIMESTAMP     NOT NULL,
    updated_at     TIMESTAMP     NOT NULL
);

CREATE TABLE product_images
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT       NOT NULL,
    image_url  VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (product_id) REFERENCES products (id),
    created_at TIMESTAMP    NOT NULL,
    updated_at TIMESTAMP    NOT NULL

);

CREATE TABLE orders
(
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id     BIGINT      NOT NULL,
    renter_id      BIGINT      NOT NULL,
    owner_id       BIGINT      NOT NULL,
    start_date     DATE        NOT NULL,
    end_date       DATE        NOT NULL,
    total_price    DECIMAL(10, 2),
    deposit_amount DECIMAL(10, 2),
    status         VARCHAR(50) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products (id),
    FOREIGN KEY (renter_id) REFERENCES users (id),
    FOREIGN KEY (owner_id) REFERENCES users (id),
    created_at     TIMESTAMP   NOT NULL,
    updated_at     TIMESTAMP   NOT NULL
);
