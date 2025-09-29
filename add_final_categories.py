import json, os, datetime

today = "2025-09-29"

def make_q(num, qid, question, choices, correct_id, category, difficulty, tags=None, context=""):
    return {
        "number": num,
        "id": qid,
        "question": question,
        "choices": [{"id": k, "text": v} for k, v in choices],
        "correctChoiceId": correct_id,
        "category": category,
        "difficulty": difficulty,
        "tags": tags or [],
        "contextNote": context,
        "isActive": True,
        "createdAt": today
    }

# Load existing questions
with open('data/trivia/nba_questions.json', 'r', encoding='utf-8') as f:
    Q = json.load(f)

n = len(Q)
def add(qid, question, choices, correct, category, difficulty, tags=None, context=""):
    global n
    n += 1
    Q.append(make_q(n, qid, question, choices, correct, category, difficulty, tags, context))

# ---- Arenas / Relocations ----
add("arena-msg-knicks",
    "Which team plays home games at Madison Square Garden?",
    [("new_york_knicks","New York Knicks"),("brooklyn_nets","Brooklyn Nets"),("philadelphia_76ers","Philadelphia 76ers"),("boston_celtics","Boston Celtics")],
    "new_york_knicks","Arena","easy",["arena"])

add("arena-chase-center-warriors",
    "Which team plays at Chase Center?",
    [("golden_state_warriors","Golden State Warriors"),("los_angeles_lakers","Los Angeles Lakers"),("la_clippers","LA Clippers"),("sacramento_kings","Sacramento Kings")],
    "golden_state_warriors","Arena","easy",["arena"])

add("arena-crypto-lakers-clippers",
    "Crypto.com Arena (formerly Staples Center) has been home to which teams?",
    [("lakers_clippers","Lakers & Clippers"),("lakers_kings","Lakers & Kings"),("clippers_kings","Clippers & Kings"),("lakers_warriors","Lakers & Warriors")],
    "lakers_clippers","Arena","medium",["arena"])

add("arena-td-garden-celtics",
    "Which team plays at TD Garden?",
    [("boston_celtics","Boston Celtics"),("brooklyn_nets","Brooklyn Nets"),("toronto_raptors","Toronto Raptors"),("miami_heat","Miami Heat")],
    "boston_celtics","Arena","easy",["arena"])

add("arena-ball-arena-nuggets",
    "Ball Arena is home to which NBA team?",
    [("denver_nuggets","Denver Nuggets"),("phoenix_suns","Phoenix Suns"),("utah_jazz","Utah Jazz"),("oklahoma_city_thunder","Oklahoma City Thunder")],
    "denver_nuggets","Arena","easy",["arena"])

add("arena-fiserv-bucks",
    "Fiserv Forum is home to which NBA team?",
    [("milwaukee_bucks","Milwaukee Bucks"),("minnesota_timberwolves","Minnesota Timberwolves"),("detroit_pistons","Detroit Pistons"),("indiana_pacers","Indiana Pacers")],
    "milwaukee_bucks","Arena","easy",["arena"])

add("arena-footprint-suns",
    "Footprint Center is home to which NBA team?",
    [("phoenix_suns","Phoenix Suns"),("utah_jazz","Utah Jazz"),("denver_nuggets","Denver Nuggets"),("sacramento_kings","Sacramento Kings")],
    "phoenix_suns","Arena","easy",["arena"])

add("arena-intuit-dome-clippers",
    "Which new arena is the LA Clippers' home starting in the mid-2020s?",
    [("intuit_dome","Intuit Dome"),("crypto_com_arena","Crypto.com Arena"),("honda_center","Honda Center"),("the_forum","The Forum")],
    "intuit_dome","Arena","medium",["arena","clippers"])

add("arena-oldest-msg",
    "What is the oldest NBA arena still in use (opened 1968)?",
    [("madison_square_garden","Madison Square Garden"),("td_garden","TD Garden"),("chase_center","Chase Center"),("united_center","United Center")],
    "madison_square_garden","Arena","medium",["arena","history"])

add("arena-largest-capacity-united-center",
    "Which NBA arena has the largest seating capacity (about 20,900)?",
    [("united_center","United Center (Bulls)"),("madison_square_garden","Madison Square Garden (Knicks)"),("wells_fargo_center","Wells Fargo Center (76ers)"),("at_t_center","AT&T Center (Spurs)")],
    "united_center","Arena","medium",["arena","capacity"])

add("franchise-move-sonics-thunder",
    "Which franchise relocated from Seattle to become the Thunder in 2008?",
    [("seattle_supersonics","Seattle SuperSonics"),("vancouver_grizzlies","Vancouver Grizzlies"),("new_orleans_hornets","New Orleans Hornets"),("san_diego_clippers","San Diego Clippers")],
    "seattle_supersonics","Team","easy",["relocation"])

