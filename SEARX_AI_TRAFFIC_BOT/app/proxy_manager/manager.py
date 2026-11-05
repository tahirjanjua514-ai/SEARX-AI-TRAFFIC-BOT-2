"""
Proxy Manager Module for SEARX AI TRAFFIC BOT.
Maintains proxy pool, handles TXT/CSV import/export, duplicates, health scoring.
"""

from __future__ import annotations
import re
from typing import Any, Dict, List, Optional, Tuple
from app.core.logger import logger
from app.database.db_manager import DatabaseManager
from app.proxy_manager.checker import ProxyChecker


class ProxyManager:
    """Orchestrates proxy inventory, diagnostics, imports, and exports."""

    def __init__(self, db_manager: DatabaseManager):
        self.db = db_manager
        self.checker = ProxyChecker()

    @staticmethod
    def parse_proxy_line(line: str) -> Optional[Dict[str, Any]]:
        """
        Parses common formats:
        - ip:port
        - ip:port:user:pass
        - protocol://user:pass@ip:port
        - protocol://ip:port
        """
        raw = line.strip()
        if not raw or raw.startswith("#"):
            return None

        protocol = "http"
        user = ""
        pwd = ""

        # Check for URL scheme
        if "://" in raw:
            parts = raw.split("://", 1)
            protocol = parts[0].lower()
            raw = parts[1]

        # Check for user:pass@ip:port
        if "@" in raw:
            auth_part, host_part = raw.split("@", 1)
            if ":" in auth_part:
                user, pwd = auth_part.split(":", 1)
            raw = host_part

        tokens = raw.split(":")
        if len(tokens) == 2:
            ip, port_str = tokens
        elif len(tokens) == 4:
            ip, port_str, user, pwd = tokens
        else:
            return None

        try:
            port = int(port_str)
            if not (1 <= port <= 65535):
                return None
        except ValueError:
            return None

        if protocol not in ("http", "https", "socks5"):
            protocol = "http"

        return {
            "address": ip.strip(),
            "port": port,
            "protocol": protocol,
            "username": user.strip(),
            "password": pwd.strip(),
            "auth_required": 1 if user else 0,
        }

    def add_proxy(
        self,
        address: str,
        port: int,
        protocol: str = "http",
        username: str = "",
        password: str = "",
    ) -> Tuple[bool, str]:
        """Adds a proxy manually."""
        protocol = protocol.lower()
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT id FROM proxies WHERE address = ? AND port = ? AND protocol = ?",
                (address, port, protocol),
            )
            if cursor.fetchone():
                return False, f"Proxy {address}:{port} ({protocol}) already exists."

            cursor.execute("""
                INSERT INTO proxies (address, port, protocol, username, password, auth_required, status)
                VALUES (?, ?, ?, ?, ?, ?, 'untested')
            """, (address, port, protocol, username, password, 1 if username else 0))
            conn.commit()

        logger.info("Added proxy: %s:%s [%s]", address, port, protocol)
        return True, "Proxy added successfully."

    def import_from_text(self, text_content: str, default_protocol: str = "http") -> Dict[str, Any]:
        """Imports proxies from multi-line text (TXT or CSV format)."""
        lines = [line.strip() for line in text_content.splitlines() if line.strip()]
        imported = 0
        duplicates = 0
        invalid = 0

        for line in lines:
            parsed = self.parse_proxy_line(line)
            if not parsed:
                invalid += 1
                continue

            if not parsed.get("protocol") or parsed["protocol"] == "http":
                parsed["protocol"] = default_protocol

            success, _ = self.add_proxy(
                address=parsed["address"],
                port=parsed["port"],
                protocol=parsed["protocol"],
                username=parsed.get("username", ""),
                password=parsed.get("password", ""),
            )
            if success:
                imported += 1
            else:
                duplicates += 1

        return {
            "total_lines": len(lines),
            "imported": imported,
            "duplicates": duplicates,
            "invalid": invalid,
        }

    def list_proxies(
        self, search: str = "", status: str = "", protocol: str = ""
    ) -> List[Dict[str, Any]]:
        """Returns filtered proxy list."""
        query = "SELECT * FROM proxies WHERE 1=1"
        params: List[Any] = []

        if search:
            query += " AND (address LIKE ? OR error_message LIKE ?)"
            s_param = f"%{search}%"
            params.extend([s_param, s_param])

        if status and status != "All":
            query += " AND status = ?"
            params.append(status)

        if protocol and protocol != "All":
            query += " AND protocol = ?"
            params.append(protocol.lower())

        query += " ORDER BY id DESC"

        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            return [dict(row) for row in cursor.fetchall()]

    def check_proxy(self, proxy_id: int) -> Dict[str, Any]:
        """Checks a specific proxy and updates database metrics."""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM proxies WHERE id = ?", (proxy_id,))
            row = cursor.fetchone()
            if not row:
                return {"success": False, "error": "Proxy not found"}
            proxy = dict(row)

        res = self.checker.test_proxy(
            address=proxy["address"],
            port=proxy["port"],
            protocol=proxy["protocol"],
            username=proxy["username"],
            password=proxy["password"],
        )

        new_status = res["status"]
        fail_inc = 0 if res["success"] else 1

        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE proxies
                SET status = ?, latency_ms = ?, fail_count = fail_count + ?, error_message = ?, last_checked = CURRENT_TIMESTAMP
                WHERE id = ?
            """, (new_status, res["latency_ms"], fail_inc, res["error"], proxy_id))
            conn.commit()

        return res

    def delete_proxy(self, proxy_id: int) -> bool:
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM proxies WHERE id = ?", (proxy_id,))
            conn.commit()
            return cursor.rowcount > 0

    def export_proxies_txt(self, status_filter: str = "") -> str:
        """Exports proxies to IP:PORT:USER:PASS or IP:PORT format."""
        proxies = self.list_proxies(status=status_filter)
        lines = []
        for p in proxies:
            if p["username"] and p["password"]:
                lines.append(f"{p['protocol']}://{p['username']}:{p['password']}@{p['address']}:{p['port']}")
            else:
                lines.append(f"{p['protocol']}://{p['address']}:{p['port']}")
        return "\n".join(lines)
