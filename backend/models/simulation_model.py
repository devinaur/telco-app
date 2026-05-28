from database import get_db
from models.ml_model import update_user_ml_after_transaction, update_travel_score 
import psycopg2.extras

def simulate_usage(user_id, used_gb: float):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor) 

    try:
        cur.execute("""
            SELECT id, quota FROM user_quotas
            WHERE user_id = %s ORDER BY created_at DESC LIMIT 1
        """, (user_id,))
        data = cur.fetchone()

        if not data:
            return {"success": False, "error": "Tidak ada kuota aktif"}

        quota_id, quota_str = data["id"], data["quota"]
        
        current = float(quota_str.upper().replace("GB","").replace(" ",""))
        updated = max(0, current - used_gb)

        cur.execute("UPDATE user_quotas SET quota = %s WHERE id = %s",
                    (f"{updated}GB", quota_id))

        conn.commit()
        
        update_user_ml_after_transaction(user_id) 

        return {"success": True, "remaining_quota": f"{updated}GB"}

    except Exception as e:
        conn.rollback()
        return {"error": str(e)}

    finally:
        cur.close()
        conn.close()

def update_travel_score_simulation(user_id, increment: float):
    return update_travel_score(user_id, increment)

def simulate_user_profile_update(user_id, data):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    try:
        query = """
            UPDATE ml_features
            SET 
                plan_type = %s,
                device_brand = %s,
                avg_data_usage_gb = %s,
                pct_video_usage = %s,
                avg_call_duration = %s,
                sms_freq = %s,
                monthly_spend = %s,
                topup_freq = %s,
                travel_score = %s,
                complaint_count = %s
            WHERE user_id = %s
        """
        
        params = (
            data.get('plan_type'),
            data.get('device_brand'),
            data.get('avg_data_usage_gb'),
            data.get('pct_video_usage'),
            data.get('avg_call_duration'),
            data.get('sms_freq'),
            data.get('monthly_spend'),
            data.get('topup_freq'),
            data.get('travel_score'),
            data.get('complaint_count'),
            user_id
        )

        cur.execute(query, params)
        conn.commit()

        ml_result = update_user_ml_after_transaction(user_id)
        
        return ml_result

    except Exception as e:
        conn.rollback()
        print(f"Error simulation update: {e}")
        return {"error": str(e)}

    finally:
        cur.close()
        conn.close()