import json, os, datetime

today = "2025-09-29"

def make_q(num, qid, question, choices, correct_id, category, difficulty, tags=None, context=""):
    return {
        "number": num,
        "id": qid,
        "question": question,
        "choices": [{"id": k, "text": v} for k, v in choices],
        "correctChoiceId": correct_id,
        "category": category,           # "Player" | "Team" | "Draft" | "Coach" | "Arena" | "Defense" | "Moment"
        "difficulty": difficulty,       # "easy" | "medium" | "hard"
        "tags": tags or [],
        "contextNote": context,
        "isActive": True,
        "createdAt": today
    }

Q = []
n = 0
def add(qid, question, choices, correct, category, difficulty, tags=None, context=""):
    global n
    n += 1
    Q.append(make_q(n, qid, question, choices, correct, category, difficulty, tags, context))

# ---- Player records & milestones ----
add("player-alltime-points-lebron",
    "Who is the NBA's all-time leading scorer, having surpassed Kareem Abdul-Jabbar in 2023?",
    [("kobe_bryant","Kobe Bryant"),("michael_jordan","Michael Jordan"),("karl_malone","Karl Malone"),("lebron_james","LeBron James")],
    "lebron_james","Player","easy",["record","points"])

add("player-assists-leader-stockton",
    "Which player holds the NBA record for most career assists?",
    [("magic_johnson","Magic Johnson"),("john_stockton","John Stockton"),("jason_kidd","Jason Kidd"),("chris_paul","Chris Paul")],
    "john_stockton","Player","easy",["record","assists"])

add("player-3pm-leader-curry",
    "Who is the NBA's all-time leader in made three-pointers?",
    [("reggie_miller","Reggie Miller"),("ray_allen","Ray Allen"),("stephen_curry","Stephen Curry"),("james_harden","James Harden")],
    "stephen_curry","Player","easy",["record","3pt"])

add("player-triple-doubles-westbrook",
    "Which player has the most career triple-doubles in NBA history?",
    [("magic_johnson","Magic Johnson"),("oscar_robertson","Oscar Robertson"),("nikola_jokic","Nikola Jokić"),("russell_westbrook","Russell Westbrook")],
    "russell_westbrook","Player","easy",["record","triple_double"])

add("player-youngest-mvp-rose",
    "Who is the youngest NBA MVP ever (age 22)?",
    [("lebron_james","LeBron James"),("derrick_rose","Derrick Rose"),("magic_johnson","Magic Johnson"),("shaquille_oneal","Shaquille O'Neal")],
    "derrick_rose","Player","easy",["award","mvp"])

add("player-most-mvps-kareem",
    "Which player has won the most regular-season MVP awards (6)?",
    [("michael_jordan","Michael Jordan"),("lebron_james","LeBron James"),("kareem_abdul_jabbar","Kareem Abdul-Jabbar"),("bill_russell","Bill Russell")],
    "kareem_abdul_jabbar","Player","medium",["award","mvp"])

add("player-only-unanimous-mvp-curry",
    "Who is the only unanimous MVP in NBA history (2016)?",
    [("stephen_curry","Stephen Curry"),("michael_jordan","Michael Jordan"),("lebron_james","LeBron James"),("shaquille_oneal","Shaquille O'Neal")],
    "stephen_curry","Player","easy",["award","mvp"])

add("player-11-rings-bill-russell",
    "Which NBA player won a record 11 championship rings?",
    [("michael_jordan","Michael Jordan"),("bill_russell","Bill Russell"),("robert_horry","Robert Horry"),("tim_duncan","Tim Duncan")],
    "bill_russell","Player","easy",["titles"])

add("player-finals-mvp-on-losing-team",
    "Who is the only player to win NBA Finals MVP from the losing team?",
    [("lebron_james","LeBron James"),("jerry_west","Jerry West"),("allen_iverson","Allen Iverson"),("elgin_baylor","Elgin Baylor")],
    "jerry_west","Player","medium",["finals","awards"])

add("player-100-points-wilt",
    "Who scored 100 points in a single NBA game (1962)?",
    [("wilt_chamberlain","Wilt Chamberlain"),("kobe_bryant","Kobe Bryant"),("michael_jordan","Michael Jordan"),("david_thompson","David Thompson")],
    "wilt_chamberlain","Player","easy",["record","scoring"])

