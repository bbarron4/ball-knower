# Direct fix using sed-like approach
$scriptPath = "script.js"
$content = Get-Content $scriptPath -Raw

# Find the exact start and end of the function
$startMarker = "async function loadMultiplayerQuestion() {"
$endMarker = "}"

# Split content into lines
$lines = $content -split "
"
$newLines = @()
$inFunction = $false
$functionStartLine = -1

for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match "async function loadMultiplayerQuestion\(\) \{") {
        $inFunction = $true
        $functionStartLine = $i
        # Add the new function
        $newLines += "async function loadMultiplayerQuestion() {"
        $newLines += "    const { sport, modes, inputType } = multiplayerGame.gameSettings;"
        $newLines += "    console.log(ðŸŽ® Loading question for sport: ${sport}, modes: ${modes.join(', ')});"
        $newLines += "    console.log('ðŸ” dataLoader available:', typeof dataLoader !== 'undefined');"
        $newLines += "    "
        $newLines += "    // Randomly select a mode from the available modes"
        $newLines += "    const randomMode = modes[Math.floor(Math.random() * modes.length)];"
        $newLines += "    console.log(Selected mode: ${randomMode});"
        $newLines += "    "
        $newLines += "    // Use the same question loading system as the main game"
        $newLines += "    if (randomMode === 'trivia') {"
        $newLines += "        console.log('ðŸ“š Loading trivia question using main game system');"
        $newLines += "        await loadTriviaQuestion(sport);"
        $newLines += "    } else if (randomMode === 'college') {"
        $newLines += "        console.log('ðŸŽ“ Loading college question');"
        $newLines += "        loadCollegeQuestion(sport);"
        $newLines += "    } else if (randomMode === 'jersey') {"
        $newLines += "        console.log('ðŸ‘• Loading jersey question');"
        $newLines += "        loadJerseyQuestion(sport);"
        $newLines += "    } else {"
        $newLines += "        console.log('â“ Unknown mode, defaulting to trivia');"
        $newLines += "        await loadTriviaQuestion(sport);"
        $newLines += "    }"
        $newLines += "}"
        continue
    }
    
    if ($inFunction) {
        # Skip lines until we find the closing brace
        if ($lines[$i] -match "^\s*\}\s*$") {
            $inFunction = $false
        }
        continue
    }
    
    $newLines += $lines[$i]
}

# Write the new content
$newContent = $newLines -join "
"
Set-Content $scriptPath $newContent -NoNewline
Write-Host "âœ… Successfully fixed multiplayer trivia function!" -ForegroundColor Green
