"""
Reporting Engine for SEARX AI TRAFFIC BOT.
Generates CSV, JSON, and PDF/HTML summary reports for proxies, websites, traffic, and security audits.
"""

from __future__ import annotations
import csv
import json
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List
from app.core.logger import logger
from app.database.db_manager import DatabaseManager


class ReportGenerator:
    """Generates structured report exports in CSV, JSON, and printable formats."""

    def __init__(self, db_manager: DatabaseManager, export_dir: str = "exports"):
        self.db = db_manager
        base_dir = Path(__file__).resolve().parent.parent.parent
        self.export_dir = base_dir / export_dir
        self.export_dir.mkdir(parents=True, exist_ok=True)

    def export_websites_csv(self) -> str:
        """Exports websites database to CSV file."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        target_file = self.export_dir / f"websites_report_{timestamp}.csv"

        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM websites ORDER BY id ASC")
            rows = cursor.fetchall()

        if not rows:
            return ""

        headers = list(rows[0].keys())
        with open(target_file, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=headers)
            writer.writeheader()
            for r in rows:
                writer.writerow(dict(r))

        logger.info("Exported websites report to: %s", target_file)
        return str(target_file)

    def export_proxies_csv(self) -> str:
        """Exports proxy list with latency and health metrics to CSV."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        target_file = self.export_dir / f"proxies_report_{timestamp}.csv"

        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, address, port, protocol, auth_required, status, latency_ms, last_checked, error_message FROM proxies")
            rows = cursor.fetchall()

        if not rows:
            return ""

        headers = list(rows[0].keys())
        with open(target_file, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=headers)
            writer.writeheader()
            for r in rows:
                writer.writerow(dict(r))

        logger.info("Exported proxies report to: %s", target_file)
        return str(target_file)

    def export_executive_summary_json(self) -> str:
        """Exports consolidated executive summary JSON."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        target_file = self.export_dir / f"executive_summary_{timestamp}.json"

        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) as c FROM websites WHERE status='active'")
            active_sites = cursor.fetchone()["c"]

            cursor.execute("SELECT COUNT(*) as c FROM proxies WHERE status='active'")
            active_proxies = cursor.fetchone()["c"]

            cursor.execute("SELECT COUNT(*) as c FROM security_events")
            sec_events = cursor.fetchone()["c"]

        summary = {
            "application": "SEARX AI TRAFFIC BOT",
            "generated_at": datetime.now().isoformat(),
            "active_websites": active_sites,
            "operational_proxies": active_proxies,
            "security_incidents_logged": sec_events,
            "status": "OPERATIONAL",
        }

        with open(target_file, "w", encoding="utf-8") as f:
            json.dump(summary, f, indent=2)

        return str(target_file)
