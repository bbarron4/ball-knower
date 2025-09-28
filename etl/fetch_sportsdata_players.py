#!/usr/bin/env python3
"""
Fetch NFL & NBA players from SportsDataIO and write CSVs expected by the ETL.
Usage:
  export SPORTSDATA_API_KEY=your_key
  python etl/fetch_sportsdata_players.py --nfl-season 2024 --nba-season 2024
"""
import os, sys, argparse, requests, csv, datetime

API_KEY = os.getenv("SPORTSDATA_API_KEY") or os.getenv("SPORTS_DATA_KEY") or os.getenv("SPORTSDATAIO_KEY")
if not API_KEY:
    print("Set SPORTSDATA_API_KEY in your environment.", file=sys.stderr); sys.exit(1)

BASE_NFL = "https://api.sportsdata.io/v3/nfl"
BASE_NBA = "https://api.sportsdata.io/v3/nba"
HEADERS = {"Ocp-Apim-Subscription-Key": API_KEY}

def get(url):
    r = requests.get(url, headers=HEADERS, timeout=30); r.raise_for_status(); return r.json()

def fetch_players(league): return get(f"{BASE_NFL if league=='NFL' else BASE_NBA}/scores/json/Players")
def fetch_season_stats(league, season): return get(f"{BASE_NFL if league=='NFL' else BASE_NBA}/stats/json/PlayerSeasonStats/{season}")

def slugify(name):
    s = ''.join(ch.lower() if ch.isalnum() else '_' for ch in name).strip('_')
    return '_'.join([x for x in s.split('_') if x])

def build_csv(players, stats, league, out_path):
    starts = {s.get("PlayerID"): int(s.get("Started") or s.get("GamesStarted") or 0) for s in stats}
    now_year = datetime.date.today().year
    fields = ["id","name","team","college","hs","positions","from","to","games","approx_value","win_shares","active","jersey_current","jerseys","awards_json","recent_starter_games"]
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields); w.writeheader()
        for p in players:
            pid = p.get("PlayerID")
            name = (p.get("Name") or f"{(p.get('FirstName') or '').strip()} {(p.get('LastName') or '').strip()}").strip()
            team = p.get("Team") or p.get("CurrentTeam") or ""
            college = p.get("College") or ""
            hs = p.get("HighSchool") or ""
            pos = p.get("Position") or p.get("PositionCategory") or ""
            num = p.get("Number") or p.get("Jersey") or ""
            status = (p.get("Status") or "").lower()
            active = "false" if status in ("inactive","retired","unknown","free agent") else "true"

            draft_year = p.get("DraftYear")
            exp = p.get("Experience")
            try: from_year = int(draft_year) if draft_year and int(draft_year)>1900 else (now_year - int(exp) if exp else now_year)
            except: from_year = now_year
            to_year = now_year if active=="true" else from_year
            games = int(p.get("Games") or p.get("CareerGames") or 0)
            jerseys = str(num) if str(num).isdigit() else ""
            w.writerow({
                "id": f"{league.lower()}_{slugify(name)}",
                "name": name, "team": team, "college": college, "hs": hs, "positions": pos,
                "from": from_year, "to": to_year, "games": games,
                "approx_value": 0 if league=="NFL" else "", "win_shares": "" if league=="NFL" else 0,
                "active": active, "jersey_current": num if str(num).isdigit() else "",
                "jerseys": jerseys, "awards_json": "{}", "recent_starter_games": starts.get(pid, 0),
            })

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--nfl-season", type=int, default=datetime.date.today().year)
    ap.add_argument("--nba-season", type=int, default=datetime.date.today().year)
    ap.add_argument("--out-nfl", default="etl/input/nfl_players.csv")
    ap.add_argument("--out-nba", default="etl/input/nba_players.csv")
    args = ap.parse_args()
    print(f"Fetching NFL players for {args.nfl_season}...")
    nfl_players = fetch_players("NFL"); nfl_stats = fetch_season_stats("NFL", args.nfl_season)
    build_csv(nfl_players, nfl_stats, "NFL", args.out_nfl)
    print(f"Fetching NBA players for {args.nba_season}...")
    nba_players = fetch_players("NBA"); nba_stats = fetch_season_stats("NBA", args.nba_season)
    build_csv(nba_players, nba_stats, "NBA", args.out_nba)
    print(f"Wrote {args.out_nfl} ({len(nfl_players)} players) and {args.out_nba} ({len(nba_players)} players)")

if __name__ == "__main__": main()
