# How to Edit Trivia Questions

## Files Location

**NFL Trivia:** `NFL_questions_full.json`  
**NBA Trivia:** `NBA_questions_full.json` (when you add it)

## Question Format

Each question follows this structure:

```json
{
  "id": "unique-question-id",
  "question": "Your question text here?",
  "choices": [
    {
      "id": "answer_1",
      "text": "First Answer"
    },
    {
      "id": "answer_2",
      "text": "Second Answer"
    },
    {
      "id": "answer_3",
      "text": "Third Answer"
    },
    {
      "id": "answer_4",
      "text": "Fourth Answer"
    }
  ],
  "correctChoiceId": "answer_1",
  "category": "QB",
  "difficulty": "easy",
  "tags": ["record", "rookie", "modern"],
  "contextNote": "Optional context about the question",
  "isActive": true,
  "createdAt": "2025-09-29",
  "number": 1
}
```

## How to Edit Questions

### 1. Open the JSON File
- Open `NFL_questions_full.json` in any text editor
- Or use VS Code for syntax highlighting

### 2. Find the Question You Want to Edit
- Search for keywords in the question text
- Or find by the `"number"` field

### 3. Edit Any Field

**Change the Question:**
```json
"question": "Who was the first QB to throw 500+ yards in a game?"
```

**Change an Answer:**
```json
"choices": [
  {
    "id": "patrick_mahomes",
    "text": "Patrick Mahomes"  ← Change this text
  }
]
```

**Change the Correct Answer:**
```json
"correctChoiceId": "tom_brady"  ← Must match one of the choice IDs
```

**Change Difficulty:**
```json
"difficulty": "hard"  ← Options: "easy", "medium", "hard"
```

### 4. Save the File
- Save as `NFL_questions_full.json` (keep the same filename)
- Make sure it's still valid JSON (check for commas, brackets)

### 5. Test Your Changes
- Open `index.html` in your browser
- Select **General Trivia + NFL**
- Play through some questions to see your changes

## Adding New Questions

### Copy an Existing Question
```json
{
  "id": "new-question-unique-id",  ← Change this to something unique
  "question": "Your new question here?",
  "choices": [
    { "id": "choice_1", "text": "Answer 1" },
    { "id": "choice_2", "text": "Answer 2" },
    { "id": "choice_3", "text": "Answer 3" },
    { "id": "choice_4", "text": "Answer 4" }
  ],
  "correctChoiceId": "choice_1",  ← Must match one choice ID
  "category": "General",
  "difficulty": "medium",
  "tags": [],
  "contextNote": "",
  "isActive": true,
  "createdAt": "2025-09-29",
  "number": 101  ← Increment from last question
}
```

### Add a Comma
- Make sure to add a comma after the previous question
- Last question should NOT have a comma

**Example:**
```json
[
  {
    "id": "question-1",
    "question": "First question?"
  },  ← Comma here
  {
    "id": "question-2",
    "question": "Second question?"
  }  ← No comma on last item
]
```

## Removing Questions

### Option 1: Set Inactive
```json
"isActive": false
```
(Currently not implemented, but good practice)

### Option 2: Delete Completely
1. Find the question in the JSON file
2. Delete the entire `{ ... }` block
3. Remove the comma if needed
4. Make sure JSON is still valid

## Common Mistakes to Avoid

❌ **Missing Comma Between Questions**
```json
{ "id": "q1" }
{ "id": "q2" }  ← ERROR
```

✅ **Correct:**
```json
{ "id": "q1" },
{ "id": "q2" }
```

❌ **Wrong correctChoiceId**
```json
"choices": [
  { "id": "tom_brady", "text": "Tom Brady" }
],
"correctChoiceId": "brady"  ← ERROR: Doesn't match "tom_brady"
```

✅ **Correct:**
```json
"correctChoiceId": "tom_brady"
```

❌ **Extra Comma on Last Item**
```json
[
  { "id": "q1" },
  { "id": "q2" },  ← ERROR: Last item shouldn't have comma
]
```

## Validating Your JSON

### Online Validator
1. Copy your entire JSON file
2. Go to https://jsonlint.com/
3. Paste and click "Validate JSON"
4. Fix any errors shown

### VS Code
- Install "JSON" extension
- Errors will be highlighted in red
- Hover over errors to see what's wrong

## Quick Edit Example

**Before:**
```json
{
  "question": "Who has the most Super Bowl rings?",
  "choices": [
    { "id": "tom_brady", "text": "Tom Brady" },
    { "id": "joe_montana", "text": "Joe Montana" }
  ],
  "correctChoiceId": "tom_brady",
  "difficulty": "easy"
}
```

**After (making it harder):**
```json
{
  "question": "Who has the most Super Bowl rings as a player?",
  "choices": [
    { "id": "tom_brady", "text": "Tom Brady" },
    { "id": "charles_haley", "text": "Charles Haley" },
    { "id": "joe_montana", "text": "Joe Montana" },
    { "id": "terry_bradshaw", "text": "Terry Bradshaw" }
  ],
  "correctChoiceId": "tom_brady",
  "difficulty": "hard"  ← Changed from "easy"
}
```

## After Editing

1. **Save the file** - `NFL_questions_full.json`
2. **Refresh your browser** - Ctrl+F5 or Cmd+Shift+R
3. **Play General Trivia** - Your changes should appear!
4. **Commit to GitHub** - Once you're happy:
   ```bash
   git add NFL_questions_full.json
   git commit -m "Updated trivia questions"
   git push
   ```

---

**Need help?** If your JSON is invalid, the game will show "Failed to load questions". Use the online validator to find the error!
