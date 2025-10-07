# Ultra simple fix - just replace the fallback line
$scriptPath = "script.js"
$content = Get-Content $scriptPath -Raw

# Replace the fallback line with proper function calls
$content = $content -replace "console\.log\('ðŸ”„ Using immediate fallback question system'\);", "if (randomMode === 'trivia') {
        console.log('ðŸ“š Loading trivia question using main game system');
        await loadTriviaQuestion(sport);
    } else if (randomMode === 'college') {
        console.log('ðŸŽ“ Loading college question using main game system');
        await loadCollegeQuestion(sport);
    } else if (randomMode === 'jersey') {
        console.log('ðŸ‘• Loading jersey question using main game system');
        await loadJerseyQuestion(sport);
    } else {
        console.log('â“ Unknown mode, defaulting to trivia');
        await loadTriviaQuestion(sport);
    }"

Set-Content $scriptPath $content -NoNewline
Write-Host "âœ… Applied ultra simple fix!" -ForegroundColor Green
