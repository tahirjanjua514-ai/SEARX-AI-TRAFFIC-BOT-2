@echo off
REM ==============================================================================
REM SEARX AI TRAFFIC BOT - Windows Desktop Application Launcher
REM ==============================================================================

if exist .venv\Scripts\activate.bat (
    call .venv\Scripts\activate.bat
)

echo Starting SEARX AI TRAFFIC BOT GUI...
python main.py

if %errorlevel% neq 0 (
    echo.
    echo Application exited with error code %errorlevel%.
    echo Check logs/app.log for detailed trace.
    pause
)
