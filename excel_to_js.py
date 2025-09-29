import pandas as pd
import json
import sys
import os

def convert_nfl_excel_to_js(excel_file):
    """Convert NFL Excel file to JavaScript"""
    players = []
    
    try:
        # Read Excel file
        df = pd.read_excel(excel_file)
        
        # Convert to list of dictionaries
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
        
        return players
        
    except Exception as e:
        print(f"ERROR: Error converting NFL Excel file: {e}")
        return []

def convert_nba_excel_to_js(excel_file):
    """Convert NBA Excel file to JavaScript"""
    players = []
    
    try:
        # Read Excel file
        df = pd.read_excel(excel_file)
        
        # Convert to list of dictionaries
        for _, row in df.iterrows():
            college_origin = str(row.get('College/Origin', ''))
            
            player = {
                "id": f"nba_{str(row.get('Name', '')).lower().replace(' ', '_').replace('.', '')}",
                "name": str(row.get('Name', '')),
                "team": str(row.get('Team Most Associated', '')),
                "college": college_origin,
                "jersey": int(row.get('Jersey #', 0)) if pd.notna(row.get('Jersey #', 0)) else None,
                "position": "",  # NBA file doesn't have position
                "league": "NBA"
            }
            
            # Only add if name is not empty
            if player["name"] and player["name"] != "nan":
                players.append(player)
        
        return players
        
    except Exception as e:
        print(f"ERROR: Error converting NBA Excel file: {e}")
        return []

def main():
    # Process NFL file
    nfl_file = 'NFL_master_list.xlsx'
    nba_file = 'NBA_master_list.xlsx'
    
    nfl_players = []
    nba_players = []
    
    if os.path.exists(nfl_file):
        nfl_players = convert_nfl_excel_to_js(nfl_file)
        print(f"SUCCESS: Converted {len(nfl_players)} NFL players from {nfl_file}")
    else:
        print(f"WARNING: {nfl_file} not found")
    
    if os.path.exists(nba_file):
        nba_players = convert_nba_excel_to_js(nba_file)
        print(f"SUCCESS: Converted {len(nba_players)} NBA players from {nba_file}")
    else:
        print(f"WARNING: {nba_file} not found")
    
    # Combine all players
    all_players = nfl_players + nba_players
    
    if not all_players:
        print("ERROR: No players found in either file")
        return
    
    # Generate JavaScript content with separate arrays
    js_content = f"""// Well-known NFL and NBA players from Excel files
const NFL_PLAYERS = {json.dumps(nfl_players, indent=2)};

const NBA_PLAYERS = {json.dumps(nba_players, indent=2)};

// Combined for compatibility
const WELL_KNOWN_PLAYERS = {json.dumps(all_players, indent=2)};
"""
    
    # Write to JavaScript file
    with open('well_known_players.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"\nSUCCESS: Created well_known_players.js")
    print(f"  - {len(nfl_players)} NFL players")
    print(f"  - {len(nba_players)} NBA players")
    print(f"  - {len(all_players)} total players")
    
    if nfl_players:
        print(f"\nNFL sample: {', '.join([p['name'] for p in nfl_players[:5]])}...")
    if nba_players:
        print(f"NBA sample: {', '.join([p['name'] for p in nba_players[:5]])}...")
    
    print("\nNext steps:")
    print("1. Test your game with both NFL and NBA players")
    print("2. To add more players, update your Excel files and run: python excel_to_js.py")
    print("3. Commit and push your changes to GitHub")

if __name__ == "__main__":
    main()