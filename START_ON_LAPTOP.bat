@echo off
title NAV DRISHTI - SIF PRECURSOR SAFETY PLATFORM
echo ==========================================================
echo   NAV DRISHTI - PROCESS SAFETY INTELLIGENCE PLATFORM
echo ==========================================================
echo [1/3] Starting Backend API Server with SQLite Real Database...
start "NavDrishti-SQLite-Backend" cmd /k "cd /d \"%~dp0\" && node backend/server.cjs"
timeout /t 2 /nobreak >nul

echo [2/3] Starting Vite Frontend Server...
start "NavDrishti-Frontend-Web" cmd /k "cd /d \"%~dp0\" && npm run dev"
timeout /t 3 /nobreak >nul

echo [3/3] Launching Web Browser at http://localhost:3000...
start http://localhost:3000

echo ==========================================================
echo   Nav-Drishti is running on your laptop!
echo   • Frontend: http://localhost:3000
echo   • SQLite Backend: http://localhost:5001
echo ==========================================================
