from database import get_db
import psycopg2.extras
from datetime import date, timedelta
from models.notification_model import create_notification

def get_all_rewards():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    query = """
        SELECT * FROM reward_items 
        WHERE status = 'available' 
        AND (expires_at >= CURRENT_DATE OR expires_at IS NULL)
        ORDER BY quantity DESC, id ASC
    """
    cur.execute(query)
    data = cur.fetchall()
    cur.close()
    conn.close()
    return data

def get_reward_by_id(rid):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT * FROM reward_items WHERE id = %s", (rid,))
    data = cur.fetchone()
    cur.close()
    conn.close()
    return data

def get_rewards_by_type(reward_type):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    query = """
        SELECT * FROM reward_items 
        WHERE status = 'available' 
        AND (expires_at >= CURRENT_DATE OR expires_at IS NULL)
        AND LOWER(reward_type) = LOWER(%s)
        ORDER BY quantity DESC, id ASC
    """
    cur.execute(query, (reward_type,))
    data = cur.fetchall()
    cur.close()
    conn.close()
    return data

def get_user_points(user_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT balance FROM user_point_balances WHERE user_id = %s", (user_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    return row['balance'] if row else 0

def get_redeem_history(user_id):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    query = """
        SELECT ur.id, ur.status, ur.claimed_at, ri.name, ri.image_path, ri.reward_type, ri.required_points
        FROM user_rewards ur
        JOIN reward_items ri ON ur.reward_item_id = ri.id
        WHERE ur.user_id = %s
        ORDER BY ur.claimed_at DESC
    """
    cur.execute(query, (user_id,))
    data = cur.fetchall()
    cur.close()
    conn.close()
    return data

def redeem_reward(user_id, reward_id):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    try:
        cur.execute("SELECT balance FROM user_point_balances WHERE user_id = %s", (user_id,))
        res = cur.fetchone()
        current_points = res['balance'] if res else 0
        
        cur.execute("SELECT * FROM reward_items WHERE id = %s", (reward_id,))
        reward = cur.fetchone()
        
        if not reward:
            return {"error": "Reward tidak ditemukan"}
            
        cost = reward['required_points']
        
        if current_points < cost:
            return {"error": "Poin tidak mencukupi"}
        
        if reward['quantity'] <= 0:
            return {"error": "Stok reward habis"}
            
        new_balance = current_points - cost
        
        cur.execute("""
            INSERT INTO user_point_balances (user_id, balance) VALUES (%s, %s)
            ON CONFLICT (user_id) DO UPDATE SET balance = %s, updated_at = CURRENT_TIMESTAMP
        """, (user_id, new_balance, new_balance))
        
        cur.execute("""
            INSERT INTO user_points (user_id, points, type, reference)
            VALUES (%s, %s, 'redeem', %s)
        """, (user_id, cost, f"Redeem: {reward['name']}"))
        
        cur.execute("UPDATE reward_items SET quantity = quantity - 1 WHERE id = %s AND quantity > 0", (reward_id,))
        
        if cur.rowcount == 0:
             conn.rollback()
             return {"error": "Gagal redeem, stok baru saja habis!"}

        cur.execute("""
            INSERT INTO user_rewards (user_id, reward_item_id, status)
            VALUES (%s, %s, 'claimed')
        """, (user_id, reward_id))
        
        create_notification(
            user_id,
            "Penukaran Reward Berhasil",
            f"Anda berhasil menukar {cost} poin dengan {reward['name']}."
        )

        conn.commit()
        return {"success": True, "message": "Redeem berhasil!", "new_balance": new_balance}
        
    except Exception as e:
        conn.rollback()
        print("Error redeem:", e)
        return {"error": "Terjadi kesalahan sistem"}
    finally:
        cur.close()
        conn.close()

def get_checkin_status(user_id):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cur.execute("SELECT * FROM user_checkins WHERE user_id = %s", (user_id,))
        row = cur.fetchone()
        
        today = date.today()
        
        if not row:
            return {"streak": 0, "claimed_today": False, "points_map": [10, 20, 30, 40, 50, 75, 150]}
            
        last_date = row['last_checkin_date']
        streak = row['streak_count']
        
        claimed_today = (last_date == today)
        
        return {
            "streak": streak,
            "claimed_today": claimed_today,
            "last_checkin": str(last_date),
            "points_map": [10, 20, 30, 40, 50, 75, 150]
        }
    except Exception as e:
        print("Error get_checkin_status:", e)
        return {"error": str(e)}
    finally:
        cur.close()
        conn.close()

def process_daily_checkin(user_id):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        today = date.today()
        
        cur.execute("SELECT * FROM user_checkins WHERE user_id = %s", (user_id,))
        row = cur.fetchone()
        
        new_streak = 1
        points_map = [10, 20, 30, 40, 50, 75, 150]
        
        if row:
            last_date = row['last_checkin_date']
            current_streak = row['streak_count']
            
            if last_date == today:
                return {"success": False, "message": "Anda sudah check-in hari ini."}
            
            if last_date == today - timedelta(days=1):
                new_streak = current_streak + 1
            else:
                new_streak = 1
                
            if new_streak > 7:
                new_streak = 1
        
        earned_points = points_map[new_streak - 1]
        
        cur.execute("""
            INSERT INTO user_checkins (user_id, streak_count, last_checkin_date)
            VALUES (%s, %s, %s)
            ON CONFLICT (user_id) 
            DO UPDATE SET streak_count = %s, last_checkin_date = %s
        """, (user_id, new_streak, today, new_streak, today))
        
        cur.execute("""
            INSERT INTO user_point_balances (user_id, balance) VALUES (%s, %s)
            ON CONFLICT (user_id) DO UPDATE 
            SET balance = user_point_balances.balance + %s, updated_at = CURRENT_TIMESTAMP
        """, (user_id, earned_points, earned_points))
        
        cur.execute("""
            INSERT INTO user_points (user_id, points, type, reference)
            VALUES (%s, %s, 'earn', %s)
        """, (user_id, earned_points, f"Daily Check-In Day {new_streak}"))
        
        create_notification(
            user_id,
            "Daily Check-in Berhasil",
            f"Selamat! Anda mendapatkan +{earned_points} poin untuk check-in hari ke-{new_streak}."
        )

        conn.commit()
        return {
            "success": True, 
            "message": f"Check-in berhasil! +{earned_points} Poin",
            "day": new_streak,
            "points": earned_points
        }
        
    except Exception as e:
        conn.rollback()
        print("Error process_daily_checkin:", e)
        return {"success": False, "message": "Terjadi kesalahan sistem"}
    finally:
        cur.close()
        conn.close()