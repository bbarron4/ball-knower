# Simple text replacement approach
$scriptPath = "script.js"
$content = Get-Content $scriptPath -Raw

# Replace the key line that forces fallback
$content = $content -replace "console\.log\('ðŸ”„ Using immediate fallback question system'\);", "// Use proper trivia loading instead of fallback"

# Replace the fallback logic with proper function calls
$content = $content -replace "const fallbackQuestions = \[.*?\];", "// Use main game system instead of fallback"
$content = $content -replace "// Pick a random question and randomize the answer order.*?displayMultiplayerQuestion\(question\);", "if (randomMode === 'trivia') {
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
Write-Host "âœ… Applied simple text replacements!" -ForegroundColor Green
