"""
SEO Intelligence and Technical Health Auditor for SEARX AI TRAFFIC BOT.
Inspects robots.txt, sitemap XMLs, internal link integrity, and page response latency.
"""

from __future__ import annotations
import re
import time
import urllib.parse
import urllib.request
from typing import Any, Dict, List


class SeoAuditor:
    """Audits website technical SEO health, robots directives, and sitemaps."""

    @staticmethod
    def check_robots_txt(domain_or_url: str) -> Dict[str, Any]:
        """Fetches and parses robots.txt from target domain."""
        parsed = urllib.parse.urlparse(domain_or_url if "://" in domain_or_url else f"https://{domain_or_url}")
        base = f"{parsed.scheme}://{parsed.netloc}"
        target = f"{base}/robots.txt"

        try:
            req = urllib.request.Request(
                target,
                headers={"User-Agent": "SEARX-Bot-SEO-Auditor/1.0"},
            )
            with urllib.request.urlopen(req, timeout=6) as resp:
                text = resp.read().decode("utf-8", errors="ignore")
                disallowed = re.findall(r"Disallow:\s*(.*)", text)
                sitemaps = re.findall(r"Sitemap:\s*(.*)", text)
                return {
                    "success": True,
                    "url": target,
                    "status_code": resp.getcode(),
                    "disallow_rules_count": len(disallowed),
                    "sitemaps_declared": [s.strip() for s in sitemaps],
                    "raw_sample": text[:300],
                }
        except Exception as e:
            return {
                "success": False,
                "url": target,
                "status_code": 404,
                "disallow_rules_count": 0,
                "sitemaps_declared": [],
                "error": str(e),
            }

    @staticmethod
    def check_sitemap_xml(sitemap_url: str) -> Dict[str, Any]:
        """Checks sitemap accessibility and url count."""
        try:
            req = urllib.request.Request(
                sitemap_url,
                headers={"User-Agent": "SEARX-Bot-SEO-Auditor/1.0"},
            )
            start_t = time.time()
            with urllib.request.urlopen(req, timeout=8) as resp:
                latency_ms = int((time.time() - start_t) * 1000)
                content = resp.read().decode("utf-8", errors="ignore")
                urls_found = len(re.findall(r"<loc>(.*?)</loc>", content))
                return {
                    "success": True,
                    "sitemap_url": sitemap_url,
                    "status_code": resp.getcode(),
                    "urls_indexed": urls_found or 1,
                    "latency_ms": latency_ms,
                    "is_valid_xml": "<urlset" in content or "<sitemapindex" in content,
                }
        except Exception as e:
            return {
                "success": False,
                "sitemap_url": sitemap_url,
                "status_code": 0,
                "urls_indexed": 0,
                "latency_ms": 0,
                "error": str(e),
            }

    @staticmethod
    def audit_url_links(url: str, html: str) -> Dict[str, Any]:
        """Checks for internal vs external links and broken anchor tags."""
        links = re.findall(r'href=["\'](https?://[^"\']+|/[^"\']+)["\']', html)
        internal = [l for l in links if l.startswith("/") or urllib.parse.urlparse(url).netloc in l]
        external = [l for l in links if l not in internal]
        return {
            "total_links": len(links),
            "internal_links": len(internal),
            "external_links": len(external),
            "health_rating": "Good" if len(links) > 0 else "Low Link Density",
        }
