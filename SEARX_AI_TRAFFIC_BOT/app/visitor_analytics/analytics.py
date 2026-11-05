"""
Human Visitor Analytics Module for SEARX AI TRAFFIC BOT.
Analyzes real human visitor traffic, engagement durations, referral distribution, and conversion rates.
Strictly non-fraudulent analytics for genuine webmasters.
"""

from __future__ import annotations
import uuid
from typing import Any, Dict, List
from app.database.db_manager import DatabaseManager


class VisitorAnalytics:
    """Processes aggregated session logs, landing page performance, and geographic reports."""

    def __init__(self, db_manager: DatabaseManager):
        self.db = db_manager

    def record_session(
        self,
        website_id: int,
        visitor_type: str,
        country: str,
        device: str,
        browser: str,
        landing_page: str,
        referrer: str,
        duration_sec: int,
        converted: bool,
    ) -> str:
        """Records a consent-based human visitor session."""
        session_id = str(uuid.uuid4())
        engagement = min(100.0, max(20.0, (duration_sec / 180.0) * 100.0))

        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO visitor_sessions 
                (website_id, session_uuid, visitor_type, country, device, browser, landing_page, referrer, engagement_score, duration_sec, converted)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                website_id,
                session_id,
                visitor_type,
                country.upper(),
                device,
                browser,
                landing_page,
                referrer,
                engagement,
                duration_sec,
                1 if converted else 0,
            ))
            conn.commit()

        return session_id

    def get_summary_metrics(self, website_id: int | None = None) -> Dict[str, Any]:
        """Calculates overarching visitor analytics."""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()

            where_clause = "WHERE website_id = ?" if website_id else ""
            params = [website_id] if website_id else []

            # Total sessions
            cursor.execute(f"SELECT COUNT(*) as total FROM visitor_sessions {where_clause}", params)
            total_sessions = cursor.fetchone()["total"]

            # New vs Returning
            cursor.execute(
                f"SELECT visitor_type, COUNT(*) as count FROM visitor_sessions {where_clause} GROUP BY visitor_type",
                params,
            )
            v_types = {r["visitor_type"]: r["count"] for r in cursor.fetchall()}

            # Conversions
            cursor.execute(
                f"SELECT COUNT(*) as convs, AVG(duration_sec) as avg_dur, AVG(engagement_score) as avg_eng FROM visitor_sessions {where_clause}",
                params,
            )
            agg = cursor.fetchone()

            # Top Countries
            cursor.execute(
                f"SELECT country, COUNT(*) as count FROM visitor_sessions {where_clause} GROUP BY country ORDER BY count DESC LIMIT 5",
                params,
            )
            top_countries = [dict(r) for r in cursor.fetchall()]

            # Top Referrers
            cursor.execute(
                f"SELECT referrer, COUNT(*) as count FROM visitor_sessions {where_clause} GROUP BY referrer ORDER BY count DESC LIMIT 5",
                params,
            )
            top_referrers = [dict(r) for r in cursor.fetchall()]

            # Devices breakdown
            cursor.execute(
                f"SELECT device, COUNT(*) as count FROM visitor_sessions {where_clause} GROUP BY device",
                params,
            )
            devices = [dict(r) for r in cursor.fetchall()]

            return {
                "total_sessions": total_sessions,
                "new_visitors": v_types.get("new", 0),
                "returning_visitors": v_types.get("returning", 0),
                "avg_duration_sec": int(agg["avg_dur"] or 0),
                "avg_engagement_score": round(float(agg["avg_eng"] or 0.0), 1),
                "total_conversions": agg["convs"] or 0,
                "conversion_rate_pct": round(
                    ((agg["convs"] or 0) / max(total_sessions, 1)) * 100.0, 2
                ),
                "top_countries": top_countries,
                "top_referrers": top_referrers,
                "devices": devices,
            }
