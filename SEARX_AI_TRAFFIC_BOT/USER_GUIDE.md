# SEARX AI TRAFFIC BOT — Complete User Guide
### Beginner-Friendly Step-by-Step Manual for Windows 10 & 11

Welcome to **SEARX AI TRAFFIC BOT**. This guide covers everything you need to start operating the software on Windows.

---

## 1. System Requirements

- **Operating System:** Windows 10 (64-bit) or Windows 11 (64-bit)
- **Processor:** Dual-core 2.0 GHz or higher (Quad-core recommended for 8+ concurrent threads)
- **RAM:** Minimum 4 GB (8 GB recommended for Playwright multi-browser profiles)
- **Disk Space:** 500 MB free disk space
- **Python:** Python 3.12+ (or Python 3.10+)

---

## 2. Step 1: Installing Python (If not already installed)

1. Download the official installer from [Python.org](https://www.python.org/downloads/).
2. **IMPORTANT:** On the very first screen of the installer, check the box:
   `☑ Add Python.exe to PATH`
3. Click **Install Now**.
4. Once completed, restart your command prompt.

---

## 3. Step 2: Running Setup

1. Open the `SEARX_AI_TRAFFIC_BOT` folder.
2. Double click **`setup.bat`**.
3. A Windows Command Prompt will appear and automatically:
   - Configure a clean `.venv` environment
   - Install `PySide6`, `playwright`, `httpx`, `cryptography`, `psutil`
   - Download the headless browser engine
   - Create your local SQLite database
4. When you see `[SUCCESS] SEARX AI TRAFFIC BOT is successfully installed and ready!`, press any key to close the window.

---

## 4. Step 3: Launching the Application

1. Double-click **`run.bat`**.
2. The modern desktop application window will open with the Dark theme active.
3. You can click **"Toggle Light/Dark"** in the lower sidebar anytime according to your environment preference.

---

## 5. Working with Key Modules

### A. Website Manager
1. Navigate to **Websites** in the sidebar.
2. Click **"Add Website"** and enter a URL (e.g. `https://yourdomain.com`).
3. The software validates the domain format and checks SSL certificate validity.
4. Click **"Check Health"** anytime to measure live server response time and uptime percentage.

### B. Advanced Proxy Manager
1. Navigate to **Proxies** in the sidebar.
2. Click **"Import Proxies"** and paste your list in any standard format:
   - `IP:PORT` (e.g. `198.51.100.24:8080`)
   - `IP:PORT:USER:PASS`
   - `socks5://user:pass@IP:PORT`
3. Click **"Test Connection"** on any row to verify live socket latency and HTTP 200/204 response.
4. Proxies that require authentication or fail will display clear error descriptions without concealing failures.

### C. Browser Profiles & Playwright Engine
1. Navigate to **Browser Engine**.
2. Create isolated profiles (e.g., "QA Chrome Clean", "Firefox Independent").
3. Each profile maintains its own completely independent cookie jar, cache, and local storage on disk in `data/profiles/`.
4. Click **"Launch Session"** to open an automated testing context.

### D. Ad Network Compliance Guardian
1. Navigate to **Ad Compliance**.
2. Review real-time status across Google AdSense, AdX, Adsterra, Propush, Adcash, and Monetag.
3. The built-in compliance engine flags any suspicious CTR spike (>8.5%) or abnormal patterns to protect your publisher account against invalid traffic (IVT) penalties.

### E. Generating Reports
1. Navigate to **Reports & Exports**.
2. Choose **Export Websites (CSV)** or **Export Proxies (CSV)** or **Executive Summary (JSON)**.
3. Files are saved instantly to the `exports/` folder.

---

## 6. Compiling Standalone Windows EXE

If you wish to distribute a single executable that runs without needing Python installed:
1. Double click **`build_exe.bat`**.
2. PyInstaller will compile all files, Qt assets, and configs.
3. Your compiled application will be located at:
   `dist\SearxTrafficBot\SearxTrafficBot.exe`
