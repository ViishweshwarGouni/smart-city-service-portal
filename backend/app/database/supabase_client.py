import os
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client, Client


# ===============================
# Load .env from backend folder
# ===============================

BASE_DIR = Path(__file__).resolve().parents[2]

ENV_PATH = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_PATH)


# ===============================
# Supabase Credentials
# ===============================

SUPABASE_URL = os.getenv("SUPABASE_URL")

SUPABASE_KEY = os.getenv("SUPABASE_KEY")


# ===============================
# Validate Environment Variables
# ===============================

if SUPABASE_URL is None:
    raise Exception(
        "SUPABASE_URL not found. Check backend/.env"
    )


if SUPABASE_KEY is None:
    raise Exception(
        "SUPABASE_KEY not found. Check backend/.env"
    )


# remove accidental spaces/new lines
SUPABASE_URL = SUPABASE_URL.strip()

SUPABASE_KEY = SUPABASE_KEY.strip()


# ===============================
# Create Supabase Client
# ===============================

supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)


print(
    "Supabase connected successfully"
)