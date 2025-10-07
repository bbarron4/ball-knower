# Simple text replacement fix
$scriptPath = "script.js"
$content = Get-Content $scriptPath -Raw

# Replace the key line that forces fallback
$content = $content -replace "console\.log\('ðŸ”„ Using immediate fallback question system'\);", "// Use proper trivia loading instead of fallback"

Set-Content $scriptPath $content -NoNewline
Write-Host "âœ… Applied simple fix!" -ForegroundColor Green
