import random
import string
from datetime import datetime
from pathlib import Path
from tqdm import tqdm

# Danh sách tên đệm và tên tiếng Việt (bỏ dấu hoặc giữ nguyên không dấu để tránh lỗi encode tùy bạn, ở đây giữ chuẩn ko dấu cho sạch)
FIRST_NAMES_MALE = [
    "Minh", "Anh", "Van", "Hung", "Dung", "Tung", "Khanh", "Dang", "Hoang",
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
        # Chủ máy có 30% tỷ lệ muốn đi thuê lại máy của người khác (vừa là Owner vừa là Renter)
        if random.random() < 0.3:
            roles.append("RENTER")
    else:
        # Toàn bộ người dùng còn lại là khách thuê thuần túy
        roles.append("RENTER")
    return roles


def generate_users(num_users=1000):
    users = []
    user_roles = []

    # Tạo trước 1 password hash chung để tránh việc chạy bcrypt 1000 lần gây treo/chậm script
    print("Hashing default password (please wait)...")
    password_hashed = hash_password("Password@123")

    for i in tqdm(range(1, num_users + 1), desc="Generating users", unit="user"):
        is_male = random.choice([True, False])
        first_name = random.choice(FIRST_NAMES_MALE) if is_male else random.choice(FIRST_NAMES_FEMALE)
        last_name = random.choice(LAST_NAMES)
        full_name = f"{last_name} {first_name}"

        username = f"{first_name.lower()}_{last_name.lower()}{i}"
        email = generate_random_email(first_name, last_name, i)
        phone = generate_random_phone()
        id_card = generate_id_card()
        trust_score = round(random.uniform(3.00, 5.00), 2)
        enabled = i <= 950  # 95% user được kích hoạt sẵn
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

    return users, user_roles


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
        # Cập nhật đảm bảo các giá trị chuỗi không bị null tuân thủ ràng buộc NOT NULL của database
        value = f"    ('{user['username']}', '{user['password']}', '{user['full_name']}', '{user['email']}', '{user['phone']}', '{user['id_card']}', {user['trust_score']}, {user['enabled']}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
        values.append(value)

    # Đưa các câu lệnh nối chuỗi ra ngoài vòng lặp FOR để tránh lỗi cú pháp SQL
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

    # Đưa ra ngoài vòng lặp FOR
    sql_lines.append(",\n".join(values) + ";")
    return "\n".join(sql_lines)


def main():
    print("=" * 70)
    print("GENERATING SEED DATA FOR EQUIPMENT RENTAL WEBSITE")
    print("=" * 70)

    users, user_roles = generate_users(1000)

    role_counts = {}
    for ur in user_roles:
        role_counts[ur['role_name']] = role_counts.get(ur['role_name'], 0) + 1

    print(f"\nRole distribution:")
    for role, count in sorted(role_counts.items()):
        percentage = count / len(users) * 100
        print(f"   {role:10s}: {count:4d} users ({percentage:5.1f}%)")

    user_role_counts = {}
    for ur in user_roles:
        user_role_counts[ur['user_id']] = user_role_counts.get(ur['user_id'], 0) + 1
    multi_role_users = sum(1 for count in user_role_counts.values() if count > 1)
    print(f"\nUsers with multiple roles: {multi_role_users}")

    role_id_map = {
        "ADMIN": 1,
        "OWNER": 2,
        "RENTER": 3
    }

    print("\nGenerating SQL statements...")
    users_sql = generate_users_sql(users)
    user_roles_sql = generate_user_roles_sql(user_roles, role_id_map)

    full_sql = f"""-- =====================================================
-- SEED DATA: USERS AND USER_ROLES
-- Generated at: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC
-- DO NOT EDIT THIS FILE MANUALLY - Regenerate with: python scripts/generate_users.py
-- =====================================================

{users_sql}

{user_roles_sql}
"""

    backend_path = Path("src/main/resources/database")
    backend_path.mkdir(parents=True, exist_ok=True)

    output_file = backend_path / "seed_users.sql"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(full_sql)

    print(f"\nSuccessfully generated {len(users)} users!")
    print(f"Output file: {output_file}")
    print("\n" + "=" * 70)


if __name__ == "__main__":
    main()
