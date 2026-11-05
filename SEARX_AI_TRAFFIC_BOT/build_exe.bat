@echo off
REM ==============================================================================
REM SEARX AI TRAFFIC BOT - Windows Standalone EXE Builder (PyInstaller)
REM Produces a self-contained executable in dist/SearxTrafficBot.exe
REM ==============================================================================

if exist .venv\Scripts\activate.bat (
    call .venv\Scripts\activate.bat
)

echo [SEARX AI BOT] Installing PyInstaller if needed...
pip install pyinstaller>=6.5.0

echo [SEARX AI BOT] Cleaning previous build artifacts...
if exist dist rmdir /s /q dist
if exist build rmdir /s /q build

echo [SEARX AI BOT] Compiling Windows Standalone Executable...
pyinstaller --noconfirm searx_bot.spec

if %errorlevel% neq 0 (
    echo [ERROR] PyInstaller compilation failed.
    pause
    exit /b 1
)

echo ==============================================================================
echo [SUCCESS] Windows Executable built successfully!
echo Binary output location: dist\SearxTrafficBot\SearxTrafficBot.exe
echo ==============================================================================
pause
