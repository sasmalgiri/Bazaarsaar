"""
BazaarSaar - NSE/Yahoo Finance Data Ingestion

Usage:
    python nse_ingest.py full   # Full ingestion of NIFTY 50 + Bank Nifty
    python nse_ingest.py live   # Update live prices only
"""
import sys
import time
import logging
from datetime import datetime

import yfinance as yf
import pandas as pd

from config import (
    NIFTY_50,
    BANK_NIFTY,
    BATCH_SIZE,
    MAX_RETRIES,
    RETRY_DELAY,
    get_supabase_client,
)

logger = logging.getLogger("bazaarsaar.ingest")


def get_all_symbols() -> list[str]:
    """Get deduplicated list of all tracked symbols."""
    return list(set(NIFTY_50 + BANK_NIFTY))


def fetch_stock_data(symbols: list[str]) -> pd.DataFrame:
    """Fetch stock data from Yahoo Finance for given symbols."""
    # Yahoo Finance uses .NS suffix for NSE stocks
    yf_symbols = [f"{s}.NS" for s in symbols]
    tickers = yf.Tickers(" ".join(yf_symbols))

    rows = []
    for symbol, yf_symbol in zip(symbols, yf_symbols):
        for attempt in range(MAX_RETRIES):
            try:
                ticker = tickers.tickers.get(yf_symbol)
                if not ticker:
                    logger.warning(f"Ticker not found: {yf_symbol}")
                    break

                info = ticker.info
                rows.append({
                    "symbol": symbol,
                    "name": info.get("longName", info.get("shortName", symbol)),
                    "exchange": "NSE",
                    "sector": info.get("sector"),
                    "industry": info.get("industry"),
                    "ltp": info.get("currentPrice", info.get("regularMarketPrice", 0)),
                    "change": info.get("regularMarketChange", 0),
                    "change_percent": info.get("regularMarketChangePercent", 0),
                    "open": info.get("regularMarketOpen", 0),
                    "high": info.get("regularMarketDayHigh", 0),
                    "low": info.get("regularMarketDayLow", 0),
                    "close": info.get("regularMarketPreviousClose", 0),
                    "volume": info.get("regularMarketVolume", 0),
                    "market_cap": info.get("marketCap", 0),
                    "high_52w": info.get("fiftyTwoWeekHigh", 0),
                    "low_52w": info.get("fiftyTwoWeekLow", 0),
                    "pe_ratio": info.get("trailingPE"),
                    "pb_ratio": info.get("priceToBook"),
                    "dividend_yield": info.get("dividendYield", 0) * 100 if info.get("dividendYield") else None,
                    "roe": info.get("returnOnEquity", 0) * 100 if info.get("returnOnEquity") else None,
                    "promoter_holding": None,  # Not available via Yahoo
                    "updated_at": datetime.utcnow().isoformat(),
                })
                break  # Success
            except Exception as e:
                logger.warning(f"Attempt {attempt + 1} failed for {symbol}: {e}")
                if attempt < MAX_RETRIES - 1:
                    time.sleep(RETRY_DELAY)

    return pd.DataFrame(rows)


def upsert_stocks(df: pd.DataFrame) -> int:
    """Upsert stock data to Supabase."""
    if df.empty:
        return 0

    supabase = get_supabase_client()
    records = df.where(pd.notnull(df), None).to_dict("records")

    count = 0
    for i in range(0, len(records), BATCH_SIZE):
        batch = records[i : i + BATCH_SIZE]
        supabase.table("stocks").upsert(batch).execute()
        count += len(batch)
        logger.info(f"Upserted batch {i // BATCH_SIZE + 1}: {len(batch)} records")

    return count


def ingest_full() -> dict:
    """Full ingestion: fetch all stock data and upsert to DB."""
    symbols = get_all_symbols()
    logger.info(f"Full ingestion: {len(symbols)} symbols")

    df = fetch_stock_data(symbols)
    count = upsert_stocks(df)

    return {"mode": "full", "symbols": len(symbols), "upserted": count}


def ingest_live() -> dict:
    """Live update: fetch current prices only."""
    symbols = get_all_symbols()
    logger.info(f"Live update: {len(symbols)} symbols")

    df = fetch_stock_data(symbols)
    count = upsert_stocks(df)

    return {"mode": "live", "symbols": len(symbols), "updated": count}


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

    mode = sys.argv[1] if len(sys.argv) > 1 else "full"

    if mode == "full":
        result = ingest_full()
    elif mode == "live":
        result = ingest_live()
    else:
        print(f"Usage: python nse_ingest.py [full|live]")
        sys.exit(1)

    print(f"Result: {result}")
