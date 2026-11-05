"""
CAPTCHA Identification and Authorized Workflow Management for SEARX AI TRAFFIC BOT.
Detects challenge types (reCAPTCHA, hCaptcha, Turnstile) and routes to manual queue or authorized test APIs.
Strictly complies with website terms and does not automate unauthorized solving.
"""

from __future__ import annotations
import re
from typing import Any, Dict, List, Optional
from app.core.logger import logger


class CaptchaManager:
    """Detects challenge signatures and coordinates authorized operator assistance."""

    CAPTCHA_PATTERNS = {
        "Google reCAPTCHA v2/v3": [
            r"google\.com/recaptcha",
            r"class=['\"][^'\"]*g-recaptcha",
            r"recaptcha/api\.js",
        ],
        "Cloudflare Turnstile": [
            r"challenges\.cloudflare\.com/turnstile",
            r"class=['\"][^'\"]*cf-turnstile",
        ],
        "hCaptcha": [
            r"hcaptcha\.com/1/api\.js",
            r"class=['\"][^'\"]*h-captcha",
        ],
        "Generic Math/Text Challenge": [
            r"captcha_challenge",
            r"security_code",
            r"enter the code from image",
        ],
    }

    def __init__(self):
        self.manual_queue: List[Dict[str, Any]] = []

    def detect_in_html(self, html_content: str, url: str = "") -> Optional[Dict[str, Any]]:
        """Scans page markup for known challenge fingerprints."""
        if not html_content:
            return None

        for captcha_type, patterns in self.CAPTCHA_PATTERNS.items():
            for p in patterns:
                if re.search(p, html_content, re.IGNORECASE):
                    logger.warning("Detected %s challenge on target: %s", captcha_type, url)
                    challenge_info = {
                        "type": captcha_type,
                        "url": url,
                        "requires_manual_action": True,
                        "pattern_matched": p,
                        "message": f"Security verification detected ({captcha_type}). Manual resolution required.",
                    }
                    self.manual_queue.append(challenge_info)
                    return challenge_info

        return None

    def get_pending_queue(self) -> List[Dict[str, Any]]:
        """Returns unresolved challenges requiring desktop operator confirmation."""
        return self.manual_queue

    def resolve_challenge(self, index: int, solution_token: str = "MANUALLY_VERIFIED") -> bool:
        """Marks challenge as handled by the desktop operator."""
        if 0 <= index < len(self.manual_queue):
            item = self.manual_queue.pop(index)
            logger.info("Challenge on %s resolved with token '%s'", item["url"], solution_token)
            return True
        return False
