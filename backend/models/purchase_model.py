from database import get_db
from datetime import datetime, timedelta
import re
import psycopg2.extras
from models.notification_model import create_notification
from models.ml_model import update_user_ml_after_transaction

def calculate_expiry(validity_str):
    try:
        days = 30
        num_search = re.search(r'\d+', validity_str)
        if num_search:
            val = int(num_search.group())
            if 'hari' in validity_str.lower() or 'day' in validity_str.lower():
                days = val
            elif 'minggu' in validity_str.lower() or 'week' in validity_str.lower():
                days = val * 7
            elif 'bulan' in validity_str.lower() or 'month' in validity_str.lower():
                days = val * 30
        return datetime.now() + timedelta(days=days)
    except:
        return datetime.now() + timedelta(days=30)

def process_purchase(user_id, product_id):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    try:
        cur.execute("SELECT * FROM products WHERE id = %s", (product_id,))
        product = cur.fetchone()
        if not product:
            return {"success": False, "error": "Produk tidak ditemukan"}

        price = product["price"]

        cur.execute("SELECT balance FROM user_balance WHERE user_id = %s", (user_id,))
        balance_row = cur.fetchone()
        if not balance_row:
            return {"success": False, "error": "Saldo user tidak ditemukan"}
        balance = balance_row["balance"]

        if balance < price:
            return {"success": False, "error": "Saldo tidak cukup"}

        new_balance = balance - price
        cur.execute("UPDATE user_balance SET balance = %s, updated_at = CURRENT_TIMESTAMP WHERE user_id = %s",
                    (new_balance, user_id))

        cur.execute("""
            INSERT INTO user_quotas (user_id, product_id, quota, expires_at)
            VALUES (%s, %s, %s, NOW() + INTERVAL '30 days')
        """, (user_id, product_id, product["quota_amount"]))

        cur.execute("""
            INSERT INTO user_transactions (user_id, amount, description, transaction_type)
            VALUES (%s, %s, %s, 'purchase')
        """, (user_id, price, f"Beli {product['name']}"))

        earned_points = price // 1000

        cur.execute("""
            INSERT INTO user_point_balances (user_id, balance)
            VALUES (%s, %s)
            ON CONFLICT (user_id) DO UPDATE
            SET balance = user_point_balances.balance + %s,
                updated_at = CURRENT_TIMESTAMP
            RETURNING balance
        """, (user_id, earned_points, earned_points))
        
        new_point_balance = cur.fetchone()['balance']

        cur.execute("""
            INSERT INTO user_points (user_id, points, type, reference)
            VALUES (%s, %s, 'earn', %s)
        """, (user_id, earned_points, f"Purchase {product['name']}"))

        create_notification(
            user_id,
            "Pembelian Berhasil",
            f"Paket {product['name']} telah aktif. Anda mendapatkan {earned_points} poin."
        )

        cur.execute("""
            UPDATE ml_features
            SET monthly_spend = monthly_spend + %s
            WHERE user_id = %s
        """, (price, user_id))

        conn.commit()

        update_user_ml_after_transaction(user_id)

        return {
            "success": True,
            "message": f"Pembelian {product['name']} berhasil",
            "new_balance": new_balance,
            "earned_points": earned_points,
            "new_point_balance": new_point_balance
        }

    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}

    finally:
        cur.close()
        conn.close()


def process_topup(user_id, amount, method):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    try:
        if amount < 10000:
            return {"success": False, "message": "Minimal top up Rp 10.000"}

        cur.execute("""
            INSERT INTO user_balance (user_id, balance) VALUES (%s, %s)
            ON CONFLICT (user_id) DO UPDATE 
            SET balance = user_balance.balance + %s, updated_at = CURRENT_TIMESTAMP
            RETURNING balance
        """, (user_id, amount, amount))
        
        new_balance = cur.fetchone()['balance']

        method_name = method.replace('_', ' ').upper()
        cur.execute("""
            INSERT INTO user_transactions 
            (user_id, amount, transaction_type, affects_balance, description)
            VALUES (%s, %s, 'topup', TRUE, %s)
        """, (user_id, amount, f"Top Up Saldo via {method_name}"))

        cur.execute("""
            INSERT INTO user_behavior_logs (user_id, event_type, event_detail)
            VALUES (%s, 'topup', %s)
        """, (user_id, f"Top Up {amount}"))

        create_notification(
            user_id,
            "Top Up Berhasil",
            f"Saldo sebesar Rp{amount:,} berhasil ditambahkan melalui {method_name}."
        )
        
        cur.execute("""
                UPDATE ml_features
                SET topup_freq = topup_freq + 1
                WHERE user_id = %s
        """, (user_id,))

        conn.commit()
        update_user_ml_after_transaction(user_id)
        
        return {
            "success": True,
            "message": "Top Up Berhasil",
            "new_balance": new_balance
        }

    except Exception as e:
        conn.rollback()
        print("Error process_topup:", str(e))
        return {"success": False, "message": f"System Error: {str(e)}"}

    finally:
        cur.close()
        conn.close()