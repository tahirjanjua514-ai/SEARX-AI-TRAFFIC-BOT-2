@echo off
REM ==============================================================================
REM SEARX AI TRAFFIC BOT - Windows Automated Setup Script
REM Platform: Windows 10 & Windows 11 (64-bit)
REM ==============================================================================

echo [SEARX AI BOT] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in your PATH.
    echo Please install Python 3.12+ from https://www.python.org/downloads/
    echo Remember to check "Add Python to PATH" during installation.
    pause
    exit /b 1
)

echo [SEARX AI BOT] Creating virtual environment (.venv)...
python -m venv .venv
if %errorlevel% neq 0 (
    echo [ERROR] Failed to create virtual environment.
    pause
    exit /b 1
)

echo [SEARX AI BOT] Activating virtual environment...
call .venv\Scripts\activate.bat

echo [SEARX AI BOT] Upgrading pip...
python -m pip install --upgrade pip

echo [SEARX AI BOT] Installing required dependencies from requirements.txt...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Dependency installation encountered an issue.
    pause
    exit /b 1
)

echo [SEARX AI BOT] Installing Playwright Chromium browser binaries...
playwright install chromium

echo [SEARX AI BOT] Initializing SQLite database and verifying modules...
python main.py --init-db
python main.py --diagnostics

echo ==============================================================================
echo [SUCCESS] SEARX AI TRAFFIC BOT is successfully installed and ready!
echo To start the application, double click 'run.bat'
echo ==============================================================================
pause
