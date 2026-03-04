"""
BazaarSaar - Data Pipeline Scheduler
Usage:
    python main.py             # Start scheduler
    python main.py --run-now   # Run immediately then start scheduler
"""
import sys
import logging
from datetime import datetime
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger
from config import TIMEZONE

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("bazaarsaar")


def run_full_ingest():
    """Run full data ingestion (daily, before market open)."""
    logger.info("Starting full data ingestion...")
    try:
        from nse_ingest import ingest_full
        result = ingest_full()
        logger.info(f"Full ingestion complete: {result}")
    except Exception as e:
        logger.error(f"Full ingestion failed: {e}")


def run_live_update():
    """Run live price update (every 5 min during market hours)."""
    logger.info("Starting live price update...")
    try:
        from nse_ingest import ingest_live
        result = ingest_live()
        logger.info(f"Live update complete: {result}")
    except Exception as e:
        logger.error(f"Live update failed: {e}")


def main():
    run_now = "--run-now" in sys.argv

    if run_now:
        logger.info("Running immediate catch-up ingestion...")
        run_full_ingest()

    scheduler = BlockingScheduler(timezone=TIMEZONE)

    # Full ingest daily at 6:00 AM IST (before market opens)
    scheduler.add_job(
        run_full_ingest,
        CronTrigger(hour=6, minute=0, timezone=TIMEZONE),
        id="full_ingest",
        name="Daily Full Ingestion",
    )

    # Live updates every 5 min, Mon-Fri, 9:15 AM - 3:35 PM IST
    scheduler.add_job(
        run_live_update,
        CronTrigger(
            day_of_week="mon-fri",
            hour="9-15",
            minute="*/5",
            timezone=TIMEZONE,
        ),
        id="live_update",
        name="Live Price Update",
    )

    logger.info("BazaarSaar Data Pipeline started")
    logger.info(f"  Full ingest: Daily at 06:00 IST")
    logger.info(f"  Live update: Mon-Fri, every 5 min during market hours")

    try:
        scheduler.start()
    except KeyboardInterrupt:
        logger.info("Scheduler stopped.")


if __name__ == "__main__":
    main()
