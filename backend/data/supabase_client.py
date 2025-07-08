# /backend/db/supabase_client.py
import os
from supabase import create_client, Client
from typing import Optional

# Get environment variables
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

# Create Supabase client singleton
_supabase_client: Optional[Client] = None

def get_supabase_client() -> Optional[Client]:
    """Get or create Supabase client singleton"""
    global _supabase_client
    
    if _supabase_client is None:
        if SUPABASE_URL and SUPABASE_SERVICE_KEY:
            try:
                _supabase_client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
                print("✅ Supabase client initialized successfully")
            except Exception as e:
                print(f"❌ Failed to initialize Supabase client: {str(e)}")
                return None
        else:
            print("⚠️  Supabase not configured - running in development mode")
            return None
    
    return _supabase_client

# Export the client
supabase = get_supabase_client()