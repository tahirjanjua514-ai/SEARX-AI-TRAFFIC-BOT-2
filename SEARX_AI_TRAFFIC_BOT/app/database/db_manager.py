"""
SQLite Database Manager for SEARX AI TRAFFIC BOT.
Ensures persistent local relational storage for websites, proxies, browser sessions, and analytics.
"""

from __future__ import annotations
import sqlite3
import shutil
import time
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional
from app.core.logger import logger


class DatabaseManager:
    """Manages SQLite tables, queries, transactions, and backups."""

    def __init__(self, db_path: str = "data/searx_traffic_bot.db"):
        base_dir = Path(__file__).resolve().parent.parent.parent
        self.db_path = base_dir / db_path
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self.init_db()

    def get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(str(self.db_path), check_same_thread=False)
        conn.row_factory = sqlite3.Row
        return conn

    def init_db(self) -> None:
        """Create tables if they don't already exist."""
        with self.get_connection() as conn:
            cursor = conn.cursor()

            # Websites Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS websites (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    url TEXT UNIQUE NOT NULL,
                    domain TEXT NOT NULL,
                    category TEXT DEFAULT 'General',
                    status TEXT DEFAULT 'active',
                    uptime_percent REAL DEFAULT 100.0,
                    last_response_time_ms INTEGER DEFAULT 0,
                    ssl_valid INTEGER DEFAULT 1,
                    ssl_expires TEXT DEFAULT '',
                    notes TEXT DEFAULT '',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # Proxies Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS proxies (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    address TEXT NOT NULL,
                    port INTEGER NOT NULL,
                    protocol TEXT DEFAULT 'http',
                    username TEXT DEFAULT '',
                    password TEXT DEFAULT '',
                    auth_required INTEGER DEFAULT 0,
                    status TEXT DEFAULT 'untested',
                    latency_ms INTEGER DEFAULT 0,
                    last_checked TIMESTAMP,
                    fail_count INTEGER DEFAULT 0,
                    error_message TEXT DEFAULT '',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(address, port, protocol)
                );
            """)

            # Browser Profiles Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS browser_profiles (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT UNIQUE NOT NULL,
                    engine TEXT DEFAULT 'chromium',
                    user_agent TEXT NOT NULL,
                    viewport_width INTEGER DEFAULT 1366,
                    viewport_height INTEGER DEFAULT 768,
                    cookies_count INTEGER DEFAULT 0,
                    storage_path TEXT NOT NULL,
                    status TEXT DEFAULT 'idle',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # Visitor Sessions Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS visitor_sessions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    website_id INTEGER,
                    session_uuid TEXT UNIQUE NOT NULL,
                    visitor_type TEXT DEFAULT 'new',
                    country TEXT DEFAULT 'US',
                    device TEXT DEFAULT 'Desktop',
                    browser TEXT DEFAULT 'Chrome',
                    landing_page TEXT NOT NULL,
                    referrer TEXT DEFAULT 'Direct',
                    engagement_score REAL DEFAULT 85.0,
                    duration_sec INTEGER DEFAULT 120,
                    converted INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # Traffic Campaigns (Paid / Organic)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS traffic_campaigns (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    website_id INTEGER,
                    campaign_name TEXT NOT NULL,
                    source TEXT DEFAULT 'google',
                    medium TEXT DEFAULT 'cpc',
                    utm_campaign TEXT NOT NULL,
                    budget REAL DEFAULT 0.0,
                    cost REAL DEFAULT 0.0,
                    clicks INTEGER DEFAULT 0,
                    conversions INTEGER DEFAULT 0,
                    roi REAL DEFAULT 0.0,
                    status TEXT DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # Ad Compliance & Revenue Monitoring
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS ad_compliance_records (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    website_id INTEGER,
                    network_name TEXT NOT NULL,
                    impressions INTEGER DEFAULT 0,
                    clicks INTEGER DEFAULT 0,
                    ctr REAL DEFAULT 0.0,
                    rpm REAL DEFAULT 0.0,
                    revenue REAL DEFAULT 0.0,
                    policy_status TEXT DEFAULT 'compliant',
                    anomaly_flag INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # Security Events
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS security_events (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    event_type TEXT NOT NULL,
                    severity TEXT DEFAULT 'low',
                    description TEXT NOT NULL,
                    ip_address TEXT DEFAULT '',
                    triggered_rule TEXT NOT NULL,
                    resolved INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # Task & Audit Logs
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS task_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    task_type TEXT NOT NULL,
                    target TEXT NOT NULL,
                    status TEXT NOT NULL,
                    details TEXT DEFAULT '',
                    execution_time_ms INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)

            conn.commit()
            logger.info("Database initialized successfully at: %s", self.db_path)

        # Seed sample baseline if tables are completely empty
        self.seed_defaults_if_empty()

    def seed_defaults_if_empty(self) -> None:
        """Seed baseline records so user has immediately visible operational data on launch."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) as count FROM websites")
            if cursor.fetchone()["count"] == 0:
                # Add default verified websites
                cursor.execute("""
                    INSERT INTO websites (url, domain, category, status, uptime_percent, last_response_time_ms, ssl_valid, ssl_expires, notes)
                    VALUES 
                    ('https://searx.me', 'searx.me', 'Search & Aggregator', 'active', 99.8, 142, 1, '2027-04-15', 'Primary search index target'),
                    ('https://github.com', 'github.com', 'Development', 'active', 99.9, 88, 1, '2027-08-20', 'Code repository benchmark'),
                    ('https://example.com', 'example.com', 'Testing', 'active', 100.0, 45, 1, '2027-01-10', 'Baseline latency reference');
                """)

                # Add sample proxies
                cursor.execute("""
                    INSERT INTO proxies (address, port, protocol, auth_required, status, latency_ms, last_checked, fail_count)
                    VALUES
                    ('198.51.100.24', 8080, 'http', 0, 'active', 124, CURRENT_TIMESTAMP, 0),
                    ('203.0.113.88', 3128, 'https', 1, 'active', 186, CURRENT_TIMESTAMP, 0),
                    ('192.0.2.145', 1080, 'socks5', 1, 'active', 210, CURRENT_TIMESTAMP, 0),
                    ('198.51.100.99', 8888, 'http', 0, 'failed', 0, CURRENT_TIMESTAMP, 3);
                """)

                # Add default browser profiles
                cursor.execute("""
                    INSERT INTO browser_profiles (name, engine, user_agent, viewport_width, viewport_height, cookies_count, storage_path, status)
                    VALUES
                    ('Default Clean Profile', 'chromium', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', 1366, 768, 14, 'data/profiles/default', 'idle'),
                    ('Firefox Isolated QA', 'firefox', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0', 1920, 1080, 8, 'data/profiles/firefox_qa', 'idle'),
                    ('High-DPI Desktop', 'chromium', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0', 2560, 1440, 22, 'data/profiles/high_dpi', 'idle');
                """)

                # Add security events
                cursor.execute("""
                    INSERT INTO security_events (event_type, severity, description, ip_address, triggered_rule, resolved)
                    VALUES
                    ('Unusual Referral Spike', 'medium', 'Sudden burst of 45 requests from unclassified aggregator', '198.51.100.12', 'SPIKE_BURST_RULE_3', 1),
                    ('Proxy Auth Challenge', 'low', 'Upstream proxy 203.0.113.88 requested 407 Proxy Authentication', '203.0.113.88', 'AUTH_REQUIRED_RULE', 1);
                """)

                # Add task logs
                cursor.execute("""
                    INSERT INTO task_logs (task_type, target, status, details, execution_time_ms)
                    VALUES
                    ('HEALTH_CHECK', 'https://searx.me', 'SUCCESS', 'HTTP 200 OK - SSL valid until 2027-04-15', 142),
                    ('PROXIES_VERIFICATION', 'Pool (4 proxies)', 'SUCCESS', '3 active, 1 failed', 840);
                """)

                conn.commit()
                logger.info("Database seeded with initial baseline configuration.")

    def backup_database(self) -> str:
        """Create a timestamped backup in backups/ directory."""
        backup_dir = self.db_path.parent.parent / "backups"
        backup_dir.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_file = backup_dir / f"searx_bot_backup_{timestamp}.db"
        shutil.copy2(self.db_path, backup_file)
        logger.info("Database backed up to: %s", backup_file)
        return str(backup_file)
