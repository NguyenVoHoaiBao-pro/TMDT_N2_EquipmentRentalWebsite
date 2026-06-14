SET
FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS device_images;
DROP TABLE IF EXISTS device_calendars;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
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
    full_name      VARCHAR(255) NOT NULL,
    email          VARCHAR(255) NOT NULL UNIQUE,
    phone_number   VARCHAR(20)  NOT NULL UNIQUE,
    id_card_number VARCHAR(16),
    trust_score    DECIMAL(3, 2)         DEFAULT 5.00,
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

CREATE TABLE brands
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) UNIQUE NOT NULL,
    slug       VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP           NOT NULL,
    updated_at TIMESTAMP           NOT NULL
);

CREATE TABLE categories
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) UNIQUE NOT NULL,
    slug        VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at  TIMESTAMP           NOT NULL,
    updated_at  TIMESTAMP           NOT NULL
);

CREATE TABLE products
(
    id                   BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id          BIGINT         NOT NULL,
    brand_id             BIGINT         NOT NULL,
    name                 VARCHAR(255)   NOT NULL,
    slug                 VARCHAR(255)   NOT NULL UNIQUE,
    description          TEXT,
    base_price           DECIMAL(15, 2) NOT NULL,
    specifications       JSON,
    accessories_included TEXT,
    INDEX                idx_base_price (base_price),
    created_at           TIMESTAMP      NOT NULL,
    updated_at           TIMESTAMP      NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories (id),
    FOREIGN KEY (brand_id) REFERENCES brands (id)
);

CREATE TABLE devices
(
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id        BIGINT         NOT NULL,
    owner_id          BIGINT         NOT NULL,
    serial_number     VARCHAR(100)   NOT NULL,
    condition_percent INT            NOT NULL DEFAULT 100,
    price_per_day     DECIMAL(15, 2) NOT NULL,
    deposit_value     DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    -- P2P: Cần trạng thái kiểm duyệt bài đăng của chủ máy
    status            ENUM('PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'HIDDEN') DEFAULT 'PENDING_APPROVAL',
    created_at        TIMESTAMP      NOT NULL,
    updated_at        TIMESTAMP      NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products (id),
    FOREIGN KEY (owner_id) REFERENCES users (id),
    INDEX             idx_serial_number (serial_number)
);

CREATE TABLE product_images
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT       NOT NULL,
    image_url  VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP    NOT NULL,
    updated_at TIMESTAMP    NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE device_images
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    device_id  BIGINT       NOT NULL,
    image_url  VARCHAR(255) NOT NULL,
    image_type ENUM('REAL_SHOT', 'SERIAL_PROOF') DEFAULT 'REAL_SHOT',
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP    NOT NULL,
    updated_at TIMESTAMP    NOT NULL,
    FOREIGN KEY (device_id) REFERENCES devices (id)
);

CREATE TABLE device_calendars
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    device_id  BIGINT    NOT NULL,
    event_date DATE      NOT NULL,                        -- Lưu chính xác từng ngày bận
    status     ENUM('BOOKED', 'OWNER_BLOCK', 'MAINTENANCE') NOT NULL,
    order_id   BIGINT NULL,                               -- Null nếu do chủ máy tự khóa (OWNER_BLOCK)
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (device_id) REFERENCES devices (id),
    UNIQUE KEY uq_item_date (device_id, event_date) -- Khóa chặn không cho trùng ngày
);

CREATE TABLE orders
(
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    device_id      BIGINT         NOT NULL,
    renter_id      BIGINT         NOT NULL,
    start_date     DATE           NOT NULL,
    end_date       DATE           NOT NULL,
    total_price    DECIMAL(15, 2) NOT NULL,
    deposit_amount DECIMAL(15, 2) DEFAULT 0.00,
    status         ENUM('PENDING', 'CONFIRMED', 'PICKED_UP', 'RETURNED', 'CANCELLED', 'OVERDUE') NOT NULL,
    created_at     TIMESTAMP      NOT NULL,
    updated_at     TIMESTAMP      NOT NULL,
    FOREIGN KEY (device_id) REFERENCES devices (id),
    FOREIGN KEY (renter_id) REFERENCES users (id)
);

CREATE TABLE payments
(
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id       BIGINT         NOT NULL,
    amount         DECIMAL(15, 2) NOT NULL,
    payment_method ENUM('VNPAY', 'MOMO', 'BANK_TRANSFER', 'CASH') NOT NULL,
    status         ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    transaction_id VARCHAR(100),
    created_at     TIMESTAMP      NOT NULL,
    updated_at     TIMESTAMP      NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (id)
);

-- CẬP NHẬT: Review 2 chiều cho cả máy và người thuê
CREATE TABLE reviews
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id    BIGINT    NOT NULL,
    author_id   BIGINT    NOT NULL, -- Người viết đánh giá
    target_id   BIGINT    NOT NULL, -- Người/thiết bị được đánh giá (Có thể là ID của User hoặc ID của Product_Item)
    review_type ENUM('RENTER_TO_ITEM', 'OWNER_TO_RENTER') NOT NULL,
    rating      INT       NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment     TEXT,
    created_at  TIMESTAMP NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (author_id) REFERENCES users (id)
);
