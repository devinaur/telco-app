from database import get_db
import psycopg2.extras
from datetime import date

def get_notifications(user_id):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cur.execute("""
            SELECT * FROM user_notifications 
            WHERE user_id = %s 
            ORDER BY created_at DESC 
            LIMIT 20
        """, (user_id,))
        data = cur.fetchall()
        return data
    except Exception as e:
        print("Error get_notifications:", e)
        return []
    finally:
        cur.close()
        conn.close()

def create_notification(user_id, title, message):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO user_notifications (user_id, title, message, is_read)
            VALUES (%s, %s, %s, FALSE)
        """, (user_id, title, message))
        conn.commit()
        return True
    except Exception as e:
        conn.rollback()
        print("Error create_notification:", e)
        return False
    finally:
        cur.close()
        conn.close()

def mark_all_read(user_id):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("""
            UPDATE user_notifications 
            SET is_read = TRUE 
            WHERE user_id = %s AND is_read = FALSE
        """, (user_id,))
        conn.commit()
        return True
    except Exception as e:
        conn.rollback()
        print("Error mark_all_read:", e)
        return False
    finally:
        cur.close()
        conn.close()

def check_and_create_promo(user_id):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT id FROM user_notifications 
            WHERE user_id = %s 
            AND title LIKE '🔥 Promo Spesial%'
            AND created_at::date = CURRENT_DATE
        """, (user_id,))
        
        exists = cur.fetchone()
        
        if not exists:
            title = "🔥 Promo Spesial Hari Ini!"
            message = "Flash Sale! Paket Data 35GB hanya Rp 85.000. Berlaku sampai tengah malam ini."
            
            cur.execute("""
                INSERT INTO user_notifications (user_id, title, message, is_read)
                VALUES (%s, %s, %s, FALSE)
            """, (user_id, title, message))
            conn.commit()
            return True
            
        return False
    except Exception as e:
        conn.rollback()
        print("Error promo check:", e)
        return False
    finally:
        cur.close()
        conn.close()