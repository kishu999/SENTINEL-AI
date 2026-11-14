@echo off
echo =======================================================
echo         SENTINEL AI - CYBERSECURITY FIREWALL
echo =======================================================
echo.

REM Set paths
set "PATH=%USERPROFILE%\.local\bin;%USERPROFILE%\.local\node;%PATH%"

REM Check Python executable
if exist "backend\.venv\Scripts\python.exe" (
    set "PY_CMD=backend\.venv\Scripts\python.exe"
) else (
    set "PY_CMD=python"
)

echo [1/2] Starting Sentinel AI Backend on http://localhost:8000 ...
start "Sentinel AI Backend" cmd /k "%PY_CMD% -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/2] Starting Sentinel AI Frontend Dev Server on http://localhost:5173 ...
start "Sentinel AI Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo =======================================================
echo   Sentinel AI is running!
echo   Dashboard:  http://localhost:5173  (or http://localhost:8000)
echo   OpenAI Proxy: http://localhost:8000/v1
echo   Attacker Sink: http://localhost:8000/v1/attacker-sink
echo =======================================================
pause
