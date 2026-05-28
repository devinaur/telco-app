from database import get_db

try:
    conn = get_db()
    print("SUCCESS: Connected!")
    conn.close()
except Exception as e:
    print("ERROR:", e)
