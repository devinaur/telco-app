from flask import Blueprint, jsonify, request
from models.product_model import (
    get_all_products,
    get_product_by_id,
    get_products_by_type,
    add_product,
    get_promo_products,
    get_last_purchased_products,
    get_recommended_products, 
    search_products_advanced,
    get_recommendations_by_ml
)

from database import get_db
import psycopg2.extras
import traceback

product = Blueprint("product", __name__)

@product.route("/", methods=["GET"])
def all_products():
    products = get_all_products()
    return jsonify([dict(p) for p in products])

@product.route("/<int:pid>", methods=["GET"])
def detail(pid):
    product_data = get_product_by_id(pid)
    if product_data:
        return jsonify(dict(product_data))
    return jsonify({"error": "Produk tidak ditemukan"}), 404

@product.route("/category/<string:type_name>", methods=["GET"])
def category(type_name):
    products = get_products_by_type(type_name)
    return jsonify([dict(p) for p in products])

@product.route("/", methods=["POST"])
def create():
    data = request.json
    add_product(data)
    return jsonify({"message": "Produk berhasil ditambahkan"})

@product.route("/promo", methods=["GET"])
def promo_products():
    products = get_promo_products()
    return jsonify([dict(p) for p in products])

@product.route("/last-purchased/<int:user_id>", methods=["GET"])
def last_purchased(user_id):
    products = get_last_purchased_products(user_id)
    return jsonify([dict(p) for p in products]) if products else jsonify([])

@product.route("/recommendation/<int:user_id>", methods=["GET"])
def recommendation(user_id):
    ml_products = []
    
    try:
        ml_products = get_recommendations_by_ml(user_id)
        
        if ml_products and len(ml_products) > 0:
            return jsonify([dict(p) for p in ml_products])
    
    except Exception as e:
        print(f"🚨 ML Recommendation FAILED for User {user_id}: {e}")
        traceback.print_exc()
    
    print(f"Fallback Random Recommendation untuk User {user_id}")
    products = get_recommended_products(user_id)
    return jsonify([dict(p) for p in products]) if products else jsonify([])

@product.route("/search", methods=["GET"])
def search():
    keyword = request.args.get("q", "")
    min_price = request.args.get("min", type=int)
    max_price = request.args.get("max", type=int)
    
    products = search_products_advanced(keyword, min_price, max_price)
    return jsonify([dict(p) for p in products])