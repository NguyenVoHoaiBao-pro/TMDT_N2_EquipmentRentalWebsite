import json
import re
import pandas as pd

# 1. Đọc file dữ liệu cào từ Web Scraper
# Giả định file có tên là 'scraped_cameras.csv'
try:
    df = pd.read_csv("scraped_cameras.csv")
except FileNotFoundError:
    # Tạo dataframe giả lập cấu trúc để code không bị lỗi nếu chạy test
    df = pd.DataFrame(
        [
            {
                "name": "Sony Alpha a7 IV",
                "description": "Excellent hybrid camera...",
                "accessories_included": "Battery, Charger, Strap",
                "Ten_Thong_So": "Sensor Size;Lens Mount",
                "Gia_Tri": "Full-Frame;Sony E",
                "image": "https://cdn.com",
                "product_images": "https://cdn.com",
                "price": "$60 for 3 days",
            }
        ]
    )


# Hàm tạo slug
def make_slug(text):
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    return text


# Bộ từ điển map tên hãng để lấy brand_id
brand_map = {"sony": 1, "canon": 2, "nikon": 3, "fujifilm": 4, "panasonic": 5}
category_id = 1  # Mặc định 1 là danh mục Máy ảnh (Cameras)
owner_id = 1  # Mặc định gán cho tài khoản hệ thống/admin ban đầu

sql_statements = []
sql_statements.append("SET FOREIGN_KEY_CHECKS = 0;\n")

# Thống kê ID tự tăng cho bảng products và product_items
prod_id = 1
item_id = 1
img_id = 1

for index, row in df.iterrows():
    name = str(row["name"]).strip()
    slug = make_slug(name)
    description = str(row["description"]).replace("'", "''")
    accessories = str(row["accessories_included"]).replace("'", "''")

    # Bóc tách tên Hãng sản xuất từ từ đầu tiên của tên máy
    first_word = name.split(" ")[0].lower()
    brand_id = brand_map.get(first_word, 6)  # 6 là ID 'Khác' nếu không khớp

    # Xử lý thông số kỹ thuật (Gom Ten_Thong_So và Gia_Tri thành JSON)
    specs_dict = {}
    if pd.notna(row["Ten_Thong_So"]) and pd.notna(row["Gia_Tri"]):
        keys = str(row["Ten_Thong_So"]).split(";")
        vals = str(row["Gia_Tri"]).split(";")
        for k, v in zip(keys, vals):
            if k.strip():
                specs_dict[k.strip()] = v.strip()
    specs_json = json.dumps(specs_dict, ensure_ascii=False).replace("'", "''")

    # Xử lý giá tiền (Quy đổi sơ bộ từ chuỗi '$60 for 3 days' sang tiền VNĐ/Ngày)
    price_str = str(row["price"])
    price_numbers = re.findall(r"\d+", price_str)
    price_per_day_vnd = 400000.00  # Giá mặc định nếu không parse được
    deposit_value_vnd = 15000000.00

    if len(price_numbers) >= 2:
        usd_amount = float(price_numbers[0])
        days = float(price_numbers[1])
        # Tính giá 1 ngày hệ USD * tỷ giá 25,000 VNĐ
        price_per_day_vnd = round((usd_amount / days) * 25000, -3)
        # Ước lượng giá trị máy để làm tiền cọc (giá thuê 3 ngày chiếm tầm 1.5% giá trị máy)
        deposit_value_vnd = round(usd_amount * 60 * 25000, -4)

    # --- TẠO CÂU LỆNH SQL ---

    # 1. Chèn vào bảng products
    sql_products = f"INSERT INTO products (id, category_id, brand_id, name, slug, description, specifications, accessories_included, created_at, updated_at) VALUES ({prod_id}, {category_id}, {brand_id}, '{name}', '{slug}', '{description}', '{specs_json}', '{accessories}', NOW(), NOW());"
    sql_statements.append(sql_products)

    # 2. Chèn vào bảng product_items (Bơm một thiết bị mẫu vào kho cho thuê P2P)
    serial_mock = f"SN-{first_word.upper()}-{100000 + prod_id}"
    sql_items = f"INSERT INTO product_items (id, product_id, owner_id, serial_number, condition_percent, price_per_day, deposit_value, status, created_at, updated_at) VALUES ({item_id}, {prod_id}, {owner_id}, '{serial_mock}', 98, {price_per_day_vnd}, {deposit_value_vnd}, 'AVAILABLE', NOW(), NOW());"
    sql_statements.append(sql_items)

    # 3. Chèn ảnh chính (Primary Image)
    if pd.notna(row["image"]):
        sql_img_primary = f"INSERT INTO product_images (id, product_id, image_url, is_primary, created_at, updated_at) VALUES ({img_id}, {prod_id}, '{row['image']}', TRUE, NOW(), NOW());"
        sql_statements.append(sql_img_primary)
        img_id += 1

    # 4. Chèn loạt ảnh phụ từ chi tiết sản phẩm
    if pd.notna(row["product_images"]):
        sub_images = str(row["product_images"]).split(";")
        for img_url in sub_images:
            if img_url.strip() and img_url.strip() != str(row["image"]):
                sql_img_sub = f"INSERT INTO product_images (id, product_id, image_url, is_primary, created_at, updated_at) VALUES ({img_id}, {prod_id}, '{img_url.strip()}', FALSE, NOW(), NOW());"
                sql_statements.append(sql_img_sub)
                img_id += 1

    prod_id += 1
    item_id += 1

sql_statements.append("\nSET FOREIGN_KEY_CHECKS = 1;")

# Ghi ra file SQL hoàn chỉnh
with open("import_cameras.sql", "w", encoding="utf-8") as f:
    f.write("\n".join(sql_statements))

print("Đã xử lý xong! File 'import_cameras.sql' đã sẵn sàng để import.")
