#!/usr/bin/env python3
"""
Convert Excel file to JavaScript for Ball Knower
Usage: python excel_to_js.py your_file.xlsx
"""

import pandas as pd
import json
import sys
import os

def convert_excel_to_js(excel_file):
    """Convert Excel file to JavaScript format for Ball Knower"""
    
    try:
        # Read Excel file
        df = pd.read_excel(excel_file)
        
        # Convert to list of dictionaries
        players = []
        for _, row in df.iterrows():
            player = {
                "id": f"nfl_{str(row.get('Name', '')).lower().replace(' ', '_').replace('.', '')}",
                "name": str(row.get('Name', '')),
                "team": str(row.get('Most Recent Team', '')),
                "college": str(row.get('College', '')),
                "jersey": int(row.get('Jersey Number', 0)) if pd.notna(row.get('Jersey Number', 0)) else None,
                "position": str(row.get('Position', '')),
                "league": "NFL"
            }
            
            # Only add if name is not empty
            if player["name"] and player["name"] != "nan":
                players.append(player)
        
        # Create JavaScript content
        js_content = f"""// Well-known NFL players from Excel file
const WELL_KNOWN_PLAYERS = {json.dumps(players, indent=2)};

// Make it available globally
window.WELL_KNOWN_PLAYERS = WELL_KNOWN_PLAYERS;
"""
        
        # Write to JavaScript file
        with open('well_known_players.js', 'w', encoding='utf-8') as f:
            f.write(js_content)
        
        print(f"SUCCESS: Converted {len(players)} players from {excel_file}")
        print(f"SUCCESS: Created well_known_players.js")
        print(f"SUCCESS: Players include: {', '.join([p['name'] for p in players[:5]])}...")
        
        return True
        
    except Exception as e:
        print(f"ERROR: Error converting Excel file: {e}")
        return False

def main():
    if len(sys.argv) != 2:
        print("Usage: python excel_to_js.py your_file.xlsx")
        print("Make sure your Excel file has columns: name, team, college, jersey, position")
        return
    
    excel_file = sys.argv[1]
    
    if not os.path.exists(excel_file):
        print(f"ERROR: File not found: {excel_file}")
        return
    
    if convert_excel_to_js(excel_file):
        print("\nNext steps:")
        print("1. Test your game with the new players")
        print("2. To add more players, update your Excel file and run this script again")
        print("3. Commit and push your changes to GitHub")

if __name__ == "__main__":
    main()
