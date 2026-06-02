import requests
from bs4 import BeautifulSoup
from datetime import datetime, timezone
import mysql.connector
import re
import json
import random
import time
from typing import List

# -------------------------------------------------------------------------
# 1. CẤU HÌNH HỆ THỐNG AN TOÀN
# -------------------------------------------------------------------------
CONFIG = {
    'delay_min': 2,  # Giảm một chút để cào mượt hơn nhưng vẫn an toàn
    'delay_max': 5,
    'timeout': 10,
    'max_retries': 3,
}

FREE_PROXIES = [
    'http://103.152.112.162:8080',
    'http://45.77.55.173:8080',
    'http://185.162.230.55:8080',
]

# -------------------------------------------------------------------------
# 2. KẾT NỐI DATABASE (ĐỒNG BỘ SPRING BOOT)
# -------------------------------------------------------------------------
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Quietness149131!",
    database="equipment_rental_db",
    charset="utf8mb4",
)
cursor = db.cursor()


# -------------------------------------------------------------------------
# 3. CÁC HÀM TIỆN ÍCH & TRỢ GIÚP
# -------------------------------------------------------------------------
def get_current_utc_time():
    return datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')


def random_delay():
    time.sleep(random.uniform(CONFIG['delay_min'], CONFIG['delay_max']))


def slugify(text):
    text = text.lower()
    text = re.sub(r'[áàảãạăắằẳẵặâấầẩẫậ]', 'a', text)
    text = re.sub(r'[éèẻẽẹêếềểễệ]', 'e', text)
    text = re.sub(r'[íìỉĩị]', 'i', text)
    text = re.sub(r'[óòỏõọôốồổỗộơớờởỡợ]', 'o', text)
    text = re.sub(r'[úùủũụưứừửữự]', 'u', text)
    text = re.sub(r'[ýỳỷỹỵ]', 'y', text)
    text = re.sub(r'đ', 'd', text)
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text).strip('-')
    return text


def clean_price(price_text):
    digits = re.sub(r'[^\d]', '', price_text)
    return float(digits) if digits else 0.0


def generate_unique_slug(slug):
    final_slug = slug
    counter = 1
    while True:
        cursor.execute("SELECT id FROM products WHERE slug = %s", (final_slug,))
        if not cursor.fetchone():
            break
        counter += 1
        final_slug = f"{slug}-{counter}"
    return final_slug


def get_owner_id():
    cursor.execute("""
                   SELECT u.id
                   FROM users u
                            INNER JOIN user_roles ur ON u.id = ur.user_id
                            INNER JOIN roles r ON ur.role_id = r.id
                   WHERE r.role_name = 'OWNER' LIMIT 1
                   """)
    result = cursor.fetchone()
    return result[0] if result else 1


def get_category_id(category_key):
    category_map = {
        'body': 'Máy ảnh Body',
        'lens_sony': 'Ống kính Sony',
        'lens_canon': 'Ống kính Canon',
        'flash': 'Đèn Flash',
        'accessory': 'Phụ kiện'
    }
    target_name = category_map.get(category_key, 'Phụ kiện')
    cursor.execute("SELECT id FROM categories WHERE name = %s", (target_name,))
    result = cursor.fetchone()

    if result:
        return result[0]

    cursor.execute("SELECT id FROM categories LIMIT 1")
    fallback = cursor.fetchone()
    return fallback[0] if fallback else 1


def calculate_deposit(price_per_day, category_key):
    multipliers = {'body': 50, 'lens_sony': 35, 'lens_canon': 35, 'flash': 20}
    return price_per_day * multipliers.get(category_key, 15)


