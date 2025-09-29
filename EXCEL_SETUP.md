# Excel Player Data Setup

## How to Use Your Excel File

### 1. **Prepare Your Excel File**
Your Excel file should have these columns:
- **name** - Player's full name (e.g., "Patrick Mahomes")
- **team** - Team abbreviation (e.g., "KC", "BUF", "LAR")
- **college** - College name (e.g., "Texas Tech", "Michigan")
- **jersey** - Jersey number (e.g., 15, 12, 17)
- **position** - Position (e.g., "QB", "WR", "RB", "TE", "DT", "LB", "DE", "K")

### 2. **Convert Excel to JavaScript**
```bash
python excel_to_js.py your_file.xlsx
```

This will create `well_known_players.js` with all your players.

### 3. **Test Your Game**
1. Open `index.html` in your browser
2. Try all game modes (College Guesser, Jersey Guesser, Achievement Guesser)
3. Make sure questions work properly

### 4. **Add More Players**
1. Open your Excel file
2. Add new rows with player data
3. Run `python excel_to_js.py your_file.xlsx` again
4. Test the game
5. Commit and push to GitHub

### 5. **Deploy to GitHub**
```bash
git add .
git commit -m "Update player data from Excel"
git push origin main
```

## Example Excel Format

| name | team | college | jersey | position |
|------|------|---------|--------|----------|
| Patrick Mahomes | KC | Texas Tech | 15 | QB |
| Tom Brady | TB | Michigan | 12 | QB |
| Cooper Kupp | LAR | Eastern Washington | 10 | WR |

## Tips
- Keep player names consistent
- Use standard team abbreviations (KC, BUF, LAR, etc.)
- Make sure jersey numbers are integers
- Use standard position abbreviations (QB, WR, RB, TE, etc.)
