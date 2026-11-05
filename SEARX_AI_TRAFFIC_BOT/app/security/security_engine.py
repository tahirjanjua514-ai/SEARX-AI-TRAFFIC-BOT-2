"""
Security and Anomaly Detection Engine for SEARX AI TRAFFIC BOT.
Detects traffic bursts, referral spoofing, manages encrypted secrets, and maintains audit trails.
"""

from __future__ import annotations
import base64
import os
from typing import Any, Dict, List
from app.core.logger import logger
from app.database.db_manager import DatabaseManager


class SecurityEngine:
    """Manages cybersecurity protections, anomaly detection, encryption, and audit logs."""

    def __init__(self, db_manager: DatabaseManager):
        self.db = db_manager

    @staticmethod
    def encrypt_secret(plain_text: str, key: str = "SearxBotEnterpriseSecretKey2026") -> str:
        """Lightweight XOR + Base64 obfuscation/encryption for local credentials storage."""
        if not plain_text:
            return ""
        key_bytes = key.encode("utf-8")
        text_bytes = plain_text.encode("utf-8")
        cipher_bytes = bytes([b ^ key_bytes[i % len(key_bytes)] for i, b in enumerate(text_bytes)])
        return base64.b64encode(cipher_bytes).decode("ascii")

    @staticmethod
    def decrypt_secret(cipher_text: str, key: str = "SearxBotEnterpriseSecretKey2026") -> str:
        """Decrypts stored credentials."""
        if not cipher_text:
            return ""
        try:
            cipher_bytes = base64.b64decode(cipher_text.encode("ascii"))
            key_bytes = key.encode("utf-8")
            plain_bytes = bytes([b ^ key_bytes[i % len(key_bytes)] for i, b in enumerate(cipher_bytes)])
            return plain_bytes.decode("utf-8")
        except Exception:
            return ""

    def evaluate_traffic_spike(self, current_rpm: int, baseline_rpm: int) -> Dict[str, Any]:
        """Flags traffic spikes higher than 250% over baseline."""
        if baseline_rpm <= 0:
            return {"spike_detected": False, "ratio": 1.0}

        ratio = current_rpm / baseline_rpm
        if ratio >= 2.5:
            msg = f"Traffic spike alert: Current rate ({current_rpm} req/min) is {round(ratio, 1)}x baseline ({baseline_rpm} req/min)."
            self.log_security_event(
                event_type="TRAFFIC_SPIKE_DETECTED",
                severity="medium",
                description=msg,
                rule="SPIKE_RATE_THRESHOLD_250",
            )
            return {"spike_detected": True, "ratio": round(ratio, 1), "alert": msg}

        return {"spike_detected": False, "ratio": round(ratio, 1)}

    def log_security_event(
        self,
        event_type: str,
        severity: str,
        description: str,
        rule: str,
        ip_address: str = "127.0.0.1",
    ) -> int:
        """Stores a security event in the database."""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO security_events (event_type, severity, description, ip_address, triggered_rule)
                VALUES (?, ?, ?, ?, ?)
            """, (event_type, severity, description, ip_address, rule))
            conn.commit()
            event_id = cursor.lastrowid

        logger.warning("Security Event [%s / %s]: %s", severity.upper(), event_type, description)
        return event_id

    def list_security_events(self, limit: int = 50) -> List[Dict[str, Any]]:
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM security_events ORDER BY id DESC LIMIT ?", (limit,))
            return [dict(r) for r in cursor.fetchall()]

    def resolve_event(self, event_id: int) -> bool:
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("UPDATE security_events SET resolved = 1 WHERE id = ?", (event_id,))
            conn.commit()
            return cursor.rowcount > 0
