// Auth Modal JavaScript Functions

// Switch to Sign In tab
function switchToSignInTab() {
    const registerForm = document.getElementById('challenge-register-form');
    const loginForm = document.getElementById('challenge-login-form');
    const signInTab = document.getElementById('signin-tab');
    const createTab = document.getElementById('create-tab');
    
    if (registerForm) registerForm.style.display = 'none';
    if (loginForm) loginForm.style.display = 'block';
    if (signInTab) signInTab.classList.add('active');
    if (createTab) createTab.classList.remove('active');
}

// Switch to Create Account tab
function switchToCreateTab() {
    const registerForm = document.getElementById('challenge-register-form');
    const loginForm = document.getElementById('challenge-login-form');
    const signInTab = document.getElementById('signin-tab');
    const createTab = document.getElementById('create-tab');
    
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'block';
    if (signInTab) signInTab.classList.remove('active');
    if (createTab) createTab.classList.add('active');
}

// Legacy aliases for backward compatibility
const switchToSignIn = switchToSignInTab;
const switchToCreateAccount = switchToCreateTab;

// Update profile view with user data
function updateProfileView(user) {
    // Update modal title
    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) modalTitle.textContent = 'My Profile';
    
    // Update avatar initials
    const avatarInitials = document.getElementById('user-avatar-initials');
    if (avatarInitials && user.display_name) {
        const names = user.display_name.split(' ');
        const initials = names.map(n => n[0]).join('').toUpperCase().substring(0, 2);
        avatarInitials.textContent = initials;
    }
    
    // Update display name
    const displayName = document.getElementById('user-display-name');
    if (displayName) displayName.textContent = user.display_name || user.username;
    
    // Update email
    const userEmail = document.getElementById('user-email');
    if (userEmail) userEmail.textContent = user.email;
    
    // Update stats (if available)
    const picksPoints = document.getElementById('user-picks-points');
    const triviaPoints = document.getElementById('user-trivia-points');
    const streak = document.getElementById('user-streak');
    
    if (picksPoints) picksPoints.textContent = user.picks_points || 0;
    if (triviaPoints) triviaPoints.textContent = user.trivia_points || 0;
    if (streak) streak.textContent = user.current_pick_streak || 0;
    
    // Update achievements
    const achievementsList = document.getElementById('user-achievements');
    if (achievementsList && user.achievements && user.achievements.length > 0) {
        achievementsList.innerHTML = user.achievements.map(achievement => `
            <div class="achievement-badge">
                <div class="achievement-icon">${achievement.icon || '🏆'}</div>
                <div class="achievement-name">${achievement.name}</div>
            </div>
        `).join('');
    } else if (achievementsList) {
        achievementsList.innerHTML = '<p class="no-achievements">No achievements yet</p>';
    }
}

// State Machine - Show specific modal state
function showState(stateName) {
    console.log(`🔄 Switching to state: ${stateName}`);
    
    // Hide all states
    document.querySelectorAll('.modal-state').forEach(state => {
        state.classList.remove('active');
        state.style.display = 'none';
    });
    
    // Show requested state
    const stateId = `state-${stateName.toLowerCase()}`;
    const targetState = document.getElementById(stateId);
    
    if (targetState) {
        targetState.classList.add('active');
        targetState.style.display = 'block';
        
        // Load data for specific states
        switch(stateName.toUpperCase()) {
            case 'PICKS':
                if (typeof loadWeeklyGames === 'function') {
                    loadWeeklyGames();
                } else {
                    console.warn('loadWeeklyGames function not found');
                }
                break;
            case 'TRIVIA':
                if (typeof loadTriviaQuestions === 'function') {
                    loadTriviaQuestions();
                } else {
                    console.warn('loadTriviaQuestions function not found');
                }
                break;
        }
    } else {
        console.error(`❌ State not found: ${stateId}`);
    }
}

// Export functions to global scope
window.switchToSignIn = switchToSignIn;
window.switchToSignInTab = switchToSignInTab;
window.switchToCreateAccount = switchToCreateAccount;
window.switchToCreateTab = switchToCreateTab;
window.updateProfileView = updateProfileView;
window.showState = showState;

