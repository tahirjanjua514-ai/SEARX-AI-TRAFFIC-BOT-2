"""
Core Test Suite for SEARX AI TRAFFIC BOT.
Verifies database operations, proxy parsing, URL validation, and encryption.
"""

import unittest
from pathlib import Path
import sys

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from app.database.db_manager import DatabaseManager
from app.websites.manager import WebsiteManager
from app.proxy_manager.manager import ProxyManager
from app.security.security_engine import SecurityEngine


class TestSearxBotCore(unittest.TestCase):

    def setUp(self):
        self.db = DatabaseManager(db_path="data/test_searx.db")
        self.wm = WebsiteManager(self.db)
        self.pm = ProxyManager(self.db)
        self.sec = SecurityEngine(self.db)

    def tearDown(self):
        # Cleanup test db
        if self.db.db_path.exists():
            try:
                self.db.db_path.unlink()
            except Exception:
                pass

    def test_url_validation(self):
        valid, url, domain = self.wm.validate_url("https://searx.me/search?q=test")
        self.assertTrue(valid)
        self.assertEqual(domain, "searx.me")

        invalid, _, _ = self.wm.validate_url("not_a_valid_url")
        self.assertFalse(invalid)

    def test_proxy_line_parsing(self):
        parsed = self.pm.parse_proxy_line("192.168.1.1:8080")
        self.assertIsNotNone(parsed)
        self.assertEqual(parsed["address"], "192.168.1.1")
        self.assertEqual(parsed["port"], 8080)
        self.assertEqual(parsed["protocol"], "http")

        parsed_auth = self.pm.parse_proxy_line("socks5://user:secret@10.0.0.5:1080")
        self.assertIsNotNone(parsed_auth)
        self.assertEqual(parsed_auth["username"], "user")
        self.assertEqual(parsed_auth["password"], "secret")
        self.assertEqual(parsed_auth["protocol"], "socks5")

    def test_encryption_roundtrip(self):
        secret = "MyApiKey123456"
        encrypted = self.sec.encrypt_secret(secret)
        self.assertNotEqual(secret, encrypted)
        decrypted = self.sec.decrypt_secret(encrypted)
        self.assertEqual(secret, decrypted)


if __name__ == "__main__":
    unittest.main()
