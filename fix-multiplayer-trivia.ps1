# Fix multiplayer trivia to use same questions as main game
$scriptPath = "script.js"
$content = Get-Content $scriptPath -Raw

# Replace the loadMultiplayerQuestion function
$oldFunction = @'
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

# Replace the function
$content = $content -replace [regex]::Escape($oldFunction), $newFunction

# Write back to file
Set-Content $scriptPath $content -NoNewline
Write-Host "âœ… Fixed multiplayer trivia to use same questions as main game!" -ForegroundColor Green
