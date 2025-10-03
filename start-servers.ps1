# Ball Knower - Start Servers Script
# This script starts both the frontend and backend servers from the correct directories

Write-Host "Starting Ball Knower Servers..." -ForegroundColor Green

# Kill any existing processes
Write-Host "Stopping existing servers..." -ForegroundColor Yellow
taskkill /f /im python.exe 2>$null
taskkill /f /im node.exe 2>$null

# Wait a moment for processes to stop
Start-Sleep 2

# Get the current directory (should be Ball Knower project root)
$projectRoot = Get-Location
$backendDir = Join-Path $projectRoot "backend"

Write-Host "Project Root: $projectRoot" -ForegroundColor Cyan
Write-Host "Backend Dir: $backendDir" -ForegroundColor Cyan

# Verify we're in the correct directory
if (-not (Test-Path "index.html")) {
    Write-Host "ERROR: index.html not found. Please run this script from the Ball Knower project directory." -ForegroundColor Red
    Write-Host "Current directory: $projectRoot" -ForegroundColor Red
    Write-Host "Expected to find: index.html" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "backend\src\server.js")) {
    Write-Host "ERROR: Backend server not found. Please ensure the backend directory exists." -ForegroundColor Red
    exit 1
}

# Start backend server in a new PowerShell window
Write-Host "Starting Backend Server (Port 3001)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; Write-Host 'Backend Server Starting...' -ForegroundColor Green; node src/server.js"

# Wait a moment for backend to start
Start-Sleep 3

# Start frontend server in a new PowerShell window
Write-Host "Starting Frontend Server (Port 8000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot'; Write-Host 'Frontend Server Starting...' -ForegroundColor Green; python -m http.server 8000"

# Wait a moment for frontend to start
Start-Sleep 3

# Check if servers are running
Write-Host "Checking server status..." -ForegroundColor Yellow

$backendRunning = netstat -ano | findstr ":3001" | findstr "LISTENING"
$frontendRunning = netstat -ano | findstr ":8000" | findstr "LISTENING"

if ($backendRunning) {
    Write-Host "SUCCESS: Backend Server running on port 3001" -ForegroundColor Green
} else {
    Write-Host "ERROR: Backend Server not running" -ForegroundColor Red
}

if ($frontendRunning) {
    Write-Host "SUCCESS: Frontend Server running on port 8000" -ForegroundColor Green
} else {
    Write-Host "ERROR: Frontend Server not running" -ForegroundColor Red
}

Write-Host ""
Write-Host "Your Ball Knower App:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:8000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "Ready to use! Open http://localhost:8000 in your browser." -ForegroundColor Green
Write-Host ""
Write-Host "To stop servers: Close the PowerShell windows or run 'stop-servers.ps1'" -ForegroundColor Yellow
