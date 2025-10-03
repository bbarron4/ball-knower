# Ball Knower Server Setup

This directory contains scripts to easily start and stop the Ball Knower application servers.

## Quick Start

### Option 1: Double-click (Easiest)
- Double-click `START-BALL-KNOWER.bat`
- This will start both servers and show you the status

### Option 2: PowerShell Scripts
- Right-click in the folder and select "Open PowerShell window here"
- Run: `.\start-servers.ps1`
- To stop: `.\stop-servers.ps1`

## What the Scripts Do

### `start-servers.ps1`
- Kills any existing Python/Node processes
- Verifies you're in the correct directory
- Starts backend server on port 3001
- Starts frontend server on port 8000
- Checks server status
- Shows you the localhost URLs

### `stop-servers.ps1`
- Stops all Python processes (frontend)
- Stops all Node.js processes (backend)
- Confirms servers are stopped

### `START-BALL-KNOWER.bat`
- Simple batch file that runs the PowerShell script
- Can be double-clicked from Windows Explorer

## Your Localhost URLs

- **Frontend (Main App)**: http://localhost:8000
- **Backend API**: http://localhost:3001

## Troubleshooting

### If you get "index.html not found" error:
- Make sure you're running the script from the Ball Knower project directory
- The directory should contain `index.html`, `script.js`, `styles.css`, etc.

### If servers don't start:
- Check that Python and Node.js are installed
- Make sure ports 8000 and 3001 are not being used by other applications
- Try running `stop-servers.ps1` first, then `start-servers.ps1`

### If you see directory listings instead of the app:
- The frontend server is running from the wrong directory
- Stop servers and restart using the scripts

## Manual Commands (if scripts don't work)

### Start Backend:
```powershell
cd "C:\Users\brand\Downloads\Ball Knower\backend"
node src/server.js
```

### Start Frontend:
```powershell
cd "C:\Users\brand\Downloads\Ball Knower"
python -m http.server 8000
```

### Stop All:
```powershell
taskkill /f /im python.exe
taskkill /f /im node.exe
```
