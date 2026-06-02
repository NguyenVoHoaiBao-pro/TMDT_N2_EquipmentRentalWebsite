import random
import string
from datetime import datetime
from pathlib import Path
from tqdm import tqdm

# Predefined lists of Vietnamese first names and last names
FIRST_NAMES_MALE = [
    "Minh", "Anh", "Hua", "Van", "Hung", "Dung", "Tung", "Khanh", "Dang", "Hoang",
    "Tuan", "Thanh", "Phuc", "Long", "Binh", "Nam", "Khoi", "Khang", "Duc", "Nghia"
]

FIRST_NAMES_FEMALE = [
    "Trang", "Linh", "Chi", "Anh", "Huong", "Ngoc", "Yen", "Phuong", "Lan", "Hoa",
    "Thao", "Nhung", "Ha", "Van", "Kieu", "Mai", "Thu", "Tam", "Nhan", "Dieu"
]

LAST_NAMES = [
    "Nguyen", "Tran", "Le", "Pham", "Hoang", "Vu", "Do", "Ho", "Ngoc",
    "Luong", "Ky", "Dang", "Bui", "Doan", "Luu", "Trinh"
]

# Bộ dữ liệu địa chính phân cấp chuẩn Việt Nam để tránh rác dữ liệu
VIETNAM_ADDRESSES = [
    {
        "province": "Thanh pho Ho Chi Minh",
        "districts": [
            {
                "district": "Quan 1",
                "wards": ["Phuong Ben Nghe", "Phuong Ben Thanh", "Phuong Nguyen Cu Trinh", "Phuong Da Kao"]
            },
            {
                "district": "Quan Binh Thanh",
                "wards": ["Phuong 15", "Phuong 25", "Phuong Tăng Bat Ho", "Phuong Hiep Binh Chanh"]
            },
            {
                "district": "Quan 7",
                "wards": ["Phuong Tan Phong", "Phuong Tan Quy", "Phuong Phu My"]
            }
        ]
    },
    {
        "province": "Thanh pho Ha Noi",
        "districts": [
            {
                "district": "Quan Hoan Kiem",
                "wards": ["Phuong Hang Bac", "Phuong Hang Trong", "Phuong Trang Tien"]
            },
            {
                "district": "Quan Cau Giay",
                "wards": ["Phuong Dich Vong", "Phuong Mai Dich", "Phuong Trung Hoa"]
            },
            {
                "district": "Quan Dong Da",
                "wards": ["Phuong Lang Ha", "Phuong Quang Trung", "Phuong O Cho Dua"]
            }
        ]
    },
    {
        "province": "Thanh pho Da Nang",
        "districts": [
            {
                "district": "Quan Hai Chau",
                "wards": ["Phuong Thach Thang", "Phuong Hoa Thuan Dong", "Phuong Phuoc Ninh"]
            },
            {
                "district": "Quan Son Tra",
                "wards": ["Phuong An Hai Bac", "Phuong Phuoc My", "Phuong Tho Quang"]
            }
        ]
    }
]

STREETS = ["Duong Nguyen Hue", "Duong Le Loi", "Duong Tran Hung Dao", "Duong CMT8", "Duong Nguyen Trai",
           "Duong Le Duan", "Duong Hoang Dieu"]


def generate_random_email(first_name, last_name, index):
    domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"]
    domain = random.choice(domains)
    return f"{first_name.lower()}.{last_name.lower()}{index}@{domain}"


def generate_random_phone():
    prefixes = ["090", "091", "093", "094", "096", "097", "098", "099", "032", "033", "034", "035", "038", "039"]
    return random.choice(prefixes) + ''.join(random.choices(string.digits, k=7))


def generate_id_card():
    return ''.join(random.choices(string.digits, k=12))


def hash_password(password):
    import bcrypt
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def assign_roles(user_index):
    roles = []
    if user_index <= 5:
        roles.append("ADMIN")
    elif user_index <= 155:
        roles.append("OWNER")
        if random.random() < 0.3:
            roles.append("RENTER")
    else:
        roles.append("RENTER")
    return roles


def generate_random_address_data(user_id):
    # Chọn ngẫu nhiên Tỉnh -> chọn Huyện thuộc Tỉnh đó -> chọn Xã thuộc Huyện đó
    geo_province = random.choice(VIETNAM_ADDRESSES)
    geo_district = random.choice(geo_province["districts"])
    geo_ward = random.choice(geo_district["wards"])

    street_num = random.randint(1, 450)
    street_name = random.choice(STREETS)
    street_address = f"So {street_num}, {street_name}"

    return {
        "user_id": user_id,
        "province": geo_province["province"],
        "district": geo_district["district"],
        "ward": geo_ward,
        "street_address": street_address,
        "is_default": "TRUE"  # Địa chỉ đầu tiên mặc định là TRUE
    }


