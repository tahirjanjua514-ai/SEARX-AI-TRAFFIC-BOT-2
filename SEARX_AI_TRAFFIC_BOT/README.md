# SEARX AI TRAFFIC BOT
### Advanced Professional Windows Desktop Application
**Platforms:** Windows 10 & Windows 11 (64-bit)  
**Core Technologies:** Python 3.12+, PySide6 Modern GUI, Playwright Browser Engine, SQLite Database, Asyncio Worker Pools, PyInstaller Packaging.

---

## Overview

**SEARX AI TRAFFIC BOT** is an enterprise-grade desktop workstation engineered for webmasters, digital analysts, cyber engineers, and site operators. It unifies high-concurrency browser automation, diagnostic proxy verification, genuine human visitor analytics, ad network compliance protection, and cybersecurity auditing into a cohesive, responsive Windows desktop interface.

### Key Capabilities

1. **Website Manager**: Bulk import, automatic domain validation, live uptime monitoring, SSL certificate expiry tracking, and response latency benchmarks.
2. **Advanced Proxy Manager**: Native testing of HTTP, HTTPS, and SOCKS5 protocols with username/password authentication, handshake timing, and failure detection.
3. **Playwright Browser Engine**: Independent persistent profiles with isolated caches, cookies, and local storage containers in Chromium and Firefox.
4. **Privacy & Security Audit**: WebRTC IP leak checks, cookie isolation verification, and desktop fingerprint safety audits without deceptive fraud practices.
5. **Human Visitor Analytics**: Real session analysis, new vs. returning visitor ratios, geographic traffic maps, and consent-based conversion metrics.
6. **Thread & Worker Manager**: Dynamic concurrency pools, task pause/resume, and live CPU/RAM utilization monitors.
7. **Ad Network Compliance**: Real-time policy and CTR anomaly guards for Google AdSense, AdX, Adsterra, Propush, Adcash, and Monetag to safeguard against invalid traffic risks.
8. **SEO Intelligence**: Automated sitemap XML discovery, robots.txt validator, and internal link structure checker.
9. **Cybersecurity Engine**: Real-time traffic spike anomaly detection, credential encryption, automatic SQLite backups, and audit logs.
10. **Packaging**: 1-click Windows batch scripts (`setup.bat`, `run.bat`, `build_exe.bat`).

---

## Directory Structure

```
SEARX_AI_TRAFFIC_BOT/
├── main.py                  # Master entry point (GUI + CLI)
├── requirements.txt         # Python dependencies
├── config.yaml              # Application configuration
├── setup.bat                # Automated Windows environment installer
├── run.bat                  # Desktop application launcher
├── build_exe.bat            # PyInstaller Windows EXE compiler
├── searx_bot.spec           # PyInstaller build specification
├── README.md                # System documentation
├── USER_GUIDE.md            # Beginner guide for Windows 10/11
├── TROUBLESHOOTING.md       # Diagnostic and recovery manual
├── app/
│   ├── core/                # Config parser & rotating logger
│   ├── database/            # SQLite manager & migrations
│   ├── gui/                 # PySide6 desktop window & styles
│   ├── websites/            # Target URL CRUD & SSL monitoring
│   ├── proxy_manager/       # HTTP/HTTPS/SOCKS5 diagnostics & pool
│   ├── browser_engine/      # Playwright persistent contexts
│   ├── browser_profiles/    # Isolated storage containers
│   ├── privacy_audit/       # WebRTC & cookie isolation auditing
│   ├── visitor_analytics/   # Real session engagement & conversions
│   ├── thread_manager/      # Asyncio worker pool & resource tracker
│   ├── captcha_manager/     # Challenge detector & manual queue
│   ├── traffic_intelligence/# Search Console & UTM ROI builder
│   ├── ad_networks/         # AdSense, AdX & Monetag compliance
│   ├── seo/                 # Robots.txt, sitemaps & link audits
│   ├── security/            # Traffic spike detection & encryption
│   ├── automation/          # Scheduled diagnostics & page QA
│   └── reporting/           # CSV, JSON & PDF report generation
├── assets/                  # Application icons & branding
├── data/                    # SQLite database & browser profile storage
├── logs/                    # Centralized app.log file
├── exports/                 # Generated CSV reports & screenshots
├── backups/                 # Timestamped SQLite database archives
└── tests/                   # Core automated test suite
```

---

## Quick Start on Windows 10 / 11

### 1. Automated Installation
Double click `setup.bat`. This automatically:
- Creates a Python virtual environment (`.venv`)
- Installs all dependencies from `requirements.txt`
- Downloads Playwright Chromium binaries
- Initializes the local SQLite database in `data/searx_traffic_bot.db`

### 2. Launching the Desktop Application
Double click `run.bat` or run:
```cmd
python main.py
```

### 3. Packaging into Windows .EXE
Double click `build_exe.bat` to compile `SearxTrafficBot.exe` in the `dist/` directory.

---

## Command Line Usage

```bash
# Run complete system diagnostic check
python main.py --diagnostics

# Test all proxies in database immediately
python main.py --check-proxies

# Initialize and verify SQLite tables
python main.py --init-db

# Run unit tests
python -m unittest tests/test_core.py
```
