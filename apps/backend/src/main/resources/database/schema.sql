SET
FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS product_items;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS reviews;
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
    phone_number   VARCHAR(20) NOT NULL UNIQUE,
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

-- NƠI LƯU DỮ LIỆU CÀO (Thông tin dòng máy chung)
CREATE TABLE products
(
    id                   BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id          BIGINT NOT NULL,
    brand_id             BIGINT NOT NULL,
    name                 VARCHAR(255) NOT NULL,
    slug                 VARCHAR(255) NOT NULL UNIQUE,
    description          TEXT,
    specifications       JSON, -- Chuyển sang JSON để lưu thông số kỹ thuật cào về rất tiện (ví dụ: khẩu độ, tiêu cự, loại ngàm)
    accessories_included TEXT, -- Các phụ kiện mặc định đi kèm (pin, sạc, dây đeo)
    created_at           TIMESTAMP    NOT NULL,
    updated_at           TIMESTAMP    NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories (id),
    FOREIGN KEY (brand_id) REFERENCES brands (id)
);

-- NƠI LƯU THIẾT BỊ CỦA NGƯỜI DÙNG ĐĂNG LÊN HOẶC KHO CỦA CỬA HÀNG
CREATE TABLE product_items
(
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id        BIGINT         NOT NULL,
    owner_id          BIGINT         NOT NULL,
    serial_number     VARCHAR(100),               -- Số seri để quản lý máy thực tế
    condition_percent INT            DEFAULT 100, -- Độ mới của máy (ví dụ: 95%, 99%)
    price_per_day     DECIMAL(10, 2) NOT NULL,
    deposit_value     DECIMAL(10, 2) DEFAULT 0.00,
    status            ENUM('AVAILABLE', 'RENTED', 'MAINTENANCE', 'DAMAGED') DEFAULT 'AVAILABLE',
    created_at        TIMESTAMP      NOT NULL,
    updated_at        TIMESTAMP      NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products (id),
    FOREIGN KEY (owner_id) REFERENCES users (id)
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

CREATE TABLE orders
(
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_item_id BIGINT         NOT NULL, -- Thuê chính xác sản phẩm nào trong kho
    renter_id       BIGINT         NOT NULL,
    start_date      DATE           NOT NULL,
    end_date        DATE           NOT NULL,
    total_price     DECIMAL(10, 2) NOT NULL,
    deposit_amount  DECIMAL(10, 2) DEFAULT 0.00,
    status          ENUM('PENDING', 'CONFIRMED', 'PICKED_UP', 'RETURNED', 'CANCELLED', 'OVERDUE') NOT NULL,
    created_at      TIMESTAMP      NOT NULL,
    updated_at      TIMESTAMP      NOT NULL,
    FOREIGN KEY (product_item_id) REFERENCES product_items (id),
    FOREIGN KEY (renter_id) REFERENCES users (id)
);

CREATE TABLE payments
(
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id       BIGINT         NOT NULL,
    amount         DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('VNPAY', 'MOMO', 'BANK_TRANSFER', 'CASH') NOT NULL,
    status         ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    transaction_id VARCHAR(100),
    created_at     TIMESTAMP      NOT NULL,
    updated_at     TIMESTAMP      NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (id)
);

CREATE TABLE reviews
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id   BIGINT    NOT NULL,
    author_id  BIGINT    NOT NULL,
    rating     INT       NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment    TEXT,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (author_id) REFERENCES users (id)
);
