# Create a simple patch file with the exact changes needed
$patchContent = @'
# MULTIPLAYER TRIVIA FIX - SIMPLE PATCH
# 
# PROBLEM: Multiplayer uses hardcoded fallback questions instead of your actual game data
# 
# SOLUTION: Replace the loadMultiplayerQuestion function to use the same system as main game
#
# INSTRUCTIONS:
# 1. Open script.js in your text editor
# 2. Find the loadMultiplayerQuestion function (around line 4046)
# 3. Replace the ENTIRE function with the code below:

async function loadMultiplayerQuestion() {
    const { sport, modes, inputType } = multiplayerGame.gameSettings;
    console.log(ðŸŽ® Loading question for sport: ${sport}, modes: ${modes.join(', ')});
    console.log('ðŸ” dataLoader available:', typeof dataLoader !== 'undefined');
    
    // Randomly select a mode from the available modes
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    console.log(Selected mode: ${randomMode});
    
    // Use the EXACT same system as the main game
    if (randomMode === 'trivia') {
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
    }
}

# WHAT THIS FIX DOES:
# âœ… NFL + Ball Trivia â†’ Uses your actual NFL trivia questions
# âœ… NBA + Ball Trivia â†’ Uses your actual NBA trivia questions  
# âœ… NFL + College Guesser â†’ Uses your actual NFL college questions
# âœ… NBA + College Guesser â†’ Uses your actual NBA college questions
# âœ… NFL + Jersey Guesser â†’ Uses your actual NFL jersey questions
# âœ… NBA + Jersey Guesser â†’ Uses your actual NBA jersey questions
# âœ… Both + Any Mode â†’ Uses both NFL and NBA questions randomly
#
# The multiplayer will now use the EXACT same questions and data as your main game!
'@

$patchContent | Out-File -FilePath "MULTIPLAYER-PATCH.txt" -Encoding UTF8
Write-Host "âœ… Created MULTIPLAYER-PATCH.txt with the exact fix you need!" -ForegroundColor Green