add("franchise-move-vancouver-memphis",
    "Which team moved from Vancouver to Memphis in 2001?",
    [("grizzlies","Grizzlies"),("kings","Kings"),("hornets","Hornets"),("nets","Nets")],
    "grizzlies","Team","easy",["relocation"])

add("franchise-move-nets-brooklyn",
    "Which team moved to Brooklyn in 2012?",
    [("nets","Nets"),("knicks","Knicks"),("sixers","76ers"),("celtics","Celtics")],
    "nets","Team","easy",["relocation"])

add("franchise-name-bobcats-hornets",
    "The Charlotte Bobcats changed their name back to what in 2014?",
    [("hornets","Hornets"),("bobcats","Bobcats"),("pelicans","Pelicans"),("bullets","Bullets")],
    "hornets","Team","easy",["rebrand"])

# ---- More comebacks/series ----
add("series-2016-finals-3-1-cavs",
    "Which team came back from a 3–1 deficit to win the 2016 NBA Finals?",
    [("cleveland_cavaliers","Cleveland Cavaliers"),("golden_state_warriors","Golden State Warriors"),("san_antonio_spurs","San Antonio Spurs"),("miami_heat","Miami Heat")],
    "cleveland_cavaliers","Team","easy",["finals","comeback"])

add("series-2020-clippers-blew-3-1",
    "Which team blew a 3–1 series lead to the Nuggets in the 2020 bubble playoffs?",
    [("la_clippers","LA Clippers"),("utah_jazz","Utah Jazz"),("houston_rockets","Houston Rockets"),("oklahoma_city_thunder","Oklahoma City Thunder")],
    "la_clippers","Team","medium",["playoffs","bubble"])

add("series-8-seed-finals-heat-2023",
    "Which 8-seed reached the NBA Finals in 2023, the second 8-seed ever to do so?",
    [("miami_heat","Miami Heat"),("memphis_grizzlies","Memphis Grizzlies"),("detroit_pistons","Detroit Pistons"),("dallas_mavericks","Dallas Mavericks")],
    "miami_heat","Team","medium",["playoffs","seed"])

add("game-biggest-regular-comeback-36",
    "What is the largest regular-season comeback in NBA history and which team did it?",
    [("jazz_36","36 points – Utah Jazz"),("lakers_29","29 points – Los Angeles Lakers"),("celtics_40","40 points – Boston Celtics"),("clippers_35","35 points – LA Clippers")],
    "jazz_36","Team","hard",["record","comeback"])

# ---- Defense / Awards extras ----
add("defense-dpoy-back-to-back-kawhi",
    "Which forward won back-to-back Defensive Player of the Year awards in 2015 & 2016?",
    [("kawhi_leonard","Kawhi Leonard"),("draymond_green","Draymond Green"),("giannis_antetokounmpo","Giannis Antetokounmpo"),("anthony_davis","Anthony Davis")],
    "kawhi_leonard","Defense","medium",["dpoy"])

add("defense-most-dpoy-mutombo",
    "Who is tied for most Defensive Player of the Year awards with 4?",
    [("dikembe_mutombo","Dikembe Mutombo"),("ben_wallace","Ben Wallace"),("rudy_gobert","Rudy Gobert"),("dwight_howard","Dwight Howard")],
    "dikembe_mutombo","Defense","medium",["dpoy"])

add("defense-most-dpoy-ben-wallace",
    "Who is tied with Mutombo for most DPOY awards (4)?",
    [("ben_wallace","Ben Wallace"),("rudy_gobert","Rudy Gobert"),("dwight_howard","Dwight Howard"),("draymond_green","Draymond Green")],
    "ben_wallace","Defense","medium",["dpoy"])

# ---- International & Olympics ----
add("olympics-dream-team-year",
    "In what year did Team USA first include active NBA players at the Olympics?",
    [("1988","1988"),("1992","1992"),("1996","1996"),("2000","2000")],
    "1992","Team","easy",["olympics","dream_team"])

add("olympics-2004-argentina-gold",
    "Which country won men's basketball gold at the 2004 Olympics?",
    [("spain","Spain"),("argentina","Argentina"),("greece","Greece"),("lithuania","Lithuania")],
    "argentina","Team","medium",["olympics"])

add("olympics-ussr-multiple-golds",
    "Besides the USA, which country has won multiple Olympic golds in men's basketball?",
    [("spain","Spain"),("soviet_union","Soviet Union"),("yugoslavia","Yugoslavia"),("argentina","Argentina")],
    "soviet_union","Team","hard",["olympics","history"])

add("olympics-dream-team-top-scorer",
    "Who led the 1992 USA 'Dream Team' in scoring?",
    [("michael_jordan","Michael Jordan"),("charles_barkley","Charles Barkley"),("karl_malone","Karl Malone"),("magic_johnson","Magic Johnson")],
    "charles_barkley","Player","medium",["olympics"])

