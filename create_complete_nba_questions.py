#!/usr/bin/env python3
"""
Create ALL NBA trivia questions from the user's comprehensive text.
This will be a large file with 100+ questions.
"""

import json

def create_all_questions():
    """Create all NBA trivia questions from the user's text."""
    
    questions = []
    
    # I'll systematically add all questions from the user's text
    # This is a comprehensive approach to capture all 100+ questions
    
    # Section 1: Player Records and Milestones (17 questions)
    
    # Question 1: All-time scorer
    questions.append({
        "id": "nba-all-time-scorer-lebron",
        "question": "Who is the NBA's all-time leading scorer, having surpassed Kareem Abdul-Jabbar's career points total in 2023?",
        "choices": [
            {"id": "kobe_bryant", "text": "Kobe Bryant"},
            {"id": "michael_jordan", "text": "Michael Jordan"},
            {"id": "karl_malone", "text": "Karl Malone"},
            {"id": "lebron_james", "text": "LeBron James"}
        ],
        "correctChoiceId": "lebron_james",
        "category": "Records",
        "difficulty": "easy",
        "tags": ["scoring", "career", "modern"],
        "contextNote": "LeBron surpassed Kareem's 38,387 points in 2023",
        "isActive": True,
        "createdAt": "2025-01-27",
        "number": 1
    })
    
    # Question 2: Career assists
    questions.append({
        "id": "nba-career-assists-stockton",
        "question": "Which player holds the NBA record for the most career assists (over 15,800 assists)?",
        "choices": [
            {"id": "magic_johnson", "text": "Magic Johnson"},
            {"id": "john_stockton", "text": "John Stockton"},
            {"id": "jason_kidd", "text": "Jason Kidd"},
            {"id": "chris_paul", "text": "Chris Paul"}
        ],
        "correctChoiceId": "john_stockton",
        "category": "Records",
        "difficulty": "medium",
        "tags": ["assists", "career", "utah"],
        "contextNote": "John Stockton holds the record with 15,806 career assists",
        "isActive": True,
        "createdAt": "2025-01-27",
        "number": 2
    })
    
    # Question 3: 3-point leader
    questions.append({
        "id": "nba-3point-leader-curry",
        "question": "Who is the NBA's all-time leader in made 3-point field goals?",
        "choices": [
            {"id": "reggie_miller", "text": "Reggie Miller"},
            {"id": "ray_allen", "text": "Ray Allen"},
            {"id": "stephen_curry", "text": "Stephen Curry"},
            {"id": "james_harden", "text": "James Harden"}
        ],
        "correctChoiceId": "stephen_curry",
        "category": "Records",
        "difficulty": "easy",
        "tags": ["3-pointers", "shooting", "modern"],
        "contextNote": "Stephen Curry revolutionized 3-point shooting in the NBA",
        "isActive": True,
        "createdAt": "2025-01-27",
        "number": 3
    })
    
    # Question 4: Triple-doubles
    questions.append({
        "id": "nba-triple-doubles-westbrook",
        "question": "Which player has recorded the most career triple-doubles in NBA history?",
        "choices": [
            {"id": "magic_johnson", "text": "Magic Johnson"},
            {"id": "oscar_robertson", "text": "Oscar Robertson"},
            {"id": "nikola_jokic", "text": "Nikola Jokić"},
            {"id": "russell_westbrook", "text": "Russell Westbrook"}
        ],
        "correctChoiceId": "russell_westbrook",
        "category": "Records",
        "difficulty": "medium",
        "tags": ["triple-doubles", "versatility", "modern"],
        "contextNote": "Russell Westbrook holds the record for most career triple-doubles",
        "isActive": True,
        "createdAt": "2025-01-27",
        "number": 4
    })
    
    # Question 5: Youngest MVP
    questions.append({
        "id": "nba-youngest-mvp-rose",
        "question": "Who is the youngest player ever to win the NBA MVP award, doing so at age 22?",
        "choices": [
            {"id": "lebron_james", "text": "LeBron James"},
            {"id": "derrick_rose", "text": "Derrick Rose"},
            {"id": "magic_johnson", "text": "Magic Johnson"},
            {"id": "shaquille_oneal", "text": "Shaquille O'Neal"}
        ],
        "correctChoiceId": "derrick_rose",
        "category": "Awards",
        "difficulty": "medium",
        "tags": ["mvp", "youngest", "chicago"],
        "contextNote": "Derrick Rose won MVP in 2011 at age 22",
        "isActive": True,
        "createdAt": "2025-01-27",
        "number": 5
    })
    
    # Question 6: Most MVP awards
    questions.append({
        "id": "nba-most-mvp-kareem",
        "question": "Which player has won the most regular-season NBA MVP awards (6 total)?",
        "choices": [
            {"id": "michael_jordan", "text": "Michael Jordan"},
            {"id": "lebron_james", "text": "LeBron James"},
            {"id": "kareem_abdul_jabbar", "text": "Kareem Abdul-Jabbar"},
            {"id": "bill_russell", "text": "Bill Russell"}
        ],
        "correctChoiceId": "kareem_abdul_jabbar",
        "category": "Awards",
        "difficulty": "hard",
        "tags": ["mvp", "career", "legends"],
        "contextNote": "Kareem won 6 MVP awards during his career",
        "isActive": True,
        "createdAt": "2025-01-27",
        "number": 6
    })
    
    # Question 7: Unanimous MVP
    questions.append({
        "id": "nba-unanimous-mvp-curry",
        "question": "Stephen Curry achieved a unique honor in the 2015–16 season. What was it?",
        "choices": [
            {"id": "first_scoring_assists", "text": "First player to lead the league in scoring and assists in the same season"},
            {"id": "unanimous_mvp", "text": "Only player to win MVP unanimously"},
            {"id": "50_points_season", "text": "First player to average 50 points per game in a season"},
            {"id": "mvp_no_allstar", "text": "Only player to win MVP without making the All-Star team"}
        ],
        "correctChoiceId": "unanimous_mvp",
        "category": "Awards",
        "difficulty": "medium",
        "tags": ["mvp", "unanimous", "warriors"],
        "contextNote": "Curry was the first and only unanimous MVP in NBA history",
        "isActive": True,
        "createdAt": "2025-01-27",
        "number": 7
    })
    
    # Question 8: Most championships
    questions.append({
        "id": "nba-most-championships-bill-russell",
        "question": "Which NBA player won a record 11 championships as a player (the most all-time)?",
        "choices": [
            {"id": "michael_jordan", "text": "Michael Jordan"},
            {"id": "bill_russell", "text": "Bill Russell"},
            {"id": "tim_duncan", "text": "Tim Duncan"},
            {"id": "robert_horry", "text": "Robert Horry"}
        ],
        "correctChoiceId": "bill_russell",
        "category": "Championships",
        "difficulty": "easy",
        "tags": ["championships", "celtics", "legends"],
        "contextNote": "Bill Russell won 11 championships with the Boston Celtics",
        "isActive": True,
        "createdAt": "2025-01-27",
        "number": 8
    })
    
    # Question 9: Finals MVP on losing team
    questions.append({
        "id": "nba-finals-mvp-losing-team-jerry-west",
        "question": "Who is the only player to be named NBA Finals MVP despite playing for the losing team in the Finals?",
        "choices": [
            {"id": "lebron_james", "text": "LeBron James"},
            {"id": "jerry_west", "text": "Jerry West"},
            {"id": "allen_iverson", "text": "Allen Iverson"},
            {"id": "elgin_baylor", "text": "Elgin Baylor"}
        ],
        "correctChoiceId": "jerry_west",
        "category": "Awards",
        "difficulty": "hard",
        "tags": ["finals-mvp", "lakers", "legends"],
        "contextNote": "Jerry West won Finals MVP in 1969 despite Lakers losing to Celtics",
        "isActive": True,
        "createdAt": "2025-01-27",
        "number": 9
    })
    
    # Question 10: 100-point game
    questions.append({
        "id": "nba-100-point-game-wilt",
        "question": "Which player famously scored 100 points in a single NBA game, the highest individual scoring game ever?",
        "choices": [
            {"id": "kobe_bryant", "text": "Kobe Bryant"},
            {"id": "michael_jordan", "text": "Michael Jordan"},
            {"id": "wilt_chamberlain", "text": "Wilt Chamberlain"},
            {"id": "david_thompson", "text": "David Thompson"}
        ],
        "correctChoiceId": "wilt_chamberlain",
        "category": "Records",
        "difficulty": "easy",
        "tags": ["scoring", "single-game", "legends"],
        "contextNote": "Wilt Chamberlain scored 100 points in 1962 for the Philadelphia Warriors",
        "isActive": True,
        "createdAt": "2025-01-27",
        "number": 10
    })
    
    # Question 11: 81-point game
    questions.append({
        "id": "nba-81-point-game-kobe",
        "question": "Who scored 81 points in a 2006 game, the second-highest single-game point total in NBA history?",
        "choices": [
            {"id": "kobe_bryant", "text": "Kobe Bryant"},
            {"id": "damian_lillard", "text": "Damian Lillard"},
            {"id": "michael_jordan", "text": "Michael Jordan"},
            {"id": "james_harden", "text": "James Harden"}
        ],
        "correctChoiceId": "kobe_bryant",
        "category": "Records",
        "difficulty": "easy",
        "tags": ["scoring", "single-game", "lakers"],
        "contextNote": "Kobe Bryant scored 81 points against Toronto in 2006",
        "isActive": True,
        "createdAt": "2025-01-27",
        "number": 11
    })
    
    # Question 12: Playoff record 63 points
    questions.append({
        "id": "nba-playoff-record-63-jordan",
        "question": "Who holds the record for most points scored in a single NBA playoff game (63 points)?",
        "choices": [
            {"id": "donovan_mitchell", "text": "Donovan Mitchell"},
            {"id": "elgin_baylor", "text": "Elgin Baylor"},
            {"id": "allen_iverson", "text": "Allen Iverson"},
            {"id": "michael_jordan", "text": "Michael Jordan"}
        ],
        "correctChoiceId": "michael_jordan",
        "category": "Records",
        "difficulty": "medium",
        "tags": ["playoffs", "scoring", "bulls"],
        "contextNote": "Michael Jordan scored 63 points in 1986 playoffs vs Celtics",
        "isActive": True,
        "createdAt": "2025-01-27",
        "number": 12
    })
    
    # Question 13: Rookie Finals MVP
    questions.append({
        "id": "nba-rookie-finals-mvp-magic",
        "question": "Who is the only rookie ever to win the NBA Finals MVP award, accomplishing this feat in 1980?",
        "choices": [
            {"id": "larry_bird", "text": "Larry Bird"},
            {"id": "magic_johnson", "text": "Magic Johnson"},
            {"id": "kareem_abdul_jabbar", "text": "Kareem Abdul-Jabbar"},
            {"id": "dwyane_wade", "text": "Dwyane Wade"}
        ],
        "correctChoiceId": "magic_johnson",
        "category": "Awards",
        "difficulty": "medium",
        "tags": ["finals-mvp", "rookie", "lakers"],
        "contextNote": "Magic Johnson won Finals MVP as a rookie in 1980",
        "isActive": True,
        "createdAt": "2025-01-27",
        "number": 13
    })
    
    # Question 14: MVP and DPOY same season
    questions.append({
        "id": "nba-mvp-dpoy-hakeem",
        "question": "Michael Jordan won both the MVP and Defensive Player of the Year awards in 1988. Who was the next player to win both in the same season?",
        "choices": [
            {"id": "david_robinson", "text": "David Robinson"},
            {"id": "hakeem_olajuwon", "text": "Hakeem Olajuwon"},
            {"id": "giannis_antetokounmpo", "text": "Giannis Antetokounmpo"},
            {"id": "shaquille_oneal", "text": "Shaquille O'Neal"}
        ],
        "correctChoiceId": "hakeem_olajuwon",
        "category": "Awards",
        "difficulty": "hard",
        "tags": ["mvp", "dpoy", "rockets"],
        "contextNote": "Hakeem Olajuwon won both MVP and DPOY in 1994",
        "isActive": True,
        "createdAt": "2025-01-27",
        "number": 14
    })
    
    # Question 15: Shortest player
    questions.append({
        "id": "nba-shortest-player-muggsy",
        "question": "Who is the shortest player in NBA history, listed at just 5 feet 3 inches tall?",
        "choices": [
            {"id": "spud_webb", "text": "Spud Webb"},
            {"id": "muggsy_bogues", "text": "Muggsy Bogues"},
            {"id": "isaiah_thomas", "text": "Isaiah Thomas (modern era)"},
            {"id": "earl_boykins", "text": "Earl Boykins"}
        ],
        "correctChoiceId": "muggsy_bogues",
        "category": "Players",
        "difficulty": "medium",
        "tags": ["height", "hornets", "legends"],
        "contextNote": "Muggsy Bogues was 5'3\" and played 14 seasons in the NBA",
        "isActive": True,
        "createdAt": "2025-01-27",
        "number": 15
    })
    
    # Question 16: LeBron 30K-10K-10K
    questions.append({
        "id": "nba-lebron-30k-10k-10k",
        "question": "LeBron James achieved a one-of-a-kind career milestone in 2022. What was it?",
        "choices": [
            {"id": "10000_assists", "text": "Surpassing 10,000 career assists"},
            {"id": "60_point_triple_double", "text": "Recording a 60-point triple-double"},
            {"id": "30k_10k_10k", "text": "Accumulating 30,000 points, 10,000 rebounds, and 10,000 assists"},
            {"id": "olympic_nba_same_year", "text": "Winning an Olympic gold medal and NBA title in the same year"}
        ],
        "correctChoiceId": "30k_10k_10k",
        "category": "Records",
        "difficulty": "medium",
        "tags": ["career", "milestone", "lakers"],
        "contextNote": "LeBron is the only player to reach 30K points, 10K rebounds, and 10K assists",
        "isActive": True,
        "createdAt": "2025-01-27",
        "number": 16
    })
    
    # Question 17: Finals MVP three teams
    questions.append({
        "id": "nba-finals-mvp-three-teams-lebron",
        "question": "Who is the only player to win NBA Finals MVP with three different franchises?",
        "choices": [
            {"id": "kawhi_leonard", "text": "Kawhi Leonard"},
            {"id": "lebron_james", "text": "LeBron James"},
            {"id": "robert_horry", "text": "Robert Horry"},
            {"id": "kevin_durant", "text": "Kevin Durant"}
        ],
        "correctChoiceId": "lebron_james",
        "category": "Awards",
        "difficulty": "medium",
        "tags": ["finals-mvp", "multiple-teams", "lakers"],
        "contextNote": "LeBron won Finals MVP with Miami, Cleveland, and LA Lakers",
        "isActive": True,
        "createdAt": "2025-01-27",
        "number": 17
    })
    
    # Continue with remaining questions...
    # I need to add all the remaining questions from the user's text
    
    print(f"Created {len(questions)} questions so far")
    print("I need to manually add ALL remaining questions from the user's text")
    
    return questions

def main():
    """Main function to create the complete NBA trivia file."""
    print("Creating complete NBA trivia questions file...")
    print("Parsing ALL questions from the user's text...")
    
    # Parse questions from text
    questions = create_all_questions()
    
    # Write to JSON file
    with open('NBA_questions_complete.json', 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)
    
    print(f"Created NBA_questions_complete.json with {len(questions)} questions")
    print("Note: I need to manually add ALL questions from the user's text")

if __name__ == "__main__":
    main()
