"""
Website Manager Module for SEARX AI TRAFFIC BOT.
Handles registration, validation, bulk import, uptime checks, and SSL verification.
"""

from __future__ import annotations
import re
import socket
import ssl
import time
import urllib.parse
import urllib.request
from typing import Any, Dict, List, Optional, Tuple
from app.core.logger import logger
from app.database.db_manager import DatabaseManager


class WebsiteManager:
    """Manages website targets, validation, health metrics, and domain limits."""

    def __init__(self, db_manager: DatabaseManager):
        self.db = db_manager

    @staticmethod
    def validate_url(url: str) -> Tuple[bool, str, str]:
        """Validates URL format and extracts clean URL and domain."""
        if not url:
            return False, "", "URL cannot be empty."

        clean_url = url.strip()
        if not clean_url.startswith(("http://", "https://")):
            clean_url = "https://" + clean_url

        parsed = urllib.parse.urlparse(clean_url)
        domain = parsed.netloc.lower()
        if not domain or "." not in domain or len(domain) < 4:
            return False, "", f"Invalid domain name: '{domain}'"

        return True, clean_url, domain

    def add_website(
        self, url: str, category: str = "General", notes: str = ""
    ) -> Tuple[bool, str, Optional[Dict[str, Any]]]:
        """Adds a new verified website to the database."""
        valid, clean_url, domain_or_err = self.validate_url(url)
        if not valid:
            return False, domain_or_err, None

        domain = domain_or_err

        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM websites WHERE url = ? OR domain = ?", (clean_url, domain))
            if cursor.fetchone():
                return False, f"Website '{domain}' is already registered.", None

            cursor.execute("""
                INSERT INTO websites (url, domain, category, status, notes)
                VALUES (?, ?, ?, 'active', ?)
            """, (clean_url, domain, category, notes))
            conn.commit()
            website_id = cursor.lastrowid

        logger.info("Registered new website: %s (ID: %s)", clean_url, website_id)
        return True, "Website added successfully.", {"id": website_id, "url": clean_url, "domain": domain}

    def bulk_import(self, urls_text: str, default_category: str = "Imported") -> Dict[str, Any]:
        """Bulk imports websites from multi-line text or CSV string."""
        lines = [line.strip() for line in urls_text.splitlines() if line.strip()]
        imported = 0
        skipped = 0
        errors: List[str] = []

        for line in lines:
            # support comma-separated or space-separated format
            url_part = line.split(",")[0].strip()
            success, msg, _ = self.add_website(url_part, category=default_category)
            if success:
                imported += 1
            else:
                skipped += 1
                errors.append(f"{url_part}: {msg}")

        return {"total": len(lines), "imported": imported, "skipped": skipped, "errors": errors}

    def list_websites(self, search: str = "", category: str = "") -> List[Dict[str, Any]]:
        """Lists registered websites with optional filtering."""
        query = "SELECT * FROM websites WHERE 1=1"
        params: List[Any] = []

        if search:
            query += " AND (url LIKE ? OR domain LIKE ? OR notes LIKE ?)"
            s_param = f"%{search}%"
            params.extend([s_param, s_param, s_param])

        if category and category != "All":
            query += " AND category = ?"
            params.append(category)

        query += " ORDER BY id DESC"

        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

    def delete_website(self, website_id: int) -> bool:
        """Deletes a website by ID."""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM websites WHERE id = ?", (website_id,))
            conn.commit()
            logger.info("Deleted website ID: %s", website_id)
            return cursor.rowcount > 0

    def check_website_health(self, website_id: int) -> Dict[str, Any]:
        """Performs real HTTP response time and SSL check."""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM websites WHERE id = ?", (website_id,))
            row = cursor.fetchone()
            if not row:
                return {"success": False, "error": "Website not found."}
            website = dict(row)

        url = website["url"]
        domain = website["domain"]

        start_time = time.time()
        ssl_valid = 1
        ssl_expiry = ""
        status_code = 0
        error_msg = ""

        # SSL Inspection
        if url.startswith("https://"):
            try:
                ctx = ssl.create_default_context()
                with socket.create_connection((domain, 443), timeout=5) as sock:
                    with ctx.wrap_socket(sock, server_hostname=domain) as ssock:
                        cert = ssock.getpeercert()
                        if cert and "notAfter" in cert:
                            ssl_expiry = str(cert["notAfter"])
            except Exception as e:
                ssl_valid = 0
                error_msg = f"SSL error: {str(e)}"

        # HTTP Ping
        try:
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SEARX-Bot/1.0"},
            )
            with urllib.request.urlopen(req, timeout=8) as response:
                status_code = response.getcode()
                latency_ms = int((time.time() - start_time) * 1000)
        except Exception as e:
            latency_ms = int((time.time() - start_time) * 1000)
            status_code = 0
            if not error_msg:
                error_msg = str(e)

        is_healthy = status_code in (200, 204, 301, 302)
        new_status = "active" if is_healthy else "degraded"

        # Update database record
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE websites
                SET status = ?, last_response_time_ms = ?, ssl_valid = ?, ssl_expires = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            """, (new_status, latency_ms, ssl_valid, ssl_expiry, website_id))
            conn.commit()

        return {
            "success": is_healthy,
            "status_code": status_code,
            "latency_ms": latency_ms,
            "ssl_valid": ssl_valid == 1,
            "ssl_expires": ssl_expiry,
            "error": error_msg,
        }
