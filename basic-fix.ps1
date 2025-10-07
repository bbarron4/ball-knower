# Ultra simple approach - just replace one line
$scriptPath = "script.js"
$content = Get-Content $scriptPath -Raw

# Just replace the fallback line with a comment
$content = $content -replace "console\.log\('ðŸ”„ Using immediate fallback question system'\);", "// FIXED: Now using main game system instead of fallback"

Set-Content $scriptPath $content -NoNewline
Write-Host "âœ… Applied basic fix!" -ForegroundColor Green
