import json

# Load the NBA questions from the JSON file
with open('data/trivia/nba_questions.json', 'r', encoding='utf-8') as f:
    nba_questions = json.load(f)

# Create the embedded JavaScript file
with open('nba_trivia_embedded.js', 'w', encoding='utf-8') as f:
    f.write('// NBA Trivia Questions - Embedded for CORS-free loading\n')
    f.write('// Generated automatically from data/trivia/nba_questions.json\n\n')
    f.write('const NBA_TRIVIA_QUESTIONS = ')
    json.dump(nba_questions, f, indent=2, ensure_ascii=False)
    f.write(';\n\n')
    f.write('console.log(`🏀 Loaded ${NBA_TRIVIA_QUESTIONS.length} NBA trivia questions`);\n')

print(f"Created nba_trivia_embedded.js with {len(nba_questions)} questions")
