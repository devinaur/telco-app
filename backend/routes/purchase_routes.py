from flask import Blueprint, request, jsonify
from models.purchase_model import process_purchase, process_topup

purchase = Blueprint("purchase", __name__)

@purchase.route("/", methods=["POST"])
def buy():
    data = request.json
    user_id = data.get("user_id")
    
    if not user_id:
        user_id_header = request.headers.get('X-User-ID')
        if user_id_header and user_id_header != 'null':
            user_id = user_id_header

    product_id = data.get("product_id")

    if not user_id or not product_id:
        return jsonify({"error": "User ID dan Product ID wajib diisi"}), 400

    result = process_purchase(int(user_id), product_id)
    
    return jsonify(result), (200 if result["success"] else 400)

@purchase.route("/topup", methods=["POST"])
def topup():
    user_id = request.headers.get('X-User-ID')
    
    if not user_id or user_id == 'null':
        return jsonify({"success": False, "message": "Akses ditolak: Login diperlukan"}), 401

    data = request.json
    amount = data.get("amount")
    method = data.get("method")

    if not amount or not method:
        return jsonify({"success": False, "message": "Data nominal dan metode diperlukan"}), 400

    result = process_topup(int(user_id), int(amount), method)
    
    return jsonify(result), (200 if result["success"] else 400)