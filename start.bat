@echo off
echo ========================================
echo  VBD Full Stack - Starting All Services
echo ========================================

REM ─── Start MongoDB ───
set MONGO_BIN=%USERPROFILE%\mongodb\bin
set MONGO_DATA=%USERPROFILE%\mongodb\data\db
set MONGO_LOG=%USERPROFILE%\mongodb\log\mongod.log

if not exist "%MONGO_BIN%\mongod.exe" (
  echo [ERROR] MongoDB not found at %MONGO_BIN%
  echo Please run setup-mongodb.ps1 first.
  pause
  exit /b 1
)

echo [1/3] Starting MongoDB on port 27017...
start /B "" "%MONGO_BIN%\mongod.exe" --dbpath "%MONGO_DATA%" --logpath "%MONGO_LOG%" --port 27017
timeout /T 3 /NOBREAK > NUL

echo [2/3] Seeding database if empty...
cd /d "%~dp0backend"
node src/utils/seeder.js 2>NUL
cd /d "%~dp0"

echo [3/3] Starting Backend + Frontend...
npx concurrently --names "BACKEND,FRONTEND" --prefix-colors "cyan,magenta" "npm run dev --prefix backend" "npm run dev --prefix frontend"
