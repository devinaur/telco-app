from flask import Blueprint, request, jsonify
from models.ml_model import (
    update_user_data_usage,
    update_video_usage,
    update_call_duration,
    update_sms_frequency,
    update_travel_score
)
from models.simulation_model import simulate_user_profile_update

simulation = Blueprint("simulation", __name__)

@simulation.route("/increase-data", methods=["POST"])
def sim_data():
    body = request.json
    user_id = body.get("user_id")
    return jsonify(update_user_data_usage(user_id, 0.5))

@simulation.route("/increase-video", methods=["POST"])
def sim_video():
    body = request.json
    user_id = body.get("user_id")
    return jsonify(update_video_usage(user_id, 0.05))

@simulation.route("/increase-call", methods=["POST"])
def sim_call():
    body = request.json
    user_id = body.get("user_id")
    return jsonify(update_call_duration(user_id, 1.0))

@simulation.route("/increase-sms", methods=["POST"])
def sim_sms():
    body = request.json
    user_id = body.get("user_id")
    return jsonify(update_sms_frequency(user_id, 1))

@simulation.route("/increase-travel", methods=["POST"])
def sim_travel():
    body = request.json
    user_id = body.get("user_id")
    return jsonify(update_travel_score(user_id, 0.05))

@simulation.route("/update-profile", methods=["POST"])
def update_profile():
    data = request.json
    user_id = data.get("user_id")
    
    if not user_id:
        return jsonify({"error": "User ID wajib diisi"}), 400

    result = simulate_user_profile_update(user_id, data)
    
    if result.get("error"):
        return jsonify(result), 500
        
    return jsonify(result)