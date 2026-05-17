import random
import string
from datetime import datetime

# Danh sách tên Việt Nam
FIRST_NAMES_MALE = [
    "Minh", "Anh", "Hua", "Van", "Hung", "Dung", "Tung", "Khanh", "Dang", "Hoang",
    "Tuấn", "Thanh", "Phuc", "Long", "Binh", "Nam", "Khoi", "Khang", "Duc", "Nghia"
]

FIRST_NAMES_FEMALE = [
    "Trang", "Linh", "Chi", "Anh", "Huong", "Ngoc", "Yen", "Phuong", "Lan", "Hoa",
    "Thao", "Nhung", "Ha", "Van", "Kieu", "Mai", "Thu", "Tam", "Nhan", "Dieu"
]

LAST_NAMES = [
    "Nguyen", "Tran", "Le", "Pham", "Hoang", "Pham", "Vu", "Do", "Ho", "Ngoc",
    "Luong", "Ky", "Dang", "Bui", "Doan", "Nguyen", "Hoang", "Pham", "Luu", "Trinh"
]


def generate_random_email(first_name, last_name, index):
    """Tạo email uniq"""
    domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"]
    domain = random.choice(domains)
    return f"{first_name.lower()}.{last_name.lower()}{index}@{domain}"


def generate_random_phone():
    """Tạo số điện thoại Việt Nam"""
    prefixes = ["090", "091", "093", "094", "096", "097", "098", "099", "032", "033", "034", "035", "038", "039"]
    return random.choice(prefixes) + ''.join(random.choices(string.digits, k=7))


def generate_id_card():
    """Tạo số CCCD 12 chữ số"""
    return ''.join(random.choices(string.digits, k=12))


def hash_password(password):
    """Hash password bằng bcrypt (trùng với Spring Security)"""
    import bcrypt
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def assign_roles(user_index):
    """
    Assign roles cho users:
    - ADMIN: 5 users (1-5)
    - OWNER: 150 users (6-155)
    - RENTER: 845 users (156-1000)
    - 30% OWNER cũng là RENTER
    """
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


def generate_users(num_users=1000):
    """Generate 1000 users với roles"""
    users = []
    user_roles = []

    for i in range(1, num_users + 1):
        # Random giới tính
        is_male = random.choice([True, False])
        first_name = random.choice(FIRST_NAMES_MALE) if is_male else random.choice(FIRST_NAMES_FEMALE)
        last_name = random.choice(LAST_NAMES)
        full_name = f"{last_name} {first_name}"

        # Username uniq
        username = f"{first_name.lower()}.{last_name.lower()}{i}"

        # Email, phone, id_card
        email = generate_random_email(first_name, last_name, i)
        phone = generate_random_phone()
        id_card = generate_id_card()

        # Password hash (bcrypt)
        password_hashed = hash_password("Password@123")

        # Trust score & enabled
        trust_score = round(random.uniform(3.00, 5.00), 2)
        enabled = i <= 950  # 95% enabled

        # Assign roles
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
    """Generate INSERT cho bảng users"""
    sql_lines = [
        "-- =====================================================",
        "-- GENERATION USERS DATA",
        f"-- Total: {len(users)} users",
        f"-- Generated at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        "-- Password for all users: Password@123",
        "-- =====================================================",
        "",
        "INSERT INTO users (user_name, password, full_name, email, phone_number, id_card_number, trust_score, enabled) VALUES"
    ]

    values = []
    for user in users:
        value = f"""    ('{user['username']}', '{user['password']}', '{user['full_name']}', '{user['email']}', '{user['phone']}', '{user['id_card']}', {user['trust_score']}, {user['enabled']})"""
        values.append(value)

    sql_lines.append(",\n".join(values))
    sql_lines.append(";")

    return "\n".join(sql_lines)


def generate_user_roles_sql(user_roles, role_id_map):
    """Generate INSERT cho bảng user_roles"""
    sql_lines = [
        "-- Assign roles to users",
        f"-- Generated at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        "INSERT INTO user_roles (user_id, role_id) VALUES"
    ]

    values = []
    for ur in user_roles:
        role_id = role_id_map[ur['role_name']]
        values.append(f"    ({ur['user_id']}, {role_id})")

    sql_lines.append(",\n".join(values))
    sql_lines.append(";")
    return "\n".join(sql_lines)


def main():
    print("=" * 60)
    print("GENERATING SAMPLE DATA FOR EQUIPMENT RENTAL WEBSITE")
    print("=" * 60)

    # Generate users
    print("\n🔄 Generating 1000 users...")
    users, user_roles = generate_users(1000)

    # Print role distribution
    role_counts = {}
    for ur in user_roles:
        role_counts[ur['role_name']] = role_counts.get(ur['role_name'], 0) + 1

    print(f"\n📊 Role distribution:")
    for role, count in sorted(role_counts.items()):
        percentage = count / len(users) * 100
        print(f"   {role:10s}: {count:4d} users ({percentage:5.1f}%)")

    # Count multi-role users
    user_role_counts = {}
    for ur in user_roles:
        user_role_counts[ur['user_id']] = user_role_counts.get(ur['user_id'], 0) + 1
    multi_role_users = sum(1 for count in user_role_counts.values() if count > 1)
    print(f"\n   👥 Users with multiple roles: {multi_role_users}")

    # Role ID mapping (theo thứ tự trong seed_roles.sql)
    # 1 = ADMIN, 2 = OWNER, 3 = RENTER
    role_id_map = {
        "ADMIN": 1,
        "OWNER": 2,
        "RENTER": 3
    }

    # Generate SQL
    print("\n📝 Generating SQL statements...")
    users_sql = generate_users_sql(users)
    user_roles_sql = generate_user_roles_sql(user_roles, role_id_map)

    # Combine all
    full_sql = f"""-- =====================================================
-- SAMPLE DATA FOR USERS AND USER_ROLES
-- Generated at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
-- =====================================================

{users_sql}

{user_roles_sql}
"""

    # Save to file
    output_file = "scripts/generated_users.sql"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(full_sql)

    print(f"\n✅ Successfully generated {len(users)} users!")
    print(f"📁 Output file: {output_file}")
    print(f"\n🔑 Default password for all users: Password@123")
    print(f"\n📋 Next steps:")
    print(f"   1. Open: {output_file}")
    print(f"   2. Copy all content (Ctrl+A, Ctrl+C)")
    print(f"   3. Paste into: src/main/resources/database/seed_roles.sql")
    print(f"   4. Append at the END of the file")
    print(f"   5. Run your Spring Boot application")
    print("\n" + "=" * 60)


if __name__ == "__main__":
    main()
