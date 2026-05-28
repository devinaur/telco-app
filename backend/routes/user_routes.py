from flask import Blueprint, jsonify, request
from database import get_db
from models.user_model import get_user_stats, get_user_active_quotas
from models.product_model import get_last_purchased_products

user = Blueprint("user", __name__)


@user.route("/stats/<int:user_id>", methods=["GET"])
def user_stats(user_id):
    stats = get_user_stats(user_id)
    return jsonify(stats) if stats else (jsonify({"error": "not found"}), 404)


@user.route("/last-bought/<int:user_id>", methods=["GET"])
def last_bought(user_id):
    data = get_last_purchased_products(user_id)
    return jsonify([dict(p) for p in data]) if data else jsonify([])


@user.route("/quotas/<int:user_id>", methods=["GET"])
def active_quotas(user_id):
    data = get_user_active_quotas(user_id)
    return jsonify([dict(q) for q in data]) if data else jsonify([])


@user.route("/complete-profile", methods=["POST"])
def complete_profile():
    data = request.json
    user_id = data.get("user_id")
    device_brand = data.get("device_brand")
    plan_type = data.get("plan_type")

    if not user_id or not device_brand or not plan_type:
        return jsonify({"error": "All fields are required"}), 400

    try:
        conn = get_db()
        cur = conn.cursor()

        cur.execute(
            """
            INSERT INTO ml_features (
                user_id, customer_id, device_brand, plan_type,
                avg_data_usage_gb, pct_video_usage, avg_call_duration, sms_freq,
                monthly_spend, topup_freq, travel_score, complaint_count, target_offer
            )
            SELECT
                u.id,
                u.customer_id,
                %s,         -- device_brand
                %s,         -- plan_type
                0,        -- avg_data_usage_gb (dummy awal)
                0,        -- pct_video_usage
                0,        -- avg_call_duration
                0,         -- sms_freq
                0,      -- monthly_spend
                0,          -- topup_freq
                0,        -- travel_score
                0,          -- complaint_count
                'General Offer'
            FROM users u
            WHERE u.id = %s
            ON CONFLICT (user_id) DO NOTHING
            """,
            (device_brand, plan_type, user_id),
        )

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"success": True, "message": "Profile completed"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
