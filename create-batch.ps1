# Create a simple batch file to fix the script
echo Creating fix batch file...

# Create a simple fix
echo @echo off > fix-multiplayer.bat
echo echo Fixing multiplayer trivia... >> fix-multiplayer.bat
echo powershell -Command "(Get-Content 'script.js') -replace 'console\.log\(''ðŸ”„ Using immediate fallback question system''\);', 'if (randomMode === ''trivia'') { console.log(''ðŸ“š Loading trivia question using main game system''); await loadTriviaQuestion(sport); } else if (randomMode === ''college'') { console.log(''ðŸŽ“ Loading college question using main game system''); await loadCollegeQuestion(sport); } else if (randomMode === ''jersey'') { console.log(''ðŸ‘• Loading jersey question using main game system''); await loadJerseyQuestion(sport); } else { console.log(''â“ Unknown mode, defaulting to trivia''); await loadTriviaQuestion(sport); }' | Set-Content 'script.js'" >> fix-multiplayer.bat
echo echo âœ… Fixed multiplayer trivia! >> fix-multiplayer.bat
echo pause >> fix-multiplayer.bat

Write-Host "âœ… Created fix-multiplayer.bat" -ForegroundColor Green