# -------------------------------------------------------------------------
# 4. ENGINE TẢI HTML (PROXY ROTATION)
# -------------------------------------------------------------------------
def fetch_html(url, max_retries=3):
    """Đổi tên hàm giữ nguyên cấu trúc cũ nhưng chạy trực tiếp không qua proxy lỗi"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    for attempt in range(max_retries):
        try:
            # Gửi request trực tiếp
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code == 200:
                return response.text
            print(f"⚠ Status {response.status_code}: {url}")
        except Exception as e:
            print(f"⚠ Lỗi kết nối lần {attempt + 1}: {e}")
            time.sleep(2)
    return None


# -------------------------------------------------------------------------
# 5. CÁC BỘ PHÂN TÍCH CÚ PHÁP (PARSERS)
# -------------------------------------------------------------------------
def parse_thiet_bi_gao(soup, url):
    try:
        product_name = soup.find('h1', class_='product_title').text.strip()
        price_elem = soup.select_one('.price .amount') or soup.select_one('.rental-price .amount')
        price_text = price_elem.text if price_elem else "0"

        desc_elem = soup.find('div', class_='woocommerce-product-details__short-description')
        description = desc_elem.text.strip() if desc_elem else ""

        attributes = {}
        spec_table = soup.find('table', class_='woocommerce-product-attributes')
        if spec_table:
            for row in spec_table.find_all('tr'):
                label, value = row.find('th'), row.find('td')
                if label and value:
                    key = slugify(label.text.strip()).replace('-', '_')
                    attributes[key] = value.text.strip()

        brand = "Unknown"
        for b in ['Sony', 'Canon', 'Nikon', 'Fujifilm', 'Godox', 'DJI']:
            if b.lower() in product_name.lower(): brand = b; break

        images = []
        gallery = soup.find('div', class_='woocommerce-product-gallery')
        if gallery:
            for idx, img in enumerate(gallery.find_all('img')):
                img_url = img.get('src') or img.get('data-src')
                if img_url and img_url not in [i['url'] for i in images]:
                    images.append({'url': img_url, 'is_primary': (idx == 0)})

        return {
            'name': product_name, 'price_raw': price_text, 'description': description,
            'brand': brand, 'model': product_name.replace(brand, "").strip(),
            'attributes': attributes, 'specifications': "", 'accessories': "Bộ thiết bị chuẩn kèm túi đựng",
            'images': images
        }
    except Exception as e:
        print(f"❌ Lỗi cấu trúc Thiết Bị Gáo tại {url}: {e}")
        return None


def parse_zshop_table_row(row_soup):
    try:
        columns = row_soup.find_all('td')
        if len(columns) < 2: return None
        product_name = columns[0].text.strip()
        if not product_name or any(w in product_name for w in ["Thiết bị", "Sản phẩm", "Bảng giá"]): return None

        price_text = columns[1].text.strip()
        brand = "Unknown"
        for b in ['Sony', 'Canon', 'Nikon', 'Fujifilm']:
            if b.lower() in product_name.lower(): brand = b; break

        return {
            'name': product_name, 'price_raw': price_text, 'description': f"Dịch vụ thuê {product_name} tại zShop.",
            'brand': brand, 'model': product_name.replace(brand, "").strip(),
            'attributes': {"source": "zshop_table"}, 'specifications': "", 'accessories': "Cáp đậy, pin sạc cơ bản",
            'images': [{'url': 'https://zshop.vn/images/logos/23/logo-zshop-2009-218x66.png', 'is_primary': True}]
        }
    except Exception as e:
        print(f"❌ Lỗi dòng hàng zShop: {e}")
        return None


# -------------------------------------------------------------------------
# 6. PIPELINE LƯU TRỮ HỢP NHẤT
# -------------------------------------------------------------------------
def save_to_database(parsed_data, category_key):
    if not parsed_data: return False
    current_time_utc = get_current_utc_time()
    category_id = get_category_id(category_key)
    owner_id = get_owner_id()

    price_per_day = clean_price(parsed_data['price_raw'])
    if price_per_day == 0: return False

    unique_slug = generate_unique_slug(slugify(parsed_data['name']))
    deposit_value = calculate_deposit(price_per_day, category_key)

    try:
        cursor.execute("""
                       INSERT INTO products (category_id, owner_id, name, slug, description, price_per_day,
                                             deposit_value, status, created_at, updated_at)
                       VALUES (%s, %s, %s, %s, %s, %s, %s, 'AVAILABLE', %s, %s)
                       """, (category_id, owner_id, parsed_data['name'], unique_slug, parsed_data['description'][:1000],
                             price_per_day, deposit_value, current_time_utc, current_time_utc))

        product_id = cursor.lastrowid

        # Lưu JSON trực tiếp khớp với trường Map bên Java
        attributes_json = json.dumps(parsed_data['attributes'], ensure_ascii=False)
        cursor.execute("""
                       INSERT INTO product_details (product_id, brand, model, attributes, specifications, accessories,
                                                    created_at, updated_at)
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                       """, (product_id, parsed_data['brand'], parsed_data['model'], attributes_json,
                             parsed_data['specifications'], parsed_data['accessories'], current_time_utc,
                             current_time_utc))

        for img in parsed_data['images']:
            cursor.execute("""
                           INSERT INTO product_images (product_id, image_url, is_primary, created_at, updated_at)
                           VALUES (%s, %s, %s, %s, %s)
                           """, (product_id, img['url'], img['is_primary'], current_time_utc, current_time_utc))

        db.commit()
        print(f"✅ Đã lưu: {parsed_data['name']} (ID: {product_id})")
        return True
    except Exception as e:
        print(f"❌ Lỗi ghi DB: {e}")
        db.rollback()
        return False


# -------------------------------------------------------------------------
# 7. ĐIỀU TỐC VẬN HÀNH PIPELINE
# -------------------------------------------------------------------------
if __name__ == "__main__":
    print("🚀 PIPELINE KHỞI ĐỘNG...")

    # Kịch bản 1: Cào thử một trang cụ thể của Thiết Bị Gáo
    gao_url = "https://www.thietbigao.com/san-pham/chi-tiet-san-pham/sony-fx3-full-frame-cinema-camera.html"
    html_gao = fetch_html(gao_url)
    if html_gao:
        data = parse_thiet_bi_gao(BeautifulSoup(html_gao, 'html.parser'), gao_url)
        save_to_database(data, category_key='lens_sony')

    random_delay()

    # Kịch bản 2: Cào thử một bảng giá giả định từ zShop
    # Trong thực tế bạn sẽ lấy soup của toàn bộ trang bài viết và tìm thẻ tr
    sample_tr_html = "<tr><td>Sony Alpha A7 Mark IV</td><td>500.000 đ</td></tr>"
    row_data = parse_zshop_table_row(BeautifulSoup(sample_tr_html, 'html.parser'))
    save_to_database(row_data, category_key='body')

    cursor.close()
    db.close()