add("olympics-only-college-player-1992",
    "Who was the only collegiate player on the 1992 Dream Team?",
    [("grant_hill","Grant Hill"),("shaquille_oneal","Shaquille O'Neal"),("christian_laettner","Christian Laettner"),("tim_hardaway","Tim Hardaway")],
    "christian_laettner","Player","easy",["olympics"])

add("olympics-redeem-team-2008",
    "What nickname was given to the 2008 USA Olympic basketball team?",
    [("redeem_team","The Redeem Team"),("dream_team_ii","The Dream Team II"),("gold_standard","The Gold Standard"),("avengers","The Avengers")],
    "redeem_team","Team","easy",["olympics","nickname"])

add("mvp-first-international-hakeem",
    "Who was the first international-born NBA MVP?",
    [("dirk_nowitzki","Dirk Nowitzki"),("hakeem_olajuwon","Hakeem Olajuwon"),("steve_nash","Steve Nash"),("giannis_antetokounmpo","Giannis Antetokounmpo")],
    "hakeem_olajuwon","Player","medium",["international","mvp"])

add("scoring-first-international-embiid",
    "Why was Joel Embiid's 2022 scoring title historic?",
    [("youngest","Youngest scoring champ ever"),("first_center_since_shaq","First center to lead since Shaq"),("first_international","First international scoring champ"),("avg_35","Averaged over 35 PPG")],
    "first_international","Player","medium",["international","scoring"])

add("mvp-first-european-dirk",
    "Who was the first European-born NBA MVP?",
    [("tony_parker","Tony Parker"),("pau_gasol","Pau Gasol"),("dirk_nowitzki","Dirk Nowitzki"),("giannis_antetokounmpo","Giannis Antetokounmpo")],
    "dirk_nowitzki","Player","medium",["international","mvp"])

add("fiba-2023-winner-germany",
    "Which country won the 2023 FIBA Basketball World Cup?",
    [("usa","USA"),("spain","Spain"),("serbia","Serbia"),("germany","Germany")],
    "germany","Team","medium",["fiba","world_cup"])

add("olympics-vince-over-weis",
    "Vince Carter's iconic dunk over a 7'2\" center happened against which country (2000 Olympics)?",
    [("france","France"),("russia","Russia"),("australia","Australia"),("canada","Canada")],
    "france","Moment","medium",["olympics","dunk"])

add("international-most-players-canada",
    "As of mid-2020s, which country has the most NBA players outside the USA?",
    [("france","France"),("canada","Canada"),("australia","Australia"),("spain","Spain")],
    "canada","Team","medium",["international","nba_players"])

# ---- Pop culture & memes ----
add("culture-real-mvp-durant",
    "Which star's 2014 MVP speech ('You're the real MVP') became a meme?",
    [("lebron_james","LeBron James"),("stephen_curry","Stephen Curry"),("kevin_durant","Kevin Durant"),("russell_westbrook","Russell Westbrook")],
    "kevin_durant","Moment","easy",["meme","speech"])

add("culture-crying-jordan-meme",
    "Whose Hall of Fame speech spawned the famous 'crying meme'?",
    [("magic_johnson","Magic Johnson"),("kobe_bryant","Kobe Bryant"),("michael_jordan","Michael Jordan"),("shaquille_oneal","Shaquille O'Neal")],
    "michael_jordan","Moment","easy",["meme"])

add("culture-the-decision-lebron",
    "Which player announced his free-agency move on ESPN's 'The Decision' in 2010?",
    [("kevin_durant","Kevin Durant"),("lebron_james","LeBron James"),("carmelo_anthony","Carmelo Anthony"),("chris_bosh","Chris Bosh")],
    "lebron_james","Moment","easy",["tv","free_agency"])

add("culture-uncut-gems-kg",
    "Which NBA legend played himself in *Uncut Gems* (2019)?",
    [("kevin_garnett","Kevin Garnett"),("charles_barkley","Charles Barkley"),("dwyane_wade","Dwyane Wade"),("allen_iverson","Allen Iverson")],
    "kevin_garnett","Moment","easy",["film"])

add("culture-space-jam-jordan",
    "Who starred in the original *Space Jam* (1996) with Bugs Bunny?",
    [("shaquille_oneal","Shaquille O'Neal"),("michael_jordan","Michael Jordan"),("charles_barkley","Charles Barkley"),("magic_johnson","Magic Johnson")],
    "michael_jordan","Moment","easy",["film"])

add("culture-trainwreck-lebron",
    "Which NBA player had a notable role playing himself in *Trainwreck* (2015)?",
    [("kobe_bryant","Kobe Bryant"),("lebron_james","LeBron James"),("chris_paul","Chris Paul"),("dwight_howard","Dwight Howard")],
    "lebron_james","Moment","easy",["film"])

