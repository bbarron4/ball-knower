# Ball Knower - Stop Servers Script
# This script stops both the frontend and backend servers

Write-Host "🛑 Stopping Ball Knower Servers..." -ForegroundColor Yellow

# Kill Python processes (frontend)
$pythonProcesses = Get-Process python -ErrorAction SilentlyContinue
if ($pythonProcesses) {
    Write-Host "🔄 Stopping Frontend Server (Python)..." -ForegroundColor Yellow
    taskkill /f /im python.exe
    Write-Host "✅ Frontend Server stopped" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No Frontend Server running" -ForegroundColor Cyan
}

# Kill Node processes (backend)
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "🔄 Stopping Backend Server (Node.js)..." -ForegroundColor Yellow
    taskkill /f /im node.exe
    Write-Host "✅ Backend Server stopped" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No Backend Server running" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "✅ All servers stopped!" -ForegroundColor Green
Write-Host "💡 To start servers again, run 'start-servers.ps1'" -ForegroundColor Yellow
