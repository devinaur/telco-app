from flask import Flask
from flask_cors import CORS
from routes.product_routes import product
from routes.reward_routes import reward_bp
from routes.auth_routes import auth_bp
from routes.user_routes import user
from routes.purchase_routes import purchase
from routes.notification_routes import notification_bp
from routes.simulation_routes import simulation
import os

app = Flask(__name__)


CORS(app, supports_credentials=True, resources={
    r"/*": {
        "origins": "*",
        "allow_headers": ["Content-Type", "X-User-ID"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }
})

app.register_blueprint(product, url_prefix="/api/products")
app.register_blueprint(reward_bp, url_prefix="/api/rewards")
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(user, url_prefix="/api/user")
app.register_blueprint(purchase, url_prefix="/api/purchase")
app.register_blueprint(notification_bp, url_prefix="/api/notifications")
app.register_blueprint(simulation, url_prefix="/api/simulation")


@app.route("/")
def home():
    return {"message": "API RUNNING"}


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
