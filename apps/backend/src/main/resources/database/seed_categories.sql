-- database/seed_categories.sql
INSERT INTO categories (name, description, created_at, updated_at)
VALUES ('Máy ảnh Body', 'Máy ảnh không kèm ống kính', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Ống kính Sony', 'Lens ngàm Sony E-mount', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Ống kính Canon', 'Lens ngàm Canon RF/EF', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Ống kính Nikon', 'Lens ngàm Nikon Z', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Đèn Flash', 'Speedlight, Studio flash', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Phụ kiện', 'Tripod, túi đựng, thẻ nhớ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
