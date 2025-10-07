# Create a new script.js with the fixed functions
$scriptPath = "script.js"
$content = Get-Content $scriptPath -Raw

# Fix 1: Replace loadMultiplayerQuestion function
$oldLoadMultiplayer = @'
async function loadMultiplayerQuestion() {
    const { sport, modes, inputType } = multiplayerGame.gameSettings;
    console.log(Loading question for sport: ${sport}, modes: ${modes.join(', ')});
    console.log('ðŸ” dataLoader available:', typeof dataLoader !== 'undefined');
    
    // Randomly select a mode from the available modes
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    console.log(Selected mode: ${randomMode});
    
    // Always use fallback for now to ensure questions load
    console.log('ðŸ”„ Using immediate fallback question system');
    const fallbackQuestions = [
        {
            type: 'trivia',
            question: 'Which NFL team won the most Super Bowls?',
            options: ['New England Patriots', 'Pittsburgh Steelers', 'Dallas Cowboys', 'San Francisco 49ers'],
            correctAnswer: 'New England Patriots',
            category: 'General',
            difficulty: 'medium',
            league: 'NFL'
        },
        {
            type: 'trivia',
            question: 'Who is the all-time leading rusher in NFL history?',
            options: ['Emmitt Smith', 'Walter Payton', 'Barry Sanders', 'Adrian Peterson'],
            correctAnswer: 'Emmitt Smith',
            category: 'General',
            difficulty: 'medium',
            league: 'NFL'
        },
        {
            type: 'trivia',
            question: 'Which quarterback has the most career passing yards?',
            options: ['Tom Brady', 'Peyton Manning', 'Drew Brees', 'Brett Favre'],
            correctAnswer: 'Tom Brady',
            category: 'General',
            difficulty: 'medium',
            league: 'NFL'
        }
    ];
    
    // Pick a random question and randomize the answer order
    const randomQuestion = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
    const shuffledOptions = [...randomQuestion.options].sort(() => Math.random() - 0.5);
    
    const question = {
        ...randomQuestion,
        options: shuffledOptions
    };
    
    console.log('ðŸŽ¯ Using fallback question:', question);
    displayMultiplayerQuestion(question);
}
'@

$newLoadMultiplayer = @'
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
'@

# Replace the function
$content = $content -replace [regex]::Escape($oldLoadMultiplayer), $newLoadMultiplayer

Write-Host "âœ… Fixed loadMultiplayerQuestion function" -ForegroundColor Green
Set-Content $scriptPath $content -NoNewline