add("player-81-points-kobe",
    "Who scored 81 points in a 2006 game vs the Raptors?",
    [("kobe_bryant","Kobe Bryant"),("devin_booker","Devin Booker"),("damian_lillard","Damian Lillard"),("james_harden","James Harden")],
    "kobe_bryant","Player","easy",["scoring"])

add("player-playoff-63-jordan",
    "Who holds the record for most points in a single NBA playoff game (63)?",
    [("donovan_mitchell","Donovan Mitchell"),("elgin_baylor","Elgin Baylor"),("allen_iverson","Allen Iverson"),("michael_jordan","Michael Jordan")],
    "michael_jordan","Player","medium",["record","playoffs"])

add("player-rookie-finals-mvp-magic",
    "Who is the only rookie to win NBA Finals MVP (1980)?",
    [("larry_bird","Larry Bird"),("magic_johnson","Magic Johnson"),("kareem_abdul_jabbar","Kareem Abdul-Jabbar"),("dwyane_wade","Dwyane Wade")],
    "magic_johnson","Player","medium",["finals","awards"])

add("player-mvp-dpoy-same-season-hakeem",
    "Who was the next player after Michael Jordan to win MVP and DPOY in the same season?",
    [("david_robinson","David Robinson"),("hakeem_olajuwon","Hakeem Olajuwon"),("giannis_antetokounmpo","Giannis Antetokounmpo"),("shaquille_oneal","Shaquille O'Neal")],
    "hakeem_olajuwon","Player","hard",["awards","defense"])

add("player-shortest-muggsy",
    "Who is the shortest player in NBA history (5'3\")?",
    [("spud_webb","Spud Webb"),("muggsy_bogues","Muggsy Bogues"),("isaiah_thomas","Isaiah Thomas"),("earl_boykins","Earl Boykins")],
    "muggsy_bogues","Player","easy",["fun_fact"])

add("player-30k-10k-10k-lebron",
    "Who is the only player with 30k points, 10k rebounds, and 10k assists?",
    [("lebron_james","LeBron James"),("kevin_durant","Kevin Durant"),("kareem_abdul_jabbar","Kareem Abdul-Jabbar"),("giannis_antetokounmpo","Giannis Antetokounmpo")],
    "lebron_james","Player","easy",["milestone"])

add("player-finals-mvp-three-teams-lebron",
    "Who is the only player to win Finals MVP with three different teams?",
    [("kawhi_leonard","Kawhi Leonard"),("lebron_james","LeBron James"),("kevin_durant","Kevin Durant"),("shaquille_oneal","Shaquille O'Neal")],
    "lebron_james","Player","medium",["finals","awards"])

add("player-60-21-10-luka",
    "Who recorded a 60-point, 21-rebound, 10-assist game in 2022?",
    [("luka_doncic","Luka Dončić"),("james_harden","James Harden"),("damian_lillard","Damian Lillard"),("joel_embiid","Joel Embiid")],
    "luka_doncic","Player","medium",["record","triple_double"])

add("player-20-20-20-westbrook",
    "Who posted a 20-20-20 game in 2019, the first since Wilt Chamberlain?",
    [("russell_westbrook","Russell Westbrook"),("nikola_jokic","Nikola Jokić"),("draymond_green","Draymond Green"),("giannis_antetokounmpo","Giannis Antetokounmpo")],
    "russell_westbrook","Player","medium",["rare","triple_double"])

add("player-3s-in-game-klay-14",
    "Who holds the record for most three-pointers in a game (14)?",
    [("klay_thompson","Klay Thompson"),("stephen_curry","Stephen Curry"),("damian_lillard","Damian Lillard"),("zach_lavine","Zach LaVine")],
    "klay_thompson","Player","easy",["record","3pt"])

add("player-points-in-quarter-klay-37",
    "Who holds the record for most points in a quarter (37)?",
    [("klay_thompson","Klay Thompson"),("kobe_bryant","Kobe Bryant"),("kevin_durant","Kevin Durant"),("stephen_curry","Stephen Curry")],
    "klay_thompson","Player","medium",["record","scoring"])