def generate_users(num_users=1000):
    users = []
    user_roles = []
    user_addresses = []

    for i in tqdm(range(1, num_users + 1), desc="Generating data", unit="user"):
        is_male = random.choice([True, False])
        first_name = random.choice(FIRST_NAMES_MALE) if is_male else random.choice(FIRST_NAMES_FEMALE)
        last_name = random.choice(LAST_NAMES)
        full_name = f"{last_name} {first_name}"

        username = f"{first_name.lower()}_{last_name.lower()}{i}"
        email = generate_random_email(first_name, last_name, i)
        phone = generate_random_phone()
        id_card = generate_id_card()
        password_hashed = hash_password("Password@123")
        trust_score = round(random.uniform(3.00, 5.00), 2)
        enabled = i <= 950

        roles = assign_roles(i)

        users.append({
            'username': username,
            'full_name': full_name,
            'email': email,
            'phone': phone,
            'id_card': id_card,
            'password': password_hashed,
            'trust_score': trust_score,
            'enabled': str(enabled).upper()
        })

        for role in roles:
            user_roles.append({'user_id': i, 'role_name': role})

        # Tự động sinh địa chỉ cho từng User tương ứng với id `i`
        user_addresses.append(generate_random_address_data(i))

    return users, user_roles, user_addresses


def generate_users_sql(users):
    sql_lines = [
        "-- =====================================================",
        "-- SEED DATA: USERS",
        f"-- Total: {len(users)} users",
        "-- Password for all users: Password@123",
        "-- =====================================================",
        "INSERT INTO users (user_name, password, full_name, email, phone_number, id_card_number, trust_score, enabled, created_at, updated_at) VALUES"
    ]
    values = []
    for user in users:
        value = f"    ('{user['username']}', '{user['password']}', '{user['full_name']}', '{user['email']}', '{user['phone']}', '{user['id_card']}', {user['trust_score']}, {user['enabled']}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
        values.append(value)
    sql_lines.append(",\n".join(values) + ";")
    return "\n".join(sql_lines)


def generate_user_roles_sql(user_roles, role_id_map):
    sql_lines = [
        "-- =====================================================",
        "-- SEED DATA: USER_ROLES",
        "-- =====================================================",
        "INSERT INTO user_roles (user_id, role_id) VALUES"
    ]
    values = []
    for ur in user_roles:
        role_id = role_id_map[ur['role_name']]
        values.append(f"    ({ur['user_id']}, {role_id})")
    sql_lines.append(",\n".join(values) + ";")
    return "\n".join(sql_lines)


def generate_user_addresses_sql(user_addresses):
    sql_lines = [
        "-- =====================================================",
        "-- SEED DATA: USER_ADDRESSES",
        "-- =====================================================",
        "INSERT INTO user_addresses (user_id, province, district, ward, street_address, is_default, created_at, updated_at) VALUES"
    ]
    values = []
    for addr in user_addresses:
        value = f"    ({addr['user_id']}, '{addr['province']}', '{addr['district']}', '{addr['ward']}', '{addr['street_address']}', {addr['is_default']}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
        values.append(value)
    sql_lines.append(",\n".join(values) + ";")
    return "\n".join(sql_lines)


def main():
    print("=" * 70)
    print("GENERATING SEED DATA FOR EQUIPMENT RENTAL WEBSITE (WITH ADDRESSES)")
    print("=" * 70)

    print("\nGenerating 1000 users, roles, and addresses...")
    users, user_roles, user_addresses = generate_users(1000)

    role_id_map = {"ADMIN": 1, "OWNER": 2, "RENTER": 3}

    print("\nGenerating SQL statements...")
    users_sql = generate_users_sql(users)
    user_roles_sql = generate_user_roles_sql(user_roles, role_id_map)
    addresses_sql = generate_user_addresses_sql(user_addresses)

    full_sql = f"""-- =====================================================
-- SEED DATA: USERS, USER_ROLES, AND USER_ADDRESSES
-- Generated at: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC
-- DO NOT EDIT THIS FILE MANUALLY - Regenerate with: python scripts/generate_users.py
-- =====================================================

{users_sql}

{user_roles_sql}

{addresses_sql}
"""

    backend_path = Path("src/main/resources/database")
    backend_path.mkdir(parents=True, exist_ok=True)

    output_file = backend_path / "seed_users.sql"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(full_sql)

    print(f"\nSuccessfully generated {len(users)} users & addresses!")
    print(f"Output file: {output_file}")
    print("\n" + "=" * 70)


if __name__ == "__main__":
    main()
