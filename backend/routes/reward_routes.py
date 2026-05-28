from flask import Blueprint, jsonify, request
from models.reward_model import (
    get_all_rewards, 
    get_reward_by_id, 
    get_user_points, 
    redeem_reward, 
    get_rewards_by_type,
    get_redeem_history,
    get_checkin_status,
    process_daily_checkin
)

reward_bp = Blueprint("reward", __name__)

def get_current_user_id():
    user_id = request.headers.get('X-User-ID')
    if user_id and user_id != 'null':
        return int(user_id)
    return None

@reward_bp.route("/", methods=["GET"])
def all_rewards():
    rewards = get_all_rewards()
    return jsonify([dict(r) for r in rewards])

@reward_bp.route("/history", methods=["GET"])
def history():
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"error": "Akses ditolak: Login diperlukan"}), 401
        
    history_data = get_redeem_history(user_id)
    return jsonify([dict(row) for row in history_data])

@reward_bp.route("/points", methods=["GET"])
def my_points():
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"balance": 0, "error": "Akses ditolak: Login diperlukan"}), 401
        
    points = get_user_points(user_id)
    return jsonify({"balance": points})

@reward_bp.route("/redeem", methods=["POST"])
def redeem():
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"error": "Akses ditolak: Login diperlukan"}), 401
        
    data = request.json
    reward_id = data.get('reward_id')
    
    if not reward_id:
        return jsonify({"error": "ID Reward wajib diisi"}), 400
        
    result = redeem_reward(user_id, reward_id)
    return jsonify(result)

@reward_bp.route("/<int:rid>", methods=["GET"])
def detail_reward(rid):
    reward = get_reward_by_id(rid)
    if reward:
        return jsonify(dict(reward))
    return jsonify({"error": "Reward tidak ditemukan"}), 404

@reward_bp.route("/daily-status", methods=["GET"])
def daily_status():
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"error": "Akses ditolak"}), 401
    return jsonify(get_checkin_status(user_id))

@reward_bp.route("/daily-claim", methods=["POST"])
def daily_claim():
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"error": "Akses ditolak"}), 401
    return jsonify(process_daily_checkin(user_id))