add("player-mip-mvp-dpoy-fmvp-giannis",
    "Who is the only player to win MIP, MVP, DPOY, and Finals MVP?",
    [("giannis_antetokounmpo","Giannis Antetokounmpo"),("michael_jordan","Michael Jordan"),("lebron_james","LeBron James"),("kevin_garnett","Kevin Garnett")],
    "giannis_antetokounmpo","Player","hard",["awards","unique"])

add("player-71pts-mitchell-2023",
    "Which player scored 71 points in a 2023 game vs the Bulls?",
    [("donovan_mitchell","Donovan Mitchell"),("damian_lillard","Damian Lillard"),("devin_booker","Devin Booker"),("joel_embiid","Joel Embiid")],
    "donovan_mitchell","Player","medium",["scoring","moment"])

add("player-73pts-luka-2024",
    "Which player scored 73 points in 2024, tying for 4th-most in NBA history?",
    [("luka_doncic","Luka Dončić"),("joel_embiid","Joel Embiid"),("damian_lillard","Damian Lillard"),("devin_booker","Devin Booker")],
    "luka_doncic","Player","medium",["scoring"])

add("player-most-playoff-points-lebron",
    "Who holds the NBA record for most career playoff points?",
    [("lebron_james","LeBron James"),("michael_jordan","Michael Jordan"),("kareem_abdul_jabbar","Kareem Abdul-Jabbar"),("kobe_bryant","Kobe Bryant")],
    "lebron_james","Player","easy",["record","playoffs"])

add("player-most-fgm-kareem",
    "Who has the most career field goals made in NBA history?",
    [("kareem_abdul_jabbar","Kareem Abdul-Jabbar"),("lebron_james","LeBron James"),("karl_malone","Karl Malone"),("michael_jordan","Michael Jordan")],
    "kareem_abdul_jabbar","Player","hard",["record","fgm"])

add("player-most-fta-karl-malone",
    "Who has attempted the most free throws in NBA history?",
    [("karl_malone","Karl Malone"),("shaquille_oneal","Shaquille O'Neal"),("wilt_chamberlain","Wilt Chamberlain"),("lebron_james","LeBron James")],
    "karl_malone","Player","hard",["record","fta"])

add("player-most-assists-stockton-dup",
    "Who is the NBA's all-time steals leader?",
    [("john_stockton","John Stockton"),("michael_jordan","Michael Jordan"),("chris_paul","Chris Paul"),("gary_payton","Gary Payton")],
    "john_stockton","Player","easy",["record","steals"])

add("player-rebounds-leader-wilt",
    "Who is the NBA's all-time rebounds leader?",
    [("wilt_chamberlain","Wilt Chamberlain"),("bill_russell","Bill Russell"),("kareem_abdul_jabbar","Kareem Abdul-Jabbar"),("moses_malone","Moses Malone")],
    "wilt_chamberlain","Player","medium",["record","rebounds"])

add("player-blocks-leader-hakeem",
    "Who holds the NBA record for most career blocks?",
    [("hakeem_olajuwon","Hakeem Olajuwon"),("dikembe_mutombo","Dikembe Mutombo"),("kareem_abdul_jabbar","Kareem Abdul-Jabbar"),("tim_duncan","Tim Duncan")],
    "hakeem_olajuwon","Player","medium",["record","blocks"])

add("player-3pt-streak-curry",
    "Which player set the record for most consecutive games with a made three?",
    [("stephen_curry","Stephen Curry"),("james_harden","James Harden"),("duncan_robinson","Duncan Robinson"),("kyle_korver","Kyle Korver")],
    "stephen_curry","Player","medium",["streaks","3pt"])

# Continue with more questions...
# I'll add the remaining questions in chunks to avoid overwhelming the system

print(f"Created {len(Q)} NBA questions")
print("Saving to data/trivia/nba_questions.json...")

# Save to JSON file
with open('data/trivia/nba_questions.json', 'w', encoding='utf-8') as f:
    json.dump(Q, f, indent=2, ensure_ascii=False)

print(f"Successfully created NBA questions database with {len(Q)} questions!")
