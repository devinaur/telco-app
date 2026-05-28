from database import get_db
import numpy as np
import tensorflow as tf
import psycopg2.extras
import pickle
import os
import traceback

BASE_DIR = os.path.join(os.path.dirname(__file__), '..', 'ml')

MODEL_PATH = os.path.join(BASE_DIR, "telco_model.h5")
SCALER_PATH = os.path.join(BASE_DIR, "telco_scaler.pkl")
VEC_PATH = os.path.join(BASE_DIR, "telco_vec.pkl")
LE_PATH = os.path.join(BASE_DIR, "telco_le.pkl")

model = None
SCALER = None
VEC = None
LE_TARGET = None

def load_artifacts():
    global model, SCALER, VEC, LE_TARGET
    try:
        if model is None and os.path.exists(MODEL_PATH):
            model = tf.keras.models.load_model(MODEL_PATH)

        if SCALER is None and os.path.exists(SCALER_PATH):
            with open(SCALER_PATH, "rb") as f:
                SCALER = pickle.load(f)

        if VEC is None and os.path.exists(VEC_PATH):
            with open(VEC_PATH, "rb") as f:
                VEC = pickle.load(f)

        if LE_TARGET is None and os.path.exists(LE_PATH):
            with open(LE_PATH, "rb") as f:
                LE_TARGET = pickle.load(f)

    except Exception:
        traceback.print_exc()

load_artifacts()

def safe_float_convert(value, default=0.0):
    try:
        if value is None: return default
        return float(value)
    except (ValueError, TypeError):
        return default

def update_user_ml_after_transaction(user_id: int):
    if not model: load_artifacts()

    if not model or not SCALER or not VEC or not LE_TARGET:
        return {"error": "Model AI is not ready"}

    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    try:
        cur.execute("""
            SELECT
                plan_type, device_brand,
                avg_data_usage_gb, pct_video_usage, avg_call_duration,
                sms_freq, monthly_spend, topup_freq,
                travel_score, complaint_count
            FROM ml_features WHERE user_id = %s
        """, (user_id,))
        data = cur.fetchone()

        if not data:
            return {"error": f"No ML features found for user_id {user_id}"}

        numerical_data = [
            safe_float_convert(data['avg_data_usage_gb']),
            safe_float_convert(data['pct_video_usage']),
            safe_float_convert(data['avg_call_duration']),
            safe_float_convert(data['sms_freq']),
            safe_float_convert(data['monthly_spend']),
            safe_float_convert(data['topup_freq']),
            safe_float_convert(data['travel_score']),
            safe_float_convert(data['complaint_count'])
        ]

        categorical_data_dict = [{
            "plan_type": data.get('plan_type', 'UNKNOWN') or 'UNKNOWN',
            "device_brand": data.get('device_brand', 'UNKNOWN') or 'UNKNOWN'
        }]

        X_num = SCALER.transform(np.array([numerical_data]))
        X_cat = VEC.transform(categorical_data_dict)

        input_data = np.hstack([X_num, X_cat])

        prediction_probs = model.predict(input_data, verbose=0)
        predicted_index = np.argmax(prediction_probs)

        final_offer_name = LE_TARGET.inverse_transform([predicted_index])[0]

        cur.execute("""
            UPDATE ml_features
            SET target_offer = %s
            WHERE user_id = %s
        """, (final_offer_name, user_id))

        conn.commit()

        return {
            "success": True,
            "user_id": user_id,
            "new_recommendation": final_offer_name
        }

    except Exception as e:
        conn.rollback()
        traceback.print_exc()
        return {"error": str(e)}

    finally:
        cur.close()
        conn.close()

def _update_feature(user_id, column, increment):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute(f"UPDATE ml_features SET {column} = {column} + %s WHERE user_id = %s", (increment, user_id))
        conn.commit()
        return update_user_ml_after_transaction(user_id)
    except Exception as e:
        conn.rollback()
        return {"error": str(e)}
    finally:
        cur.close()
        conn.close()

def update_user_data_usage(user_id: int, increment: float):
    return _update_feature(user_id, "avg_data_usage_gb", increment)

def update_video_usage(user_id: int, increment: float):
    return _update_feature(user_id, "pct_video_usage", increment)

def update_call_duration(user_id: int, increment: float):
    return _update_feature(user_id, "avg_call_duration", increment)

def update_sms_frequency(user_id: int, increment: int):
    return _update_feature(user_id, "sms_freq", increment)

def update_travel_score(user_id: int, increment: float):
    return _update_feature(user_id, "travel_score", increment)