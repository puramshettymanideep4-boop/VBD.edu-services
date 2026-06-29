@echo off
echo ========================================
echo  VBD Education Services — Starting App
echo ========================================

echo [1/2] Starting Backend (port 5000)...
echo [2/2] Starting Frontend (port 5173)...
echo.
echo  Backend API : http://localhost:5000/api
echo  Frontend    : http://localhost:5173
echo ========================================

npx concurrently --names "BACKEND,FRONTEND" --prefix-colors "cyan,magenta" "npm run dev --prefix backend" "npm run dev --prefix frontend"
