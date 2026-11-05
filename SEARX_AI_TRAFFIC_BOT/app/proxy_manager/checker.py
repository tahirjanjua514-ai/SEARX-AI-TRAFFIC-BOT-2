"""
Proxy Connection and Latency Diagnostics Engine for SEARX AI TRAFFIC BOT.
Performs socket pings, HTTP/HTTPS handshake verification, and auth error detection.
"""

from __future__ import annotations
import socket
import time
import urllib.request
import urllib.error
from typing import Any, Dict, Optional, Tuple
from app.core.logger import logger


class ProxyChecker:
    """Tests connectivity, response latency, and authentication status of a proxy."""

    @staticmethod
    def test_proxy(
        address: str,
        port: int,
        protocol: str = "http",
        username: str = "",
        password: str = "",
        timeout: int = 8,
        test_target: str = "https://www.google.com/generate_204",
    ) -> Dict[str, Any]:
        """
        Executes a real connection test against target.
        Returns:
            Dict containing success (bool), latency_ms (int), status (str), error (str).
        """
        protocol = protocol.lower()
        start_time = time.time()

        # Step 1: Raw socket connectivity check
        try:
            sock = socket.create_connection((address, port), timeout=min(timeout, 4))
            sock.close()
        except socket.timeout:
            return {
                "success": False,
                "latency_ms": 0,
                "status": "timeout",
                "error": "Connection timed out during initial handshake.",
            }
        except socket.error as e:
            return {
                "success": False,
                "latency_ms": 0,
                "status": "unreachable",
                "error": f"Socket connection failed: {e}",
            }

        # Step 2: Protocol handshake and HTTP verification
        try:
            if username and password:
                proxy_url = f"{protocol}://{username}:{password}@{address}:{port}"
            else:
                proxy_url = f"{protocol}://{address}:{port}"

            proxy_handler = urllib.request.ProxyHandler({
                "http": proxy_url,
                "https": proxy_url,
            })
            opener = urllib.request.build_opener(proxy_handler)

            req = urllib.request.Request(
                test_target,
                headers={"User-Agent": "SEARX-Bot-Diagnostic-Agent/1.0"},
            )

            with opener.open(req, timeout=timeout) as resp:
                elapsed_ms = int((time.time() - start_time) * 1000)
                code = resp.getcode()
                if code in (200, 204):
                    return {
                        "success": True,
                        "latency_ms": elapsed_ms,
                        "status": "active",
                        "error": "",
                    }
                else:
                    return {
                        "success": False,
                        "latency_ms": elapsed_ms,
                        "status": "degraded",
                        "error": f"Unexpected HTTP status {code}",
                    }

        except urllib.error.HTTPError as e:
            elapsed_ms = int((time.time() - start_time) * 1000)
            if e.code == 407:
                return {
                    "success": False,
                    "latency_ms": elapsed_ms,
                    "status": "auth_error",
                    "error": "Proxy authentication required (HTTP 407). Check credentials.",
                }
            return {
                "success": False,
                "latency_ms": elapsed_ms,
                "status": "error",
                "error": f"HTTP Error: {e.code} {e.reason}",
            }
        except Exception as e:
            elapsed_ms = int((time.time() - start_time) * 1000)
            return {
                "success": False,
                "latency_ms": elapsed_ms,
                "status": "failed",
                "error": str(e),
            }