add("culture-spike-lee-knicks",
    "Spike Lee is famously the most die-hard celebrity fan of which NBA team?",
    [("los_angeles_lakers","Los Angeles Lakers"),("new_york_knicks","New York Knicks"),("toronto_raptors","Toronto Raptors"),("chicago_bulls","Chicago Bulls")],
    "new_york_knicks","Moment","easy",["fans","culture"])

add("culture-uncle-drew-kyrie",
    "Uncle Drew is a character played by which current NBA star?",
    [("kyrie_irving","Kyrie Irving"),("kevin_love","Kevin Love"),("chris_paul","Chris Paul"),("james_harden","James Harden")],
    "kyrie_irving","Moment","easy",["ads","character"])

add("culture-the-last-dance-title",
    "What is the title of the 10-part docuseries on MJ and the 1990s Bulls?",
    [("beyond_the_hoop","Beyond the Hoop"),("the_last_dance","The Last Dance"),("23_and_me","23 and Me"),("bulls_dynasty","Bulls Dynasty")],
    "the_last_dance","Moment","easy",["doc"])

add("culture-trust-the-process",
    "Trust the Process is associated with which team's rebuild?",
    [("philadelphia_76ers","Philadelphia 76ers"),("phoenix_suns","Phoenix Suns"),("milwaukee_bucks","Milwaukee Bucks"),("minnesota_timberwolves","Minnesota Timberwolves")],
    "philadelphia_76ers","Team","easy",["meme","rebuild"])

add("culture-kawhi-fun-guy",
    "Which player's awkward 'I'm a fun guy' laugh went viral in 2018?",
    [("kawhi_leonard","Kawhi Leonard"),("giannis_antetokounmpo","Giannis Antetokounmpo"),("klay_thompson","Klay Thompson"),("james_harden","James Harden")],
    "kawhi_leonard","Moment","easy",["meme","quote"])

add("culture-mamba-mentality",
    "Mamba Mentality is inspired by which late NBA legend?",
    [("kobe_bryant","Kobe Bryant"),("wilt_chamberlain","Wilt Chamberlain"),("allen_iverson","Allen Iverson"),("karl_malone","Karl Malone")],
    "kobe_bryant","Moment","easy",["mindset"])

add("culture-zoom-freak-giannis",
    "Zoom Freak is a Nike signature line for which superstar?",
    [("zion_williamson","Zion Williamson"),("giannis_antetokounmpo","Giannis Antetokounmpo"),("luka_doncic","Luka Dončić"),("kevin_durant","Kevin Durant")],
    "giannis_antetokounmpo","Player","easy",["shoes"])

add("culture-banned-aj1",
    "Why were Michael Jordan's original Air Jordan I sneakers nicknamed 'Banned' in 1985?",
    [("logo","They featured a banned logo"),("uniform_rule","NBA banned them for violating uniform color rules"),("material","They used banned materials"),("contract","Jordan's contract forbade them")],
    "uniform_rule","Player","medium",["shoes","history"])

add("culture-hack-a-shaq",
    "Hack-a-Shaq targeted which weakness of Shaquille O'Neal?",
    [("three_point","Three-point shooting"),("free_throw","Free-throw shooting"),("post_moves","Post moves"),("paint_defense","Paint defense")],
    "free_throw","Player","easy",["strategy"])

add("culture-game6-klay",
    "Which player is nicknamed Game 6 ___ for big Game 6 performances?",
    [("jordan","Jordan"),("lebron","LeBron"),("klay","Klay"),("dray","Dray")],
    "klay","Moment","easy",["nickname"])

add("culture-metta-world-peace",
    "Which former All-Star changed his name to Metta World Peace in 2011?",
    [("ron_artest","Ron Artest"),("world_b_free","World B. Free"),("stephen_jackson","Stephen Jackson"),("gilbert_arenas","Gilbert Arenas")],
    "ron_artest","Player","easy",["name_change"])

add("logo-jerry-west-silhouette",
    "The NBA logo silhouette is widely believed to be based on which Hall of Famer?",
    [("michael_jordan","Michael Jordan"),("julius_erving","Julius Erving"),("jerry_west","Jerry West"),("oscar_robertson","Oscar Robertson")],
    "jerry_west","Player","easy",["logo","history"])

print(f"Created {len(Q)} NBA questions")
print("Saving to data/trivia/nba_questions.json...")

# Save to JSON file
with open('data/trivia/nba_questions.json', 'w', encoding='utf-8') as f:
    json.dump(Q, f, indent=2, ensure_ascii=False)

print(f"Successfully created NBA questions database with {len(Q)} questions!")
