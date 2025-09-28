#!/usr/bin/env python3
import os, json, math, datetime, argparse, yaml, csv
import pandas as pd
import numpy as np

def parse_bool(x):
    if isinstance(x, bool): return x
    return str(x).strip().lower() in ("1","true","t","yes","y")

def to_list_nums(x):
    if pd.isna(x) or x == "": return []
    try:
        return [int(float(s)) for s in str(x).replace("|",",").split(",") if str(s).strip()!="" and str(s).strip()!="nan"]
    except:
        return []

def to_list_str(x):
    if pd.isna(x) or x == "": return []
    return [s.strip() for s in str(x).replace("|",",").split(",") if s.strip()!=""]

def log1(x):
    try: return math.log1p(float(x) if x is not None else 0.0)
    except Exception: return 0.0

def load_csv(path, league):
    df = pd.read_csv(path)
    df["league"] = league
    for col in ["hs","approx_value","win_shares","recent_starter_games","awards_json","positions","jerseys","active"]:
        if col not in df.columns: df[col] = np.nan
    df["positions"] = df["positions"].apply(to_list_str)
    df["jerseys"] = df["jerseys"].apply(to_list_nums)
    df["active"] = df["active"].apply(parse_bool)
    df["awards"] = df["awards_json"].apply(lambda s: {} if pd.isna(s) or s=="" else json.loads(s))
    return df

def score_row(row, weights, points, league):
    seasons = (int(row["to"]) - int(row["from"]) + 1) if not pd.isna(row["to"]) and not pd.isna(row["from"]) else 0
    games = int(row.get("games",0) or 0)
    recent = int(row.get("recent_starter_games",0) or 0)
    awards = row.get("awards",{}) or {}
    award_sum = sum(float(awards.get(k,0) or 0) * float(v) for k, v in points.items())
    score = (
        weights.get("log_games",0)*log1(games) +
        weights.get("log_seasons",0)*log1(seasons) +
        weights.get("awards",0)*(award_sum) +
        weights.get("log_recent_starts",0)*log1(recent)
    )
    if league == "NFL":
        score += weights.get("log_approx_value",0)*log1(row.get("approx_value",0))
    else:
        score += weights.get("log_win_shares",0)*log1(row.get("win_shares",0))
    if parse_bool(row.get("active",False)):
        score += weights.get("active_bonus",0)
    return score

def auto_downweight_awards(weights, df, threshold=0.40):
    cov = (df["awards"].apply(lambda a: sum((a or {}).values()) > 0).mean()) if len(df) else 0.0
    new_w = dict(weights)
    if cov < threshold:
        new_w["awards"] = new_w.get("awards", 0.0) * cov
    return new_w, cov

def tierize(series, easy_pct, med_pct, small_sample_threshold=50):
    s = np.array(series, dtype=float); n = len(s)
    if n == 0: return []
    if n < small_sample_threshold:
        s_sorted = np.sort(s)
        e_idx = max(1, int(n * (1 - easy_pct)))
        m_idx = max(1, int(n * (1 - med_pct)))
        q_hi = s_sorted[e_idx-1]; q_mid = s_sorted[m_idx-1]
    else:
        q_mid, q_hi = np.quantile(s, [med_pct, 1 - easy_pct])
    def lab(x): return "easy" if x >= q_hi else ("medium" if x >= q_mid else "hard")
    return [lab(x) for x in s]

def minimal_row(r):
    return dict(
        id=r["id"], name=r["name"], league=r["league"], team=r.get("team",""),
        college=r.get("college") if pd.notna(r.get("college")) else None,
        hs=r.get("hs") if pd.notna(r.get("hs")) else None,
        jersey_current=int(r.get("jersey_current")) if str(r.get("jersey_current")).replace('.0','').isdigit() else None,
        jerseys=r.get("jerseys") if isinstance(r.get("jerseys"), list) else [],
        positions=r.get("positions") if isinstance(r.get("positions"), list) else [],
        **{"from": int(r.get("from")), "to": int(r.get("to"))},
        active=parse_bool(r.get("active", False)),
        tier=r["tier"]
    )

def get_config_key(cfg, key):
    """Handle BOM in config keys"""
    if key in cfg:
        return cfg[key]
    # Look for BOM-prefixed key
    for k in cfg.keys():
        if k.endswith(key):
            return cfg[k]
    raise KeyError(f"Key '{key}' not found in config")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", default="etl/config.yaml")
    args = ap.parse_args()
    with open(args.config, encoding='utf-8-sig') as f: cfg = yaml.safe_load(f)

    sources = get_config_key(cfg, 'sources')
    nfl = load_csv(sources["nfl_players_csv"], "NFL")
    nba = load_csv(sources["nba_players_csv"], "NBA")
    
    for df in (nfl, nba):
        for col in ["id","name","team","college","from","to","games","active","jersey_current"]:
            if col not in df.columns: raise SystemExit(f"Missing column '{col}'")
        df["from"] = df["from"].astype(int); df["to"] = df["to"].astype(int)

    scoring = get_config_key(cfg, 'scoring')
    nfl_w, nfl_cov = auto_downweight_awards(scoring["nfl"]["weights"], nfl)
    nba_w, nba_cov = auto_downweight_awards(scoring["nba"]["weights"], nba)

    nfl["popularity_score"] = nfl.apply(lambda r: score_row(r, nfl_w, scoring["nfl"]["award_points"], "NFL"), axis=1)
    nba["popularity_score"] = nba.apply(lambda r: score_row(r, nba_w, scoring["nba"]["award_points"], "NBA"), axis=1)

    # Skip overrides for now - just use automatic tiers
    tiers = get_config_key(cfg, 'tiers')
    easy_pct_nfl = tiers["nfl"]["easy_pct"];  med_pct_nfl = tiers["nfl"]["medium_pct"]
    easy_pct_nba = tiers["nba"]["easy_pct"];  med_pct_nba = tiers["nba"]["medium_pct"]
    thresh = cfg.get("tiering",{}).get("small_sample_threshold", 50)

    nfl["tier"] = tierize(nfl["popularity_score"], easy_pct_nfl, med_pct_nfl, thresh)
    nba["tier"] = tierize(nba["popularity_score"], easy_pct_nba, med_pct_nba, thresh)

    master = pd.concat([nfl, nba], ignore_index=True)
    version = datetime.date.today().isoformat() if cfg.get("data_version","auto")=="auto" else cfg["data_version"]
    master["data_version"] = version

    out = get_config_key(cfg, 'export_dir'); os.makedirs(out, exist_ok=True)
    for league, df_l in master.groupby("league"):
        for tier, df_t in df_l.groupby("tier"):
            rows = [minimal_row(r) for _, r in df_t.iterrows()]
            with open(os.path.join(out, f"{league}_{tier}.json"), "w", encoding="utf-8") as f:
                json.dump(rows, f, ensure_ascii=False, indent=2)
            print(f"Exported {len(rows)} players to {league}_{tier}.json")

    master.to_csv(os.path.join(out, "master.csv"), index=False)
    with open(os.path.join(out, "data_version.json"), "w") as f:
        json.dump({"version": version}, f)

    print(f"award_coverage: NFL={nfl_cov:.2f}, NBA={nba_cov:.2f}")
    print("Wrote shards to", out)

if __name__ == "__main__":
    main()
