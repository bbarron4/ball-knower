# Ball Knower Weekly Challenge Modal - Complete Implementation Plan

## Current Status
✅ Modal displays correctly (centered, proper styling)
✅ Basic auth forms exist (Sign In / Create Account)
✅ Backend integration working (Railway)
✅ Sign out functionality works

## Required Changes to Match Flow Chart

### 1. Entry Guard Logic (High Priority)
**Location:** `weekly-challenge.js` - `checkAuthAndShowModal()`

```javascript
async function checkAuthAndShowModal() {
    const hasToken = localStorage.getItem('ball_knower_token');
    const weeklyCompletion = localStorage.getItem('weekly_challenge_completed');
    
    // Check if signed in
    if (hasToken) {
        const user = await verifyToken(hasToken);
        if (user) {
            // Signed in - check if completed
            const completed = await checkWeeklyChallengeStatus();
            if (completed) {
                // Show Thanks Card + Exit
                showThankYouCard();
            } else {
                // Show Start Screen
                showState('START');
            }
        } else {
            // Token invalid
            localStorage.removeItem('ball_knower_token');
            checkLocalCompletion();
        }
    } else {
        checkLocalCompletion();
    }
}

function checkLocalCompletion() {
    const weeklyCompletion = localStorage.getItem(`challenge_week_${getCurrentWeek()}`);
    if (weeklyCompletion) {
        showThankYouCard();
    } else {
        showState('AUTH');
    }
}
```

### 2. Auth Forms Updates
**Add username field to both forms:**

**Sign In Form:**
- Username (required)
- Email (required)
- Password (required)

**Create Account Form:**
- Username (required, unique)
- First Name (required)
- Last Name (required)
- Email (required)
- Password (required, min 6)
- Confirm Password (required, must match)

### 3. State Machine Implementation
**Required States:**
1. `AUTH` - Sign In / Create Account
2. `START` - Start Weekly Challenge screen
3. `PICKS` - 5 games with confidence sliders
4. `TRIVIA_INTRO` - Intro card before trivia
5. `TRIVIA` - 5 questions, 10s each
6. `THANK_YOU` - Completion message

**State transition functions:**
```javascript
function showState(stateName) {
    // Hide all states
    document.querySelectorAll('.modal-state').forEach(s => s.classList.remove('active'));
    
    // Show requested state
    const state = document.getElementById(`state-${stateName.toLowerCase()}`);
    if (state) {
        state.classList.add('active');
        
        // Load data for state
        switch(stateName) {
            case 'PICKS':
                loadWeeklyGames();
                break;
            case 'TRIVIA':
                loadTriviaQuestions();
                break;
            // etc...
        }
    }
}
```

### 4. Start Screen
**HTML Structure:**
```html
<div id="state-start" class="modal-state">
    <div class="start-content">
        <h3>Ready for this week's challenge?</h3>
        <p>Make your picks and answer trivia to climb the leaderboard!</p>
        <button class="auth-btn-primary" onclick="showState('PICKS')">
            Start Weekly Challenge
        </button>
        <button class="auth-btn-secondary" onclick="signOut()">
            Sign Out
        </button>
    </div>
</div>
```

### 5. Picks Interface Updates
**Required Changes:**
- Must show exactly 5 games
- Confidence must use ± buttons (not slider)
- Validation: total confidence must = 10
- "Submit Picks" button disabled until valid

**Validation Logic:**
```javascript
function validatePicks() {
    const picks = Array.from(document.querySelectorAll('.game-pick-card'));
    
    // Check all picks made
    const allSelected = picks.every(p => p.dataset.selection);
    
    // Check confidence totals 10
    const confidences = picks.map(p => parseInt(p.dataset.confidence) || 0);
    const total = confidences.reduce((a, b) => a + b, 0);
    
    const submitBtn = document.getElementById('submit-picks-btn');
    submitBtn.disabled = !(allSelected && total === 10);
    
    // Update total display
    document.getElementById('confidence-total').textContent = total;
}
```

### 6. Trivia Intro Screen
**HTML:**
```html
<div id="state-trivia-intro" class="modal-state">
    <div class="trivia-intro-card">
        <h3>🧠 Time for Trivia!</h3>
        <p>Now it's time for 5 NFL trivia questions.</p>
        <ul>
            <li>Multiple choice format</li>
            <li><strong>10 seconds</strong> per question</li>
            <li><strong>5 points</strong> per correct answer</li>
        </ul>
        <button class="auth-btn-primary" onclick="startTrivia()">
            Start Game
        </button>
    </div>
</div>
```

### 7. Trivia Implementation
**Key Requirements:**
- 5 random questions
- 10-second timer per question
- 4 multiple choice options
- Reveal correct answer after selection
- 5 points per correct answer
- Save immediately to provisional leaderboard

**Timer Logic:**
```javascript
function startQuestionTimer(questionId, duration = 10) {
    let timeLeft = duration;
    const timerEl = document.getElementById(`timer-${questionId}`);
    
    const countdown = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(countdown);
            autoSubmitAnswer(questionId); // Time's up
        }
    }, 1000);
    
    // Store interval ID to clear on answer
    window.currentTimer = countdown;
}
```

### 8. Thank You Screen
**HTML:**
```html
<div id="state-thank-you" class="modal-state">
    <div class="thank-you-card">
        <h3>Thanks for playing! 🎉</h3>
        <p>Your trivia score (<span id="trivia-score">0</span>/25) was added to this week's provisional leaderboard.</p>
        <p>Your picks will be graded after the games finish.</p>
        <div class="thank-you-actions">
            <button class="auth-btn-primary" onclick="closeWeeklyChallengeModal()">
                Exit
            </button>
            <button class="auth-btn-secondary" onclick="viewLeaderboard()">
                View Leaderboard
            </button>
        </div>
    </div>
</div>
```

### 9. Completion Tracking
**Save completion to prevent reopening:**
```javascript
function markChallengeComplete() {
    const week = getCurrentWeek(); // e.g., "2025-W05"
    localStorage.setItem(`challenge_week_${week}`, JSON.stringify({
        completed: true,
        timestamp: new Date().toISOString()
    }));
}
```

### 10. Backend API Endpoints Needed
- `POST /api/picks/submit` - Submit picks
- `POST /api/trivia/submit` - Submit trivia answers
- `GET /api/challenges/status` - Check if user completed this week
- `PATCH /api/leaderboard/provisional` - Update provisional score

## Implementation Order
1. ✅ Modal structure and styling (DONE)
2. 🔄 Entry guard logic
3. State machine implementation
4. Auth form updates (add username)
5. Start screen
6. Picks validation (confidence = 10)
7. Trivia intro screen
8. Trivia with 10s timer
9. Thank you screen
10. Completion tracking

## Testing Checklist
- [ ] Signed in + completed → Thanks card shows
- [ ] Signed in + not completed → Start screen shows
- [ ] Not signed in + local completion → Thanks card shows
- [ ] Not signed in + not completed → Auth shows (Sign In tab)
- [ ] Create account → validates all fields
- [ ] Sign in → validates credentials
- [ ] Picks → confidence must total 10
- [ ] Trivia → 10s timer works, reveals answers
- [ ] Thank you → shows correct score, marks complete
- [ ] Modal doesn't reopen after completion this week

