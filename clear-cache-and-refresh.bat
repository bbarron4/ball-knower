@echo off
echo Clearing browser cache and refreshing Ball Knower...
echo.

echo Step 1: Opening test page to verify logo...
start test-logo.html

echo Step 2: Opening main page with cache clear...
start "" "index.html"

echo.
echo Instructions:
echo 1. Check the test page first to see if the logo loads
echo 2. If logo loads in test page, the issue is with the main page
echo 3. If logo doesn't load in test page, the logo file might be missing
echo 4. Press Ctrl+Shift+R in your browser to hard refresh
echo 5. Check browser console (F12) for any error messages
echo.
echo Press any key to continue...
pause > nul
