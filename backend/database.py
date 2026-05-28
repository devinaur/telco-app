import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv

load_dotenv()

def get_db():
    db_url = os.getenv("DATABASE_URL")
    
    connection_kwargs = {
        "cursor_factory": psycopg2.extras.RealDictCursor
    }

    if "localhost" not in db_url and "127.0.0.1" not in db_url:
        connection_kwargs["sslmode"] = "require"

    return psycopg2.connect(db_url, **connection_kwargs)