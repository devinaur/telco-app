from database import get_db
import psycopg2.extras
import bcrypt
import re

def parse_quota_to_mb(quota_str):
    if not quota_str:
        return 0
    q_str = quota_str.upper().replace(" ", "")
    
    if "UNLIMITED" in q_str:
        return float('inf')
        
    match = re.search(r'(\d+)(GB|MB|KB)', q_str)
    if not match:
        return 0
        
    value = int(match.group(1))
    unit = match.group(2)
    
    if unit == 'GB':
        return value * 1024
    elif unit == 'MB':
        return value
    elif unit == 'KB':
        return value / 1024
    return 0

def format_mb_to_string(total_mb):
    if total_mb == float('inf'):
        return "Unlimited"
    if total_mb >= 1024:
        return f"{round(total_mb / 1024, 1)} GB".replace(".0", "")
    return f"{int(total_mb)} MB"

def get_user_stats(user_id):
    conn = get_db()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    try:
        cursor.execute("""
            SELECT 
                u.id,
                COALESCE(ub.balance, 0) as balance,
                COALESCE(upb.balance, 0) as points
            FROM users u
            LEFT JOIN user_balance ub ON u.id = ub.user_id
            LEFT JOIN user_point_balances upb ON u.id = upb.user_id
            WHERE u.id = %s
        """, (user_id,))
        stats = cursor.fetchone()

        cursor.execute("""
            SELECT quota 
            FROM user_quotas 
            WHERE user_id = %s 
            AND (expires_at > NOW() OR expires_at IS NULL)
        """, (user_id,))
        quotas = cursor.fetchall()

        total_mb = 0
        for row in quotas:
            mb = parse_quota_to_mb(row['quota'])
            total_mb += mb
            
        final_quota_str = format_mb_to_string(total_mb) if total_mb > 0 else "0 GB"

        result = {
            "balance": stats['balance'] if stats else 0,
            "points": stats['points'] if stats else 0,
            "quota": final_quota_str 
        }
        
        return result

    except Exception as e:
        print("Error get_user_stats:", e)
        return {"balance": 0, "points": 0, "quota": "0 GB"}
        
    finally:
        cursor.close()
        conn.close()

def create_user(data):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        hashed_pw = None
        if data.get('password'):
            hashed_pw = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        cur.execute("""
            INSERT INTO users (name, email, phone, password, customer_id, is_verified)
            VALUES (%s, %s, %s, %s, %s, FALSE)
            RETURNING id
        """, (data['name'], data['email'], data['phone'], hashed_pw, data['customer_id']))
        
        user_id = cur.fetchone()['id']
        
        cur.execute("INSERT INTO user_balance (user_id, balance) VALUES (%s, 0)", (user_id,))
        cur.execute("INSERT INTO user_point_balances (user_id, balance) VALUES (%s, 0)", (user_id,))
        
        conn.commit()
        return user_id
    except Exception as e:
        conn.rollback()
        print("Error create_user:", e)
        return None
    finally:
        cur.close()
        conn.close()

def verify_user_status(user_id):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("UPDATE users SET is_verified = TRUE WHERE id = %s", (user_id,))
        conn.commit()
    finally:
        cur.close()
        conn.close()

def update_user_password(email, plain_password):
    conn = get_db()
    cur = conn.cursor()
    try:
        hashed_pw = bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        cur.execute("UPDATE users SET password = %s, is_verified = TRUE WHERE email = %s", (hashed_pw, email))
        conn.commit()
        return True
    except Exception as e:
        conn.rollback()
        print("Error update_password:", e)
        return False
    finally:
        cur.close()
        conn.close()

def delete_user_permanently(user_id):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
        conn.commit()
    finally:
        cur.close()
        conn.close()

def get_user_active_quotas(user_id):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cur.execute("""
            SELECT 
                q.id, 
                q.quota, 
                q.expires_at, 
                q.created_at,
                p.name as product_name,
                p.type
            FROM user_quotas q
            JOIN products p ON q.product_id = p.id
            WHERE q.user_id = %s 
            AND (q.expires_at > NOW() OR q.expires_at IS NULL)
            ORDER BY q.expires_at ASC
        """, (user_id,))
        
        data = cur.fetchall()
        return data
    except Exception as e:
        print("Error get_user_active_quotas:", e)
        return []
    finally:
        cur.close()
        conn.close()