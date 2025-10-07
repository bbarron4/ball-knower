# Fix loadJerseyQuestion function
$scriptPath = "script.js"
$content = Get-Content $scriptPath -Raw

# Replace loadJerseyQuestion function
$oldJersey = @'
function loadJerseyQuestion(sport) {
    // Handle "both" sport option
    let targetSport = sport;
    if (sport === 'both') {
        // Randomly choose between NFL and NBA for "both"
        targetSport = Math.random() > 0.5 ? 'nfl' : 'nba';
    }
    
    dataLoader.loadPlayers(targetSport).then(players => {
        if (players.length > 0) {
            const question = dataLoader.createJerseyQuestion(players[0], players);
            displayMultiplayerQuestion(question);
        }
    });
}
'@

$newJersey = @'
async function loadJerseyQuestion(sport) {
    // Handle "both" sport option
    let targetSport = sport;
    if (sport === 'both') {
        // Randomly choose between NFL and NBA for "both"
        targetSport = Math.random() > 0.5 ? 'nfl' : 'nba';
    }
    
    console.log(ðŸ‘• Loading jersey questions for ${targetSport} using main game system);
    
    // Use the EXACT same system as main game
    const players = await dataLoader.loadPlayers(targetSport);
    if (players.length > 0) {
        // Use the same method as main game: createJerseyQuestionWithPlayer
        const question = dataLoader.createJerseyQuestionWithPlayer(players[0], players);
        if (question) {
            displayMultiplayerQuestion(question);
        } else {
            console.error('Failed to create jersey question');
        }
    } else {
        console.error('No players loaded for jersey questions');
    }
}
'@

# Replace the function
$content = $content -replace [regex]::Escape($oldJersey), $newJersey

Write-Host "âœ… Fixed loadJerseyQuestion function" -ForegroundColor Green
Set-Content $scriptPath $content -NoNewline
