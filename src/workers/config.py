"""
BazaarSaar - Data Pipeline Configuration
"""
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

# Supabase
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

# Market Hours (IST)
MARKET_OPEN_HOUR = 9
MARKET_OPEN_MINUTE = 15
MARKET_CLOSE_HOUR = 15
MARKET_CLOSE_MINUTE = 30
TIMEZONE = "Asia/Kolkata"

# Batch Sizes
BATCH_SIZE = 50
MAX_RETRIES = 3
RETRY_DELAY = 5  # seconds

# NIFTY 50 Constituents
NIFTY_50 = [
    "RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK",
    "BHARTIARTL", "ITC", "SBIN", "LICI", "LT",
    "KOTAKBANK", "HINDUNILVR", "BAJFINANCE", "HCLTECH", "MARUTI",
    "AXISBANK", "TITAN", "SUNPHARMA", "WIPRO", "TATAMOTORS",
    "NTPC", "ULTRACEMCO", "ONGC", "BAJAJFINSV", "ASIANPAINT",
    "TATASTEEL", "POWERGRID", "NESTLEIND", "JSWSTEEL", "ADANIENT",
    "ADANIPORTS", "COALINDIA", "M&M", "LTIM", "TECHM",
    "BAJAJ-AUTO", "INDUSINDBK", "GRASIM", "CIPLA", "EICHERMOT",
    "DIVISLAB", "TATACONSUM", "SBILIFE", "BPCL", "APOLLOHOSP",
    "HEROMOTOCO", "DRREDDY", "BRITANNIA", "HDFCLIFE", "BEL",
]

BANK_NIFTY = [
    "HDFCBANK", "ICICIBANK", "SBIN", "KOTAKBANK", "AXISBANK",
    "INDUSINDBK", "BANKBARODA", "PNB", "IDFCFIRSTB", "FEDERALBNK",
    "BANDHANBNK", "AUBANK",
]


def get_supabase_client() -> Client:
    """Get authenticated Supabase client."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase credentials not configured")
    return create_client(SUPABASE_URL, SUPABASE_KEY)
