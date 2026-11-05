"""
Core Configuration Module for SEARX AI TRAFFIC BOT.
Loads settings from config.yaml or provides secure production defaults.
"""

from __future__ import annotations
import os
import json
from pathlib import Path
from typing import Any, Dict

DEFAULT_CONFIG: Dict[str, Any] = {
    "app": {
        "name": "SEARX AI Traffic Bot",
        "version": "1.0.0",
        "environment": "production",
        "default_theme": "dark",
        "window": {"width": 1400, "height": 900, "min_width": 1024, "min_height": 700},
    },
    "database": {
        "engine": "sqlite3",
        "path": "data/searx_traffic_bot.db",
        "backup_interval_hours": 12,
        "max_backups": 10,
    },
    "concurrency": {
        "default_workers": 4,
        "max_workers": 16,
        "min_workers": 1,
        "worker_timeout_seconds": 45,
        "cooldown_between_tasks_ms": 1500,
    },
    "proxy": {
        "test_timeout_seconds": 10,
        "health_check_target": "https://www.google.com/generate_204",
        "secondary_target": "https://api.ipify.org?format=json",
        "max_retries": 3,
        "protocols_supported": ["http", "https", "socks5"],
        "auto_disable_unhealthy": True,
        "unhealthy_threshold_failures": 4,
    },
    "browser": {
        "engine_default": "chromium",
        "fallback_engine": "firefox",
        "headless_default": False,
        "slow_mo_ms": 50,
        "viewport": {"width": 1366, "height": 768},
        "storage_directory": "data/profiles",
        "isolate_cache_and_cookies": True,
        "take_screenshots_on_error": True,
        "screenshots_directory": "exports/screenshots",
    },
    "security": {
        "encryption_enabled": True,
        "audit_logging": True,
        "max_spike_percent_threshold": 250,
        "detect_suspicious_referrers": True,
    },
    "ad_compliance": {
        "monitored_networks": [
            "Google AdSense",
            "Google AdX",
            "Adsterra",
            "Propush",
            "Adcash",
            "Monetag",
        ],
        "strict_zero_bot_ad_interaction": True,
        "ctr_anomaly_threshold_percent": 8.5,
        "notify_on_rpm_drop_percent": 35.0,
    },
    "seo": {
        "crawl_depth_limit": 3,
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "verify_ssl_certificates": True,
        "check_robots_txt": True,
        "check_sitemaps": True,
    },
}


class AppConfig:
    """Singleton configuration manager."""

    _instance: AppConfig | None = None

    def __init__(self, config_path: str = "config.yaml"):
        self.base_dir = Path(__file__).resolve().parent.parent.parent
        self.config_path = self.base_dir / config_path
        self._data: Dict[str, Any] = DEFAULT_CONFIG.copy()
        self.load()

    @classmethod
    def get_instance(cls, config_path: str = "config.yaml") -> AppConfig:
        if cls._instance is None:
            cls._instance = cls(config_path)
        return cls._instance

    def load(self) -> None:
        if not self.config_path.exists():
            return

        try:
            import yaml  # type: ignore
            with open(self.config_path, "r", encoding="utf-8") as f:
                user_conf = yaml.safe_load(f)
                if isinstance(user_conf, dict):
                    self._deep_merge(self._data, user_conf)
        except Exception:
            # Fallback or pyyaml not yet installed
            pass

    def _deep_merge(self, base: Dict[str, Any], update: Dict[str, Any]) -> None:
        for k, v in update.items():
            if isinstance(v, dict) and k in base and isinstance(base[k], dict):
                self._deep_merge(base[k], v)
            else:
                base[k] = v

    def get(self, key_path: str, default: Any = None) -> Any:
        parts = key_path.split(".")
        curr: Any = self._data
        for p in parts:
            if isinstance(curr, dict) and p in curr:
                curr = curr[p]
            else:
                return default
        return curr

    def to_dict(self) -> Dict[str, Any]:
        return self._data
