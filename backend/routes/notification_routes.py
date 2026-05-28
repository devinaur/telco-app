from flask import Blueprint, jsonify, request
from models.notification_model import get_notifications, mark_all_read, check_and_create_promo

notification_bp = Blueprint("notification", __name__)

@notification_bp.route("/", methods=["GET"])
def get_user_notifs():
    user_id = request.headers.get('X-User-ID')
    
    if not user_id or user_id == 'null':
        return jsonify([])

    check_and_create_promo(user_id)

    data = get_notifications(user_id)
    
    unread_count = sum(1 for n in data if not n['is_read'])

    return jsonify({
        "notifications": [dict(n) for n in data],
        "unread_count": unread_count
    })

@notification_bp.route("/mark-read", methods=["POST"])
def mark_read():
    user_id = request.headers.get('X-User-ID')
    if not user_id or user_id == 'null':
        return jsonify({"error": "Unauthorized"}), 401

    success = mark_all_read(user_id)
    return jsonify({"success": success})