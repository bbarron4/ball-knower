# Create a completely new loadMultiplayerQuestion function
$scriptPath = "script.js"
$content = Get-Content $scriptPath -Raw

# Find the start and end of the loadMultiplayerQuestion function
$startPattern = "async function loadMultiplayerQuestion\(\) \{"
$endPattern = "^\}"

# Create the new function
$newFunction = @'
async function loadMultiplayerQuestion() {
    const { sport, modes, inputType } = multiplayerGame.gameSettings;
    console.log(ðŸŽ® Loading question for sport: ${sport}, modes: ${modes.join(', ')});
    console.log('ðŸ” dataLoader available:', typeof dataLoader !== 'undefined');
    
    // Randomly select a mode from the available modes
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    console.log(Selected mode: ${randomMode});
    
    // Use the same question loading system as the main game
    if (randomMode === 'trivia') {
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
    }
}
'@

# Replace the entire function
$content = $content -replace "(?s)async function loadMultiplayerQuestion\(\) \{.*?^\}", $newFunction

Set-Content $scriptPath $content -NoNewline
Write-Host "âœ… Replaced entire loadMultiplayerQuestion function!" -ForegroundColor Green
