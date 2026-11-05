# SEARX AI TRAFFIC BOT — Troubleshooting Guide
### Diagnostic Solutions for Windows 10 & 11

This guide addresses common questions, error messages, and system diagnostics.

---

## 1. "Python is not recognized as an internal or external command"
- **Cause:** Python was installed without checking the "Add Python to PATH" box.
- **Fix:** Re-run the Python installer, select **Modify**, and make sure **Add Python to environment variables** is checked. Alternatively, add `C:\Users\<User>\AppData\Local\Programs\Python\Python312` to your Windows System Environment Variables `PATH`.

---

## 2. "Proxy Connection Failed / 407 Proxy Authentication Required"
- **Cause:** Upstream proxy requires authentication credentials or the proxy host is offline.
- **Fix:**
  1. Verify if your proxy requires a username and password.
  2. In Proxy Manager, edit the proxy and input the correct username/password.
  3. Ensure your local Windows Firewall or corporate network is not blocking outgoing connections on the specified port.

---

## 3. "Playwright Host not Found / Executable doesn't exist"
- **Cause:** Browser binaries were not downloaded after installing Playwright.
- **Fix:** Open Command Prompt in the project folder and run:
  ```cmd
  playwright install chromium
  ```
  If you also test Firefox profiles, run:
  ```cmd
  playwright install firefox
  ```

---

## 4. "Database is locked" (SQLite Error)
- **Cause:** Multiple applications or threads attempting simultaneous write locks without releasing transactions.
- **Fix:**
  - The software includes automatic thread-safe connection pooling with WAL mode enabled.
  - If locked, close background instances from Task Manager (`SearxTrafficBot.exe` or `python.exe`), then relaunch.

---

## 5. High CPU or RAM Usage
- **Cause:** Configured worker count exceeds physical hardware capacity.
- **Fix:**
  1. Open the **Thread Manager** tab.
  2. Adjust worker slider from default (e.g. 4) down to 2.
  3. Click **Pause** to let current queue tasks drain smoothly.

---

## 6. PyInstaller Build Fails or Missing Modules
- **Cause:** Antivirus software scanning intermediate build files, or missing packages.
- **Fix:**
  1. Run `pip install --upgrade pyinstaller`.
  2. Temporarily exclude the `build/` and `dist/` directories from real-time Windows Defender scanning.
  3. Run `build_exe.bat` as Administrator.

---

## 7. Reviewing Centralized Logs
The application records every event, diagnostic test, and error trace with timestamps in:
`SEARX_AI_TRAFFIC_BOT/logs/app.log`

You can open this file in Notepad or VS Code at any time to inspect detailed debug stack traces.
