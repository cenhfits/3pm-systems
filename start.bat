@echo off
echo Starting 3PM System...

:: Start Backend
echo [Backend] Starting FastAPI on port 8000...
start "Backend" cmd /k "cd /d %~dp0backend && uvicorn server:app --reload --port 8000"

:: Wait a moment then start Frontend
timeout /t 2 /nobreak > nul
echo [Frontend] Starting React on port 3000...
start "Frontend" cmd /k "cd /d %~dp0frontend && yarn start"

echo.
echo Both servers are starting:
echo  - Frontend: http://localhost:3000
echo  - Backend:  http://localhost:8000
echo.
