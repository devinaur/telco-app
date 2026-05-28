from database import get_db
import psycopg2.extras
import traceback

def get_all_products():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cur.execute("SELECT * FROM products ORDER BY id ASC")
        data = cur.fetchall()
        return data
    finally:
        cur.close()
        conn.close()

def get_product_by_id(pid):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cur.execute("SELECT * FROM products WHERE id = %s", (pid,))
        data = cur.fetchone()
        return data
    finally:
        cur.close()
        conn.close()

def get_products_by_type(type_name):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cur.execute("SELECT * FROM products WHERE type = %s", (type_name,))
        data = cur.fetchall()
        return data
    finally:
        cur.close()
        conn.close()

def add_product(data):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO products (name, type, price, validity, description)
            VALUES (%s, %s, %s, %s, %s)
        """, (data["name"], data["type"], data["price"], data["validity"], data["description"]))
        conn.commit()
    finally:
        cur.close()
        conn.close()

def get_promo_products():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cur.execute("SELECT * FROM products WHERE is_promo = TRUE")
        data = cur.fetchall()
        return data
    finally:
        cur.close()
        conn.close()

def get_last_purchased_products(user_id):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cur.execute("""
            SELECT 
                t.id, 
                t.description as name, 
                t.amount as price, 
                t.transaction_type,
                q.product_id, 
                t.created_at as bought_at
            FROM user_transactions t
            LEFT JOIN user_quotas q ON t.user_quota_id = q.id
            WHERE t.user_id = %s
            ORDER BY t.created_at DESC
            LIMIT 5
        """, (user_id,))
        data = cur.fetchall()
        return data
    finally:
        cur.close()
        conn.close()

def get_recommended_products(user_id):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cur.execute("SELECT * FROM products ORDER BY RANDOM() LIMIT 5")
        data = cur.fetchall()
        return data
    except Exception:
        return []
    finally:
        cur.close()
        conn.close()

def search_products_advanced(keyword=None, min_price=None, max_price=None):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        query = "SELECT * FROM products WHERE 1=1"
        params = []

        if keyword:
            query += " AND (LOWER(name) LIKE %s OR LOWER(description) LIKE %s OR LOWER(type) LIKE %s)"
            search_term = f"%{keyword.lower()}%"
            params.extend([search_term, search_term, search_term])

        if min_price:
            query += " AND price >= %s"
            params.append(min_price)

        if max_price:
            query += " AND price <= %s"
            params.append(max_price)

        query += " ORDER BY price ASC"

        cur.execute(query, tuple(params))
        data = cur.fetchall()
        return data
    finally:
        cur.close()
        conn.close()

def get_products_by_offer(offer):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    try:
        print(f"🔍 Mencari produk untuk Offer: '{offer}'")
        
        cur.execute("SELECT * FROM products WHERE type = %s LIMIT 5", (offer,))
        result = cur.fetchall()
        
        if not result:
            print(f"⚠️ Exact match kosong untuk '{offer}', mencoba partial match...")
            search_term = f"%{offer}%"
            cur.execute("SELECT * FROM products WHERE name LIKE %s LIMIT 5", (search_term,))
            result = cur.fetchall()
            
        return result
    except Exception as e:
        print(f"Error fetching products by offer: {e}")
        return []
    finally:
        cur.close()
        conn.close()

def get_recommendations_by_ml(user_id):
    try:
        from .ml_model import update_user_ml_after_transaction
    except ImportError as e:
        print(f"FATAL ERROR: Failed to load ML module: {e}")
        return []

    ml_update_result = update_user_ml_after_transaction(user_id)
    
    if ml_update_result.get("error"):
        raise Exception(ml_update_result.get("error"))

    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    try:
        cur.execute("SELECT target_offer FROM ml_features WHERE user_id = %s", (user_id,))
        ml_feature = cur.fetchone()
        
        if not ml_feature or not ml_feature.get('target_offer'):
            return []

        target_offer = ml_feature['target_offer']
        
        products = get_products_by_offer(target_offer)
        return products
        
    except Exception as e:
        print(f"Error retrieving ML products for User {user_id}: {e}")
        traceback.print_exc()
        return []
    finally:
        cur.close()
        conn.close()