from flask import Blueprint, jsonify, request
from database import get_db
import psycopg2.extras
import re
import bcrypt
import random
from datetime import datetime, timedelta
from models.user_model import create_user, verify_user_status, update_user_password, delete_user_permanently
from utils.email_service import send_otp_email

auth_bp = Blueprint("auth", __name__)

def normalize_phone_login(phone_input):
    clean_phone = re.sub(r'\D', '', phone_input)
    if clean_phone.startswith('0'): return '62' + clean_phone[1:]
    elif clean_phone.startswith('8'): return '62' + clean_phone
    elif clean_phone.startswith('62'): return clean_phone
    return None

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    login_id = data.get("email")
    password = data.get("password")

    if not login_id or not password:
        return jsonify({"error": "Email/Nomor HP dan password wajib diisi"}), 400

    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    if "@" in login_id:
        if not re.match(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", login_id):
            cur.close()
            conn.close()
            return jsonify({"error": "Format email tidak valid"}), 400
        query = "SELECT id, name, email, customer_id, password FROM users WHERE email = %s"
        params = (login_id,)
    else:
        normalized_phone = normalize_phone_login(login_id)
        if not normalized_phone:
             cur.close(); conn.close()
             return jsonify({"error": "Format Nomor HP tidak dikenali"}), 400
        query = "SELECT id, name, email, customer_id, password FROM users WHERE phone = %s"
        params = (normalized_phone,)

    try:
        cur.execute(query, params)
        user = cur.fetchone()
    except Exception as e:
        conn.rollback(); cur.close(); conn.close()
        return jsonify({"error": "Terjadi kesalahan server"}), 500 

    cur.close()
    conn.close()

    if user:
        if user['password']:
            stored_password_hash = user['password'].encode('utf-8')
            input_password = password.encode('utf-8')
            if bcrypt.checkpw(input_password, stored_password_hash):
                return jsonify({"success": True, "user": {"id": user['id'], "name": user['name'], "email": user['email'], "customer_id": user['customer_id']}})
    
    return jsonify({"error": "Email/Nomor HP atau password salah"}), 401

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')

    if not name or not email or not phone:
        return jsonify({"error": "Semua kolom wajib diisi"}), 400

    if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
        return jsonify({"error": "Format email tidak valid"}), 400

    if phone.strip().startswith('0'):
        return jsonify({"error": "Untuk registrasi, nomor HP tidak boleh diawali angka 0. Gunakan format 8xx."}), 400

    clean_phone = re.sub(r'\D', '', phone)
    final_phone = ""
    if clean_phone.startswith('62'): final_phone = clean_phone
    elif clean_phone.startswith('8'): final_phone = '62' + clean_phone
    else: return jsonify({"error": "Format Nomor HP tidak valid"}), 400

    if len(final_phone) < 10 or len(final_phone) > 15:
        return jsonify({"error": "Panjang nomor HP tidak valid"}), 400
    
    data['phone'] = final_phone

    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    cur.execute("SELECT id, is_verified FROM users WHERE email = %s", (email,))
    existing_user = cur.fetchone()
    
    if existing_user:
        cur.close()
        conn.close()
        
        if existing_user['is_verified']:
            return jsonify({"error": "Email sudah terdaftar dan aktif"}), 400
        else:
            return jsonify({
                "success": True, 
                "message": "Akun sudah ada, silakan verifikasi.", 
                "email": email,
                "is_existing": True 
            })

    if not data.get('customer_id'):
        data['customer_id'] = f"CUST-{random.randint(10000, 99999)}"
        
    if not cur.closed: cur.close(); conn.close()
    
    user_id = create_user(data)
    
    conn = get_db()
    cur = conn.cursor()

    if not user_id:
        if not cur.closed: cur.close(); conn.close()
        return jsonify({"error": "Gagal memproses data user"}), 500

    otp_code = str(random.randint(1000, 9999))
    expires_at = datetime.now() + timedelta(minutes=5)

    cur.execute("INSERT INTO user_otps (user_id, otp_code, expires_at, purpose) VALUES (%s, %s, %s, 'register')", (user_id, otp_code, expires_at))
    conn.commit()
    cur.close()
    conn.close()

    send_otp_email(data['email'], otp_code)

    return jsonify({"success": True, "message": "OTP terkirim ke email", "email": data['email']})

@auth_bp.route("/resend-otp", methods=["POST"])
def resend_otp():
    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email diperlukan"}), 400

    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    cur.execute("SELECT id, is_verified FROM users WHERE email = %s", (email,))
    user = cur.fetchone()

    if not user:
        cur.close(); conn.close()
        return jsonify({"error": "User tidak ditemukan"}), 404
    
    if user['is_verified']:
        cur.close(); conn.close()
        return jsonify({"error": "Akun sudah terverifikasi, silakan login."}), 400

    otp_code = str(random.randint(1000, 9999))
    expires_at = datetime.now() + timedelta(minutes=5)

    cur.execute("""
        INSERT INTO user_otps (user_id, otp_code, expires_at, purpose)
        VALUES (%s, %s, %s, 'register')
    """, (user['id'], otp_code, expires_at))
    
    conn.commit()
    cur.close()
    conn.close()

    send_success = send_otp_email(email, otp_code)

    if send_success:
        return jsonify({"success": True, "message": "Kode OTP baru telah dikirim."})
    else:
        return jsonify({"error": "Gagal mengirim email OTP"}), 500

@auth_bp.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.json
    email = data.get("email")
    otp_input = data.get("otp")

    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    cur.execute("SELECT id FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    
    if not user:
        return jsonify({"error": "User tidak ditemukan"}), 404

    cur.execute("""
        SELECT * FROM user_otps 
        WHERE user_id = %s AND otp_code = %s AND is_used = FALSE AND expires_at > NOW()
        ORDER BY created_at DESC LIMIT 1
    """, (user['id'], otp_input))
    
    otp_record = cur.fetchone()

    if otp_record:
        verify_user_status(user['id'])
        cur.execute("UPDATE user_otps SET is_used = TRUE WHERE id = %s", (otp_record['id'],))
        conn.commit()
        cur.close(); conn.close()
        return jsonify({"success": True, "message": "Verifikasi berhasil!"})
    else:
        cur.execute("SELECT * FROM user_otps WHERE user_id = %s AND otp_code = %s AND expires_at <= NOW()", (user['id'], otp_input))
        expired_otp = cur.fetchone()
        cur.close(); conn.close()
        
        if expired_otp:
            return jsonify({"error": "Kode OTP sudah kedaluwarsa. Silakan minta kode baru."}), 400
        else:
            return jsonify({"error": "Kode OTP salah."}), 400

@auth_bp.route("/complete-registration", methods=["POST"])
def complete_registration():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    if not email or not password:
        return jsonify({"error": "Data tidak lengkap"}), 400
    
    if password != confirm_password:
        return jsonify({"error": "Konfirmasi password tidak cocok"}), 400
        
    if len(password) < 6:
        return jsonify({"error": "Password minimal 6 karakter"}), 400

    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT is_verified FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close(); conn.close()

    if not user:
        return jsonify({"error": "User tidak ditemukan"}), 404
        
    success = update_user_password(email, password)
    
    if success:
        conn = get_db()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        user_data = cur.fetchone()
        cur.close(); conn.close()

        return jsonify({
        "success": True,
        "message": "Registrasi Selesai!",
        "user_id": user_data["id"]
    })
    else:
         return jsonify({"error": "Gagal menyimpan password"}), 500