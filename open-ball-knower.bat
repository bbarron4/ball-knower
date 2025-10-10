@echo off
echo Opening Ball Knower from the correct directory...
echo.

cd /d "C:\Users\brand\Downloads\Ball Knower"

echo Current directory: %CD%
echo.
echo Files in directory:
dir *.html
echo.
echo Logo file:
dir ballknowerlogo.png
echo.

echo Opening index.html...
start index.html

echo.
echo If the logo still doesn't show:
echo 1. Make sure you're opening the file from this directory
echo 2. Try opening test-logo.html first to test the logo
echo 3. Press Ctrl+Shift+R to hard refresh
echo 4. Check browser console (F12) for errors
echo.
pause
