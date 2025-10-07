# Simple fix for multiplayer trivia
$scriptPath = "script.js"
$content = Get-Content $scriptPath -Raw

# Replace the fallback system with proper trivia loading
$content = $content -replace "// Always use fallback for now to ensure questions load", "// Use the same question loading system as the main game"
$content = $content -replace "console\.log\('ðŸ”„ Using immediate fallback question system'\);", "if (randomMode === 'trivia') {
        console.log('ðŸ“š Loading trivia question using main game system');
        await loadTriviaQuestion(sport);
    } else if (randomMode === 'college') {
        console.log('ðŸŽ“ Loading college question');
        loadCollegeQuestion(sport);
    } else if (randomMode === 'jersey') {
        console.log('ðŸ‘• Loading jersey question');
        loadJerseyQuestion(sport);
    } else {
        console.log('â“ Unknown mode, defaulting to trivia');
        await loadTriviaQuestion(sport);
    }"

# Remove the fallback questions array and logic
$content = $content -replace "const fallbackQuestions = \[.*?\];", ""
$content = $content -replace "// Pick a random question and randomize the answer order.*?displayMultiplayerQuestion\(question\);", ""

Set-Content $scriptPath $content -NoNewline
Write-Host "âœ… Applied targeted fix to multiplayer trivia!" -ForegroundColor Green
