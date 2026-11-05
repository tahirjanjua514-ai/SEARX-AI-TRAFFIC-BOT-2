"""
Automation and QA Engine for SEARX AI TRAFFIC BOT.
Coordinates authorized scheduled tasks, uptime pings, QA form checks, and screenshot captures.
"""

from __future__ import annotations
import asyncio
import time
from typing import Any, Callable, Dict, List
from app.core.logger import logger
from app.database.db_manager import DatabaseManager
from app.websites.manager import WebsiteManager


class AutomationEngine:
    """Automates routine website health, loading speed checks, and QA diagnostics."""

    def __init__(self, db_manager: DatabaseManager, website_manager: WebsiteManager):
        self.db = db_manager
        self.websites = website_manager
        self.is_running = False

    async def run_full_diagnostic_cycle(self) -> Dict[str, Any]:
        """Runs a complete diagnostic cycle across all registered websites."""
        all_sites = self.websites.list_websites()
        results: List[Dict[str, Any]] = []
        start_time = time.time()

        for site in all_sites:
            check_res = self.websites.check_website_health(site["id"])
            results.append({
                "website_id": site["id"],
                "domain": site["domain"],
                "status": "healthy" if check_res["success"] else "unhealthy",
                "latency_ms": check_res["latency_ms"],
                "error": check_res.get("error", ""),
            })
            await asyncio.sleep(0.1)

        total_duration = round(time.time() - start_time, 2)
        healthy_count = sum(1 for r in results if r["status"] == "healthy")

        # Log task execution in database
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO task_logs (task_type, target, status, details, execution_time_ms)
                VALUES ('AUTOMATION_CYCLE', ?, 'COMPLETED', ?, ?)
            """, (
                f"{len(all_sites)} websites",
                f"{healthy_count}/{len(all_sites)} healthy",
                int(total_duration * 1000),
            ))
            conn.commit()

        logger.info("Automation cycle completed for %d websites in %ss", len(all_sites), total_duration)
        return {
            "total_sites": len(all_sites),
            "healthy": healthy_count,
            "failed": len(all_sites) - healthy_count,
            "duration_seconds": total_duration,
            "details": results,
        }
