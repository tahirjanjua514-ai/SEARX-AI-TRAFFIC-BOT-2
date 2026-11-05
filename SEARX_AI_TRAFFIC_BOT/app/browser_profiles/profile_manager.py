"""
Browser Profile Management Module for SEARX AI TRAFFIC BOT.
Manages isolated storage sandboxes, custom user-agents, and screen dimensions.
"""

from __future__ import annotations
import shutil
from pathlib import Path
from typing import Any, Dict, List, Optional
from app.core.logger import logger
from app.database.db_manager import DatabaseManager


class BrowserProfileManager:
    """Handles independent browser identity containers with separated cache and cookies."""

    DEFAULT_USER_AGENTS = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
    ]

    def __init__(self, db_manager: DatabaseManager):
        self.db = db_manager
        base_dir = Path(__file__).resolve().parent.parent.parent
        self.profiles_root = base_dir / "data" / "profiles"
        self.profiles_root.mkdir(parents=True, exist_ok=True)

    def create_profile(
        self,
        name: str,
        engine: str = "chromium",
        user_agent: Optional[str] = None,
        width: int = 1366,
        height: int = 768,
    ) -> Dict[str, Any]:
        """Creates a new isolated profile directory and database record."""
        clean_name = name.strip()
        if not clean_name:
            return {"success": False, "error": "Profile name cannot be empty."}

        storage_path = str(self.profiles_root / clean_name.replace(" ", "_"))
        ua = user_agent or self.DEFAULT_USER_AGENTS[0]

        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM browser_profiles WHERE name = ?", (clean_name,))
            if cursor.fetchone():
                return {"success": False, "error": f"Profile '{clean_name}' already exists."}

            cursor.execute("""
                INSERT INTO browser_profiles (name, engine, user_agent, viewport_width, viewport_height, storage_path, status)
                VALUES (?, ?, ?, ?, ?, ?, 'idle')
            """, (clean_name, engine, ua, width, height, storage_path))
            conn.commit()
            profile_id = cursor.lastrowid

        # Create physical directory
        Path(storage_path).mkdir(parents=True, exist_ok=True)
        logger.info("Created isolated browser profile: %s (Storage: %s)", clean_name, storage_path)
        return {"success": True, "id": profile_id, "name": clean_name, "storage_path": storage_path}

    def list_profiles(self) -> List[Dict[str, Any]]:
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM browser_profiles ORDER BY id DESC")
            return [dict(r) for r in cursor.fetchall()]

    def delete_profile(self, profile_id: int) -> bool:
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT storage_path FROM browser_profiles WHERE id = ?", (profile_id,))
            row = cursor.fetchone()
            if not row:
                return False
            storage_path = row["storage_path"]

            cursor.execute("DELETE FROM browser_profiles WHERE id = ?", (profile_id,))
            conn.commit()

        # Clean up directory
        try:
            p = Path(storage_path)
            if p.exists() and p.is_dir():
                shutil.rmtree(p)
        except Exception as e:
            logger.warning("Could not delete directory %s: %s", storage_path, e)

        return True

    def clear_cookies_and_cache(self, profile_id: int) -> bool:
        """Purges cache and cookie stores for the given profile."""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT storage_path FROM browser_profiles WHERE id = ?", (profile_id,))
            row = cursor.fetchone()
            if not row:
                return False
            storage_path = row["storage_path"]

            cursor.execute("UPDATE browser_profiles SET cookies_count = 0 WHERE id = ?", (profile_id,))
            conn.commit()

        p = Path(storage_path)
        if p.exists():
            for child in p.iterdir():
                try:
                    if child.is_file():
                        child.unlink()
                    elif child.is_dir():
                        shutil.rmtree(child)
                except Exception:
                    pass

        logger.info("Cleared cache and cookies for profile ID %s", profile_id)
        return True
