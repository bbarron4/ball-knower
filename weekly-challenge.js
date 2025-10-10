// Ball Knower Weekly Challenge Integration
// Connects the frontend modal to the backend API

const API_URL = 'http://localhost:3001/api';
let authToken = localStorage.getItem('ball_knower_token');
let currentUser = null;

// Weekly challenge games data will be loaded from weekly_challenge_games.js

// Define adjustConfidence function early to prevent errors
window.adjustConfidence = function() { 
    console.log('adjustConfidence called but not needed for weekly challenge'); 
};

// Check weekly challenge games data
function checkWeeklyChallengeGames() {
    if (typeof WEEKLY_CHALLENGE_GAMES !== 'undefined' && WEEKLY_CHALLENGE_GAMES.length > 0) {
        console.log('✅ Weekly challenge games loaded:', WEEKLY_CHALLENGE_GAMES.length, 'games');
        console.log('NFL games:', NFL_WEEKLY_GAMES.length);
        console.log('College games:', COLLEGE_WEEKLY_GAMES.length);
        return true;
    } else {
        console.warn('⚠️ Weekly challenge games not loaded yet');
        return false;
    }
}

// Show different states of the modal
function showState(state) {
    console.log('🔄 Switching to state:', state);
    
    const modal = document.getElementById('weekly-challenge-modal');
    if (!modal) {
        console.error('❌ Modal not found');
        return;
    }
    
    // Update modal title based on state
    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) {
        if (state === 'auth') {
            modalTitle.textContent = 'Sign In';
        } else if (state === 'start') {
            modalTitle.textContent = `Hi ${currentUser?.user?.username || 'there'}! 👋`;
        } else if (state === 'picks') {
            modalTitle.textContent = `Hi ${currentUser?.user?.username || 'there'}! 👋`;
        } else if (state === 'thank-you') {
            modalTitle.textContent = 'Weekly Challenge';
        } else {
            modalTitle.textContent = 'Ball Knower Weekly Challenge';
        }
    }
    
    // Hide all modal states
    const states = modal.querySelectorAll('.modal-state');
    console.log('Found modal states:', states.length);
    states.forEach(stateEl => {
        stateEl.classList.remove('active');
        console.log('Removed active from:', stateEl.id);
    });
    
    // Show the appropriate state
    const targetState = modal.querySelector(`#state-${state}`);
    console.log('Looking for state:', `#state-${state}`);
    console.log('Target state found:', targetState);
    
    if (targetState) {
        targetState.classList.add('active');
        console.log('✅ Switched to', state, 'state');
        console.log('Target state classes after:', targetState.className);
        console.log('Target state display style:', window.getComputedStyle(targetState).display);
    } else {
        console.error('❌ State not found:', `#state-${state}`);
        // List all available states for debugging
        const allStates = modal.querySelectorAll('[id*="state-"]');
        console.log('Available states:', Array.from(allStates).map(stateEl => stateEl.id));
    }
    
    // Load content based on state
    if (state === 'picks') {
        loadChallengeGames('current');
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    console.log('🏀 WEEKLY-CHALLENGE.JS VERSION 41 LOADED - ULTRA COMPACT + FULL BORDERS!');
    console.log('🏀 Ball Knower Weekly Challenge loaded');
    console.log('Auth token:', authToken);
    console.log('Current user:', currentUser);
    
    // Test if modal element exists
    const modal = document.getElementById('weekly-challenge-modal');
    console.log('Modal element found:', modal);
    
    // Check if games data is loaded
    checkWeeklyChallengeGames();
    
    // Show modal on page load based on auth status
    checkAuthAndShowModal();
    console.log('✅ Weekly challenge modal auto-show enabled');
    
    // Add manual trigger for weekly challenge (can be called from UI)
    window.showWeeklyChallenge = function() {
        console.log('🎯 Manual weekly challenge trigger');
        checkAuthAndShowModal();
    };
    
    // Force show fake data immediately and repeatedly
    updateWeeklyLeaderboardPreview([]);
    
    // Force it again after a short delay to override any other calls
    setTimeout(() => updateWeeklyLeaderboardPreview([]), 100);
    setTimeout(() => updateWeeklyLeaderboardPreview([]), 500);
    setTimeout(() => updateWeeklyLeaderboardPreview([]), 1000);
    setTimeout(() => updateWeeklyLeaderboardPreview([]), 2000);
    setTimeout(() => updateWeeklyLeaderboardPreview([]), 3000);
    
    // DISABLED: Load weekly leaderboard (but fake data will override it)
    // loadWeeklyLeaderboard();
});

// ENTRY GUARD LOGIC - Determines which state to show based on user status
async function checkAuthAndShowModal() {
    console.log('🔍 Entry Guard: Checking auth and completion status...');
    
    // Check if user has valid token (signed in)
  if (authToken) {
        console.log('🔑 Token found, verifying user...');
        try {
            // Verify token is still valid
            const response = await fetch(`${API_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            if (response.ok) {
                currentUser = await response.json();
                console.log('✅ User authenticated:', currentUser.user.username);
                
                // SIGNED IN - Check if completed this week's challenge
                const completed = await checkWeeklyChallengeStatus();
                console.log('Challenge completed:', completed);
                
                // Also check local storage as fallback
                const currentWeek = getCurrentWeek();
                const localCompletion = localStorage.getItem(`challenge_week_${currentWeek}`);
                const hasLocalCompletion = !!localCompletion;
                console.log('Local completion found:', hasLocalCompletion);
                
                const isCompleted = completed || hasLocalCompletion;
                
                if (isCompleted) {
                    // SIGNED IN + COMPLETED → Show Thanks Card + Exit
                    console.log('🎉 User completed challenge - showing thanks card');
                    showThankYouCard();
                } else {
                    // SIGNED IN + NOT COMPLETED → Show Start Screen
                    console.log('🚀 User not completed - showing start screen');
                    setTimeout(() => {
                        showWeeklyChallengeModal();
                        showState('start');
                    }, 2000);
                }
            } else {
                console.log('❌ Token invalid, clearing...');
                // Token invalid, clear it and check local completion
                localStorage.removeItem('ball_knower_token');
                authToken = null;
                currentUser = null;
                checkLocalCompletion();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            // Network error, check local completion
            checkLocalCompletion();
        }
    } else {
        console.log('🚫 No token, checking local completion...');
        // NOT SIGNED IN - Check local completion
        checkLocalCompletion();
    }
}

// Check if user completed challenge locally (not signed in)
function checkLocalCompletion() {
    const currentWeek = getCurrentWeek();
    const localCompletion = localStorage.getItem(`challenge_week_${currentWeek}`);
    
    if (localCompletion) {
        // NOT SIGNED IN + LOCAL COMPLETED → Show Thanks Card + Exit
        console.log('🎉 Local completion found - showing thanks card');
        showThankYouCard();
    } else {
        // NOT SIGNED IN + NOT COMPLETED → Show Auth (Sign In tab)
        console.log('🔐 No completion found - showing auth modal');
        setTimeout(() => {
            showWeeklyChallengeModal();
            showState('auth');
        }, 2000);
    }
}

// Get current week identifier (e.g., "2025-W05")
function getCurrentWeek() {
    const now = new Date();
    const year = now.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
    const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    return `${year}-W${week.toString().padStart(2, '0')}`;
}

// Show Thanks Card (standalone, not in modal)
function showThankYouCard() {
    // Create a standalone thanks card instead of opening modal
    const existingCard = document.getElementById('standalone-thanks-card');
    if (existingCard) {
        existingCard.remove();
    }
    
    const thanksCard = document.createElement('div');
    thanksCard.id = 'standalone-thanks-card';
    thanksCard.innerHTML = `
        <div class="thanks-card-overlay">
            <div class="thanks-card-content">
                <h3>Thanks for playing this week! 🎉</h3>
                <p>You've already completed this week's challenge.</p>
                <p>Come back next week for a new challenge!</p>
                <button class="auth-btn-primary" onclick="closeThankYouCard()">
                    Got it!
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(thanksCard);
    console.log('📋 Standalone thanks card displayed');
}

// Close standalone thanks card
function closeThankYouCard() {
    const card = document.getElementById('standalone-thanks-card');
    if (card) {
        card.remove();
    }
}

// Check if user has completed this week's challenge
async function checkWeeklyChallengeStatus() {
  try {
        const response = await fetch(`${API_URL}/challenges/current`, {
            headers: authToken ? {
                'Authorization': `Bearer ${authToken}`
            } : {}
        });
        
        if (response.ok) {
            const data = await response.json();
            const challenge = data.challenge;
            
            if (challenge.user_progress) {
                // Check if user has already submitted (has an entry for this week)
                const hasSubmitted = challenge.user_progress.has_submitted;
                console.log('User has submitted this week:', hasSubmitted);
                return hasSubmitted;
            }
        }
        return false;
  } catch (error) {
    console.error('Failed to check challenge status:', error);
        return false;
  }
}

// Fallback function for updating modal title (when auth-functions.js isn't loaded yet)
function updateModalTitleFallback() {
    console.log('🔄 updateModalTitleFallback called');
    const modalTitle = document.getElementById('modal-title');
    if (!modalTitle) {
        console.log('❌ Modal title element not found in fallback');
        return;
    }
    
    const authToken = localStorage.getItem('ball_knower_token');
    if (!authToken) {
        console.log('❌ No auth token found in fallback');
        modalTitle.textContent = 'Ball Knower Weekly Challenge';
        return;
    }
    
    // Try to get user data from localStorage
    const userData = localStorage.getItem('ball_knower_user');
    if (userData) {
        try {
            const cached = JSON.parse(userData);
            if (cached.user) {
                const displayName = cached.user.display_name || cached.user.username;
                console.log('✅ Fallback - using cached user:', displayName);
                modalTitle.textContent = `Hi ${displayName}! 👋`;
                return;
            }
        } catch (error) {
            console.error('Error parsing cached user data in fallback:', error);
        }
    }
    
    console.log('❌ No valid user data found in fallback');
    modalTitle.textContent = 'Ball Knower Weekly Challenge';
}

// Show the weekly challenge modal
function showWeeklyChallengeModal() {
    console.log('🔍 Attempting to show modal...');
    const modal = document.getElementById('weekly-challenge-modal');
    console.log('Modal element:', modal);
    console.log('Modal classes before:', modal ? modal.className : 'No modal found');
    
    if (modal) {
        console.log('✅ Modal found, displaying');
        modal.classList.add('show');
        document.body.classList.add('modal-open');
        console.log('Modal classes after:', modal.className);
        
        // Debug computed styles
        const computedStyle = window.getComputedStyle(modal);
        console.log('Modal display style:', computedStyle.display);
        console.log('Modal visibility:', computedStyle.visibility);
        console.log('Modal opacity:', computedStyle.opacity);
        console.log('Modal z-index:', computedStyle.zIndex);
        console.log('Modal position:', computedStyle.position);
        console.log('Modal top:', computedStyle.top);
        console.log('Modal left:', computedStyle.left);
        console.log('Modal width:', computedStyle.width);
        console.log('Modal height:', computedStyle.height);
        
        // Update modal title with personalized greeting (with delay to ensure modal is loaded)
        setTimeout(() => {
            if (typeof updateModalTitle === 'function') {
                console.log('🔄 Updating modal title...');
                updateModalTitle();
            } else {
                console.log('❌ updateModalTitle function not found - using fallback');
                updateModalTitleFallback();
            }
        }, 100);
        
        // Default to AUTH state (entry guard logic will determine correct state)
        showState('auth');
    } else {
        console.error('❌ Modal element not found!');
    }
}

// Close the modal
function closeWeeklyChallengeModal() {
    console.log('🔒 Closing modal...');
  const modal = document.getElementById('weekly-challenge-modal');
  if (modal) {
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
        // Reset to auth step for next time - only if elements exist
        const authStep = document.getElementById('challenge-auth-step');
        if (authStep) {
            showAuthStep();
        } else {
            console.log('⚠️ Skipping showAuthStep - auth elements not found');
        }
    }
}

// Close modal when clicking outside
function handleModalClick(event) {
    // Only close if clicking the backdrop, not any child elements
    if (event.target.id === 'weekly-challenge-modal') {
        closeWeeklyChallengeModal();
    }
    // Don't prevent default or stop propagation - let clicks on content work normally
}

// Show authentication step
function showAuthStep() {
    const authStep = document.getElementById('challenge-auth-step');
    const overviewStep = document.getElementById('challenge-overview-step');
    
    if (authStep) {
        authStep.classList.add('active');
    } else {
        console.log('❌ challenge-auth-step element not found');
    }
    
    if (overviewStep) {
        overviewStep.classList.remove('active');
    } else {
        console.log('❌ challenge-overview-step element not found');
    }
}

// Show challenge overview step
function showChallengeOverview() {
    const authStep = document.getElementById('challenge-auth-step');
    const overviewStep = document.getElementById('challenge-overview-step');
    
    if (authStep) authStep.classList.remove('active');
    if (overviewStep) overviewStep.classList.add('active');
    
    // Hide auth step completely when logged in
    if (authStep) authStep.style.display = 'none';
    if (overviewStep) overviewStep.style.display = 'block';
    
    // Update profile view with user data
    if (currentUser && currentUser.user) {
        updateProfileView(currentUser.user);
    }
    
    // Load challenge progress
    loadChallengeProgress();
}

// Switch between login and register tabs
function switchAuthTab(tab) {
  const loginForm = document.getElementById('challenge-login-form');
  const registerForm = document.getElementById('challenge-register-form');
  const tabs = document.querySelectorAll('.challenge-tab');

  tabs.forEach(t => t.classList.remove('active'));

  if (tab === 'login') {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    tabs[0].classList.add('active');
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    tabs[1].classList.add('active');
  }
}

// Handle user registration
async function handleChallengeRegister(event) {
  event.preventDefault();

    const username = document.getElementById('register-username')?.value || '';
    const firstName = document.getElementById('register-firstname')?.value || '';
    const lastName = document.getElementById('register-lastname')?.value || '';
    const email = document.getElementById('register-email')?.value || '';
    const password = document.getElementById('register-password')?.value || '';
    const confirmPassword = document.getElementById('register-confirm-password')?.value || '';
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showNotification('Passwords do not match. Please try again.', 'error');
        return;
    }
    
    // Create display name from first and last name
    const displayName = `${firstName} ${lastName}`;
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
      username,
      email,
                password,
                display_name: displayName,
                email_opt_in: true
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Registration successful:', data.user.username);
            
            // Save token and user data
    authToken = data.token;
    localStorage.setItem('ball_knower_token', authToken);
            currentUser = { user: data.user };
            
            // Show success message
            showNotification('Account created successfully! Welcome to Ball Knower! 🎉', 'success');
            
            // Check if user already completed challenge
            const completed = await checkWeeklyChallengeStatus();
            if (completed) {
                // Already completed - close modal and show thanks
                closeWeeklyChallengeModal();
                showThankYouCard();
            } else {
                // Not completed - show start screen
                showState('start');
            }
        } else {
            console.error('Registration failed:', data);
            showNotification(data.error || 'Registration failed. Please try again.', 'error');
        }
  } catch (error) {
        console.error('Registration error:', error);
        showNotification('Network error. Please check your connection.', 'error');
  }
}

// Handle user login
async function handleChallengeLogin(event) {
  event.preventDefault();

    const username = document.getElementById('login-username')?.value || '';
    const email = document.getElementById('login-email')?.value || '';
    const password = document.getElementById('login-password')?.value || '';
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Login successful:', data.user.username);
            
            // Save token and user data
    authToken = data.token;
    localStorage.setItem('ball_knower_token', authToken);
            currentUser = { user: data.user };
            
            // Show success message
            showNotification(`Welcome back, ${data.user.display_name || data.user.username}! 👋`, 'success');
            
            // Check if user already completed challenge
            const completed = await checkWeeklyChallengeStatus();
            if (completed) {
                // Already completed - close modal and show thanks
                closeWeeklyChallengeModal();
                showThankYouCard();
            } else {
                // Not completed - show start screen
                showState('start');
            }
        } else {
            console.error('Login failed:', data);
            showNotification(data.error || 'Login failed. Please check your credentials.', 'error');
        }
  } catch (error) {
        console.error('Login error:', error);
        showNotification('Network error. Please check your connection.', 'error');
    }
}

// Load challenge progress
async function loadChallengeProgress() {
    try {
        const response = await fetch(`${API_URL}/challenges/current`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const challenge = data.challenge;
            
            if (challenge.user_progress) {
                const picksElement = document.getElementById('picks-complete');
                const triviaElement = document.getElementById('trivia-complete');
                
                if (picksElement) {
                    picksElement.textContent = challenge.user_progress.picks_complete;
                }
                if (triviaElement) {
                    triviaElement.textContent = challenge.user_progress.trivia_complete;
                }
            }
            
            // Load user's current rank
            await loadUserRank(challenge.id);
    }
  } catch (error) {
        console.error('Failed to load challenge progress:', error);
    }
}

// Load user's current rank
async function loadUserRank(challengeId) {
    try {
        const response = await fetch(`${API_URL}/leaderboards/${challengeId}/global?limit=100`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const leaderboard = data.leaderboard;
            
            // Find current user's rank
            const userRank = leaderboard.find(entry => entry.id === currentUser.user.id);
            if (userRank) {
                const rankElement = document.getElementById('user-current-rank');
                const pointsElement = document.getElementById('user-current-points');
                
                if (rankElement) {
                    rankElement.textContent = userRank.rank || '--';
                }
                if (pointsElement) {
                    pointsElement.textContent = userRank.total_points || 0;
                }
            }
        }
    } catch (error) {
        console.error('Failed to load user rank:', error);
    }
}

// Start picks (placeholder - you can integrate with your existing game)
function startPicks() {
    console.log('🎯 Starting picks with your games data...');
    showState('picks');
    loadChallengeGames('current');
}

// Start trivia (placeholder - you can integrate with your existing trivia)
function startTrivia() {
    showNotification('Trivia integration coming soon! 🧠', 'info');
  closeWeeklyChallengeModal();
}

// Continue to challenge
function continueToChallenge() {
    showNotification('Challenge features coming soon! 🎯', 'info');
  closeWeeklyChallengeModal();
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                max-width: 400px;
                animation: slideIn 0.3s ease-out;
            }
            .notification-success { background: #10b981; }
            .notification-error { background: #ef4444; }
            .notification-info { background: #3b82f6; }
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 10px;
            }
            .notification button {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Sign out function
function signOut() {
    // Clear stored data
    localStorage.removeItem('ball_knower_token');
    authToken = null;
    currentUser = null;
    
    console.log('🚪 User signed out');
    
    // Show notification
    showNotification('Signed out successfully! 👋', 'success');
    
    // Close modal
    closeWeeklyChallengeModal();
    
    // Reload page to reset state
    setTimeout(() => {
        window.location.reload();
    }, 500);
    
    // Show modal again after a short delay
    setTimeout(() => {
        showWeeklyChallengeModal();
        showAuthStep();
    }, 1000);
}

// Test email function (for development)
async function testEmail() {
    if (!currentUser) {
        showNotification('Please sign in first to test email', 'error');
        return;
    }
    
    try {
        const response = await fetch('http://localhost:3001/api/test-email', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: currentUser.user.id
            })
        });
        
        if (response.ok) {
            showNotification('Test email sent! Check your inbox 📧', 'success');
        } else {
            showNotification('Failed to send test email', 'error');
        }
    } catch (error) {
        console.error('Email test error:', error);
        showNotification('Email test failed', 'error');
    }
}

// Start weekly challenge
function startWeeklyChallenge() {
    // Hide the overview step and show the challenge interface
    document.getElementById('challenge-overview-step').style.display = 'none';
    document.getElementById('challenge-interface-step').style.display = 'block';
    
    // Load challenge data
    loadChallengeData();
    
    // Show a notification
    showNotification('Weekly Challenge started! Make your picks and answer trivia.', 'success');
}

// Load challenge data
async function loadChallengeData() {
    try {
        const response = await fetch(`${API_URL}/challenges/current`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const challenge = data.challenge;
            
            // Update challenge header
            document.querySelector('#challenge-interface-step .challenge-header h3').textContent = 
                `🏈 Week ${challenge.week_number} Challenge`;
            
            // Load games and trivia from the challenge
            await loadChallengeGames(challenge.id);
            await loadChallengeTrivia(challenge.id);
        }
    } catch (error) {
        console.error('Failed to load challenge data:', error);
    }
}

// Load challenge games with picks interface
async function loadChallengeGames(challengeId) {
    try {
        console.log('🎮 Loading weekly challenge games from database...');
        
        // Fetch games from the backend API
        const response = await fetch(`${API_URL}/picks/games/current`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const games = data.games || [];
            
            console.log('✅ Loaded games from database:', games.length, 'games');
            
            // Use the renderPicksInterface function to display games properly
            renderPicksInterface(games);
            
            console.log('✅ Weekly challenge games rendered successfully');
        } else {
            console.error('Failed to fetch games from API:', response.status);
            // Fallback to local games if API fails
            const localGames = typeof WEEKLY_CHALLENGE_GAMES !== 'undefined' ? WEEKLY_CHALLENGE_GAMES : [];
            if (localGames.length > 0) {
                console.log('🔄 Using local games as fallback:', localGames.length, 'games');
                renderPicksInterface(localGames);
            } else {
                document.getElementById('picks-form').innerHTML = '<div class="error">Failed to load games</div>';
            }
        }
        
    } catch (error) {
        console.error('Failed to load games:', error);
        // Fallback to local games if API fails
        const localGames = typeof WEEKLY_CHALLENGE_GAMES !== 'undefined' ? WEEKLY_CHALLENGE_GAMES : [];
        if (localGames.length > 0) {
            console.log('🔄 Using local games as fallback:', localGames.length, 'games');
            renderPicksInterface(localGames);
        } else {
            document.getElementById('picks-form').innerHTML = '<div class="error">Failed to load games</div>';
        }
    }
}

// Load challenge trivia
async function loadChallengeTrivia(challengeId) {
    try {
        const response = await fetch(`${API_URL}/trivia/questions/${challengeId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const questions = data.questions || [];
            
            const triviaList = document.getElementById('trivia-list');
            triviaList.innerHTML = questions.map((question, index) => `
                <div class="trivia-item">
                    <div class="trivia-question">${question.prompt}</div>
                    <button class="trivia-btn" onclick="startTrivia('${question.id}')">Answer Trivia</button>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Failed to load trivia:', error);
    }
}

// Select team
function selectTeam(gameId, selection, teamName) {
    // Update team selection
    const gameCard = document.querySelector(`[data-game-id="${gameId}"]`);
    const teamButtons = gameCard.querySelectorAll('.team-pick-btn');
    
    teamButtons.forEach(btn => {
        btn.classList.remove('selected');
    });
    
    const selectedBtn = gameCard.querySelector(`[data-selection="${selection}"]`);
    selectedBtn.classList.add('selected');
    
    // Store selection for submission
    gameCard.dataset.selectedTeam = selection;
    gameCard.dataset.selectedTeamName = teamName;
}

// Adjust confidence level
// OLD adjustConfidence function removed - using newer implementation below

// Check if total confidence equals 10
function checkTotalConfidence() {
    const gameCards = document.querySelectorAll('.game-pick-card');
    let totalConfidence = 0;
    
    gameCards.forEach(card => {
        const gameId = card.dataset.gameId;
        const confidence = parseInt(document.getElementById(`conf_${gameId}`).textContent);
        totalConfidence += confidence;
    });
    
    const submitBtn = document.querySelector('button[onclick="submitWeeklyPicks()"]');
    if (totalConfidence === 10) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Picks';
        submitBtn.style.opacity = '1';
    } else {
        submitBtn.disabled = true;
        submitBtn.textContent = `Submit Picks (${totalConfidence}/10 points)`;
        submitBtn.style.opacity = '0.6';
    }
}

// Submit weekly picks
async function submitWeeklyPicks() {
    try {
        // Collect picks data
        const picks = [];
        const gameCards = document.querySelectorAll('.game-pick-card');
        
        for (const card of gameCards) {
            const gameId = card.dataset.gameId;
            const selectedTeam = card.dataset.selectedTeam;
            const confidence = parseInt(document.getElementById(`conf_${gameId}`).textContent);
            
            if (!selectedTeam) {
                showNotification('Please make a pick for all games', 'error');
                return;
            }
            
            picks.push({
                gameId: gameId,
                selection: selectedTeam,
                confidence: confidence
            });
        }
        
        // Collect trivia answers (placeholder for now)
        const triviaAnswers = [];
        
        // Submit to backend
        const response = await fetch(`${API_URL}/picks/submit`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                picks: picks,
                triviaAnswers: triviaAnswers
            })
        });
        
        if (response.ok) {
            showNotification('Picks submitted! Now answer 5 trivia questions...', 'success');
            // Show trivia step
            showTriviaStep();
        } else {
            const error = await response.json();
            showNotification(error.error || 'Failed to submit picks', 'error');
        }
    } catch (error) {
        console.error('Submit picks error:', error);
        showNotification('Failed to submit picks', 'error');
    }
}

// Show trivia step
function showTriviaStep() {
    // Hide picks form and show trivia
    document.getElementById('picks-form').style.display = 'none';
    document.getElementById('trivia-step').style.display = 'block';
    
    // Load trivia questions
    loadTriviaQuestions();
}

// Load trivia questions
async function loadTriviaQuestions() {
    try {
        const response = await fetch(`${API_URL}/trivia/questions/random?count=5`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const questions = data.questions || [];
            
            const triviaContainer = document.getElementById('trivia-questions');
            triviaContainer.innerHTML = questions.map((question, index) => `
                <div class="trivia-question-card" data-question-id="${question.id}">
                    <div class="trivia-question-header">
                        <h4>Question ${index + 1}/5</h4>
                        <div class="trivia-timer" id="timer_${question.id}">10</div>
                    </div>
                    <div class="trivia-question-text">${question.prompt}</div>
                    <div class="trivia-options">
                        ${question.choices.map((choice, choiceIndex) => `
                            <button class="trivia-option" 
                                    onclick="selectTriviaAnswer('${question.id}', ${choiceIndex})"
                                    data-question-id="${question.id}"
                                    data-choice="${choiceIndex}">
                                ${choice}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `).join('');
            
            // Start first question timer
            startTriviaTimer(questions[0].id);
        }
    } catch (error) {
        console.error('Failed to load trivia:', error);
    }
}

// Start trivia timer
function startTriviaTimer(questionId) {
    let timeLeft = 10;
    const timerElement = document.getElementById(`timer_${questionId}`);
    
    const timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            // Auto-submit if no answer selected
            if (!document.querySelector(`[data-question-id="${questionId}"].selected`)) {
                selectTriviaAnswer(questionId, -1); // -1 for no answer
            }
        }
    }, 1000);
}

// Select trivia answer
function selectTriviaAnswer(questionId, choiceIndex) {
    // Mark question as answered
    const questionCard = document.querySelector(`[data-question-id="${questionId}"]`);
    const options = questionCard.querySelectorAll('.trivia-option');
    
    options.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.choice == choiceIndex) {
            option.classList.add('selected');
        }
    });
    
    // Move to next question or finish
    const nextQuestion = questionCard.nextElementSibling;
    if (nextQuestion) {
        const nextQuestionId = nextQuestion.dataset.questionId;
        startTriviaTimer(nextQuestionId);
    } else {
        // All questions answered, submit
        submitTriviaAnswers();
    }
}

// Submit trivia answers
async function submitTriviaAnswers() {
    try {
        const triviaAnswers = [];
        const questionCards = document.querySelectorAll('.trivia-question-card');
        
        questionCards.forEach(card => {
            const questionId = card.dataset.questionId;
            const selectedOption = card.querySelector('.trivia-option.selected');
            const choiceIndex = selectedOption ? parseInt(selectedOption.dataset.choice) : -1;
            
            triviaAnswers.push({
                questionId: questionId,
                choiceIndex: choiceIndex,
                isCorrect: false // Will be determined by backend
            });
        });
        
        // Submit trivia answers
        const response = await fetch(`${API_URL}/trivia/submit`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                answers: triviaAnswers
            })
        });
        
        if (response.ok) {
            showNotification('Trivia completed! Check the leaderboard! 🎉', 'success');
            closeWeeklyChallengeModal();
            // Update leaderboard
            loadLeaderboard();
        } else {
            showNotification('Failed to submit trivia answers', 'error');
        }
    } catch (error) {
        console.error('Submit trivia error:', error);
        showNotification('Failed to submit trivia answers', 'error');
    }
}

// View leaderboard
function viewLeaderboard() {
  closeWeeklyChallengeModal();
    // Navigate to leaderboard page
    window.location.href = '#leaderboard';
    loadLeaderboard();
}

// Load weekly leaderboard data
async function loadWeeklyLeaderboard() {
    console.log('🏆 Loading weekly leaderboard...');
    
    try {
        // Get current challenge ID
        const challengeResponse = await fetch(`${API_URL}/challenges/current`, {
            headers: authToken ? {
                'Authorization': `Bearer ${authToken}`
            } : {}
        });
        
        if (!challengeResponse.ok) {
            throw new Error('Failed to get current challenge');
        }
        
        const challengeData = await challengeResponse.json();
        const challengeId = challengeData.challenge.id;
        
        // Get leaderboard for this challenge
        const leaderboardResponse = await fetch(`${API_URL}/leaderboards/${challengeId}/global?limit=10`, {
            headers: authToken ? {
                'Authorization': `Bearer ${authToken}`
            } : {}
        });
        
        if (!leaderboardResponse.ok) {
            throw new Error('Failed to load leaderboard');
        }
        
        const leaderboardData = await leaderboardResponse.json();
        const leaderboard = leaderboardData.leaderboard || [];
        
        console.log('✅ Weekly leaderboard loaded:', leaderboard);
        
        // Update both home page preview and leaderboard page
        updateWeeklyLeaderboardPreview([]); // Force fake data instead of real data
        updateWeeklyLeaderboardFull(leaderboard);
        
    } catch (error) {
        console.error('❌ Failed to load weekly leaderboard:', error);
        
        // Show error message
        const errorMessage = 'Failed to load weekly leaderboard. Check back later!';
        updateWeeklyLeaderboardPreview([]);
        updateWeeklyLeaderboardFull([]);
    }
}

// Update weekly leaderboard preview on home page
function updateWeeklyLeaderboardPreview(leaderboard) {
    const previewContainer = document.getElementById('weekly-leaderboard-preview');
    if (!previewContainer) return;
    
    // Always show fake data for now (comment out when real data is available)
    previewContainer.innerHTML = `
        <div class="top-player">
            <span class="rank gold">1</span>
            <span class="player-name">BallKnowerPro</span>
            <span class="player-score">127 <i class="fas fa-fire"></i></span>
        </div>
        <div class="top-player">
            <span class="rank silver">2</span>
            <span class="player-name">TriviaKing</span>
            <span class="player-score">115 <i class="fas fa-fire"></i></span>
        </div>
        <div class="top-player">
            <span class="rank bronze">3</span>
            <span class="player-name">SportsGuru</span>
            <span class="player-score">108 <i class="fas fa-fire"></i></span>
        </div>
    `;
    return;
    
    // Original logic (commented out for now)
    /*
    if (leaderboard.length === 0) {
        // Show fake leaderboard data when no real data is available
        previewContainer.innerHTML = `
            <div class="top-player">
                <span class="rank gold">1</span>
                <span class="player-name">BallKnowerPro</span>
                <span class="player-score">127 <i class="fas fa-fire"></i></span>
            </div>
            <div class="top-player">
                <span class="rank silver">2</span>
                <span class="player-name">TriviaKing</span>
                <span class="player-score">115 <i class="fas fa-fire"></i></span>
            </div>
            <div class="top-player">
                <span class="rank bronze">3</span>
                <span class="player-name">SportsGuru</span>
                <span class="player-score">108 <i class="fas fa-fire"></i></span>
            </div>
        `;
        return;
    }
    */
    
    const top3 = leaderboard.slice(0, 3);
    const html = top3.map((entry, index) => {
        const rankClass = index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze';
        const rankNumber = entry.rank || index + 1;
        const playerName = entry.display_name || entry.username || 'Anonymous';
        const playerScore = entry.total_points || 0;
        
        return `
            <div class="top-player">
                <span class="rank ${rankClass}">${rankNumber}</span>
                <span class="player-name">${playerName}</span>
                <span class="player-score">${playerScore} <i class="fas fa-fire"></i></span>
            </div>
        `;
    }).join('');
    
    previewContainer.innerHTML = html;
}

// Update full weekly leaderboard on leaderboard page
function updateWeeklyLeaderboardFull(leaderboard) {
    const fullContainer = document.getElementById('weekly-leaderboard-list');
    if (!fullContainer) return;
    
    if (leaderboard.length === 0) {
        fullContainer.innerHTML = `
            <div class="no-data-message">
                <p>No weekly challenge data yet</p>
                <p class="subtitle">Be the first to make picks!</p>
            </div>
        `;
        return;
    }
    
    const html = leaderboard.map((entry, index) => `
        <div class="leaderboard-item ${index < 3 ? `rank-${index + 1}` : ''}">
            <div class="rank">${entry.rank || index + 1}</div>
            <div class="player-info">
                <div class="player-details">
                    <span class="player-name">${entry.display_name || entry.username || 'Anonymous'}</span>
                    <span class="player-stats">${entry.picks_points || 0} picks • ${entry.total_points || 0} total pts</span>
                </div>
            </div>
            <div class="score">${entry.total_points || 0}</div>
        </div>
    `).join('');
    
    fullContainer.innerHTML = html;
}

// Load weekly games for picks
async function loadWeeklyGames() {
    console.log('🏈 Loading weekly games...');
    const picksForm = document.getElementById('picks-form');
    
    if (!picksForm) {
        console.error('❌ Picks form not found');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/picks/games/current`, {
            headers: authToken ? {
                'Authorization': `Bearer ${authToken}`
            } : {}
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ Games loaded:', data);
        
        if (data.games && data.games.length > 0) {
            renderPicksInterface(data.games);
        } else {
            picksForm.innerHTML = `
                <div class="no-games">
                    <p>No games available for picks this week.</p>
                    <p>Check back later!</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('❌ Failed to load games:', error);
        picksForm.innerHTML = `
            <div class="error-message">
                <p>Failed to load games. Please try again.</p>
                <button class="auth-btn-secondary" onclick="loadWeeklyGames()">
                    Retry
                </button>
            </div>
        `;
    }
}

// Render the picks interface with games
function renderPicksInterface(games) {
    console.log('🎯 Rendering picks interface for', games.length, 'games');
    const picksForm = document.getElementById('picks-form');
    
    // Initialize picks tracking
    window.userPicks = {};
    window.confidenceValues = {};
    
    console.log('Initialized userPicks:', window.userPicks);
    console.log('Initialized confidenceValues:', window.confidenceValues);
    
    // Separate games into NFL and College based on actual data
    const nflGames = games.filter(game => game.type === 'NFL');
    const collegeGames = games.filter(game => game.type === 'COLLEGE');
    
    console.log('🔍 Debug - Total games:', games.length);
    console.log('🔍 Debug - NFL games:', nflGames.length, nflGames);
    console.log('🔍 Debug - College games:', collegeGames.length, collegeGames);
    console.log('🔍 Debug - Sample game structure:', games[0]);
    
    let html = '<div class="games-list">';
    
    // NFL Games Section
    html += `
        <div class="games-section">
            <div class="section-header">
                <h3>🏈 NFL Games</h3>
                <span class="section-count">${nflGames.length} games</span>
            </div>
            <div class="games-grid">
    `;
    
    nflGames.forEach((game, index) => {
        const gameId = game.id; // This is already a UUID string
        const homeTeam = game.home_team || 'Home';
        const awayTeam = game.away_team || 'Away';
        const spread = game.spread || 0;
        const favorite = game.home_team_favorite ? homeTeam : awayTeam;
        const underdog = game.home_team_favorite ? awayTeam : homeTeam;
        
        console.log(`NFL Game ${index}: ID="${gameId}", Teams="${awayTeam} @ ${homeTeam}"`);
        
        html += `
            <article class="wc-card" data-game-id="${gameId}">
                <h3 class="wc-matchup" data-testid="matchup">${awayTeam} @ ${homeTeam}</h3>
                
                <div class="wc-row" aria-label="game meta">
                    <div class="wc-box">
                        <span class="wc-label">Spread</span>
                        <span class="wc-value">${spread > 0 ? '+' : ''}${spread}</span>
                    </div>
                    <div class="wc-box">
                        <span class="wc-label">Favorite</span>
                        <span class="wc-value">${favorite}</span>
                    </div>
                    <div class="wc-box">
                        <span class="wc-label">Underdog</span>
                        <span class="wc-value">${underdog}</span>
                    </div>
                </div>
                
                <div class="pick-section">
                    <button class="team-btn favorite-btn" 
                            data-game-id="${gameId}"
                            data-team="favorite"
                            data-team-name="${favorite}"
                            aria-pressed="false"
                            aria-label="Select ${favorite} as favorite"
                            tabindex="0">
                        ${favorite}
                    </button>
                    
                    <button class="team-btn underdog-btn" 
                            data-game-id="${gameId}"
                            data-team="underdog"
                            data-team-name="${underdog}"
                            aria-pressed="false"
                            aria-label="Select ${underdog} as underdog"
                            tabindex="0">
                        ${underdog}
                    </button>
                </div>
            </article>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    // College Games Section
    html += `
        <div class="games-section">
            <div class="section-header">
                <h3>🎓 College Football Games</h3>
                <span class="section-count">${collegeGames.length} games</span>
            </div>
            <div class="games-grid">
    `;
    
    collegeGames.forEach((game, index) => {
        const gameId = game.id; // This is already a UUID string
        const homeTeam = game.home_team || 'Home';
        const awayTeam = game.away_team || 'Away';
        const spread = game.spread || 0;
        const favorite = game.home_team_favorite ? homeTeam : awayTeam;
        const underdog = game.home_team_favorite ? awayTeam : homeTeam;
        
        console.log(`College Game ${index}: ID="${gameId}", Teams="${awayTeam} @ ${homeTeam}"`);
        
        html += `
            <article class="wc-card" data-game-id="${gameId}">
                <h3 class="wc-matchup" data-testid="matchup">${awayTeam} @ ${homeTeam}</h3>
                
                <div class="wc-row" aria-label="game meta">
                    <div class="wc-box">
                        <span class="wc-label">Spread</span>
                        <span class="wc-value">${spread > 0 ? '+' : ''}${spread}</span>
                    </div>
                    <div class="wc-box">
                        <span class="wc-label">Favorite</span>
                        <span class="wc-value">${favorite}</span>
                    </div>
                    <div class="wc-box">
                        <span class="wc-label">Underdog</span>
                        <span class="wc-value">${underdog}</span>
                    </div>
                </div>
                
                <div class="pick-section">
                    <button class="team-btn favorite-btn" 
                            data-game-id="${gameId}"
                            data-team="favorite"
                            data-team-name="${favorite}"
                            aria-pressed="false"
                            aria-label="Select ${favorite} as favorite"
                            tabindex="0">
                        ${favorite}
                    </button>
                    
                    <button class="team-btn underdog-btn" 
                            data-game-id="${gameId}"
                            data-team="underdog"
                            data-team-name="${underdog}"
                            aria-pressed="false"
                            aria-label="Select ${underdog} as underdog"
                            tabindex="0">
                        ${underdog}
                    </button>
                </div>
            </article>
        `;
    });
    
    html += `
            </div>
        </div>
    </div>
    `;
    
    // Add confidence summary and submit button
    html += `
        <div class="picks-summary">
            <div class="picks-count">
                <strong>Games Picked: <span id="picks-count">0</span> / ${games.length}</strong>
            </div>
            <div class="picks-validation" id="picks-validation">
                Select all ${games.length} games to submit your picks
            </div>
            <button class="auth-btn-primary" id="submit-picks-btn" 
                    onclick="submitPicks()" disabled>
                Submit Picks
            </button>
        </div>
    `;
    
    console.log('🔍 Debug - Generated HTML length:', html.length);
    console.log('🔍 Debug - Generated HTML preview:', html.substring(0, 500));
    
    picksForm.innerHTML = html;
    
    // No confidence values needed - removed completely
    
    // Add event listeners with a small delay to ensure DOM is ready
    setTimeout(() => {
        addPicksEventListeners();
        restoreSelections();
    }, 100);
    
    console.log('✅ Picks interface rendered');
}

// Add event listeners for picks interface
function addPicksEventListeners() {
    console.log('🎯 Adding event listeners for picks interface');
    
    // Remove any existing listeners first
    document.querySelectorAll('.team-btn').forEach(button => {
        button.replaceWith(button.cloneNode(true));
    });
    
    // Confidence buttons removed - no longer needed
    
    // Team button listeners
    const teamButtons = document.querySelectorAll('.team-btn');
    console.log(`Found ${teamButtons.length} team buttons`);
    
    teamButtons.forEach((button, index) => {
        console.log(`Team button ${index}:`, button.dataset);
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const gameId = this.dataset.gameId; // Keep as string (UUID)
            const team = this.dataset.team;
            const teamName = this.dataset.teamName;
            
            console.log(`Team button clicked: ${team} (${teamName}) for game ${gameId}`);
            selectTeam(gameId, team, teamName);
        });
    });
    
    // Confidence button listeners removed - no longer needed
    
    console.log('✅ Event listeners added');
}

// Restore previous selections
function restoreSelections() {
    console.log('🔄 Restoring previous selections');
    
    if (window.userPicks) {
        Object.keys(window.userPicks).forEach(gameId => {
            const selection = window.userPicks[gameId];
            if (selection) {
                console.log(`Restoring selection for game ${gameId}: ${selection}`);
                updateTeamSelectionUI(gameId, selection); // Keep as string
            }
        });
    }
    
    if (window.confidenceValues) {
        Object.keys(window.confidenceValues).forEach(gameId => {
            const value = window.confidenceValues[gameId];
            if (value && value > 0) {
                console.log(`Restoring confidence for game ${gameId}: ${value}`);
                const display = document.getElementById(`confidence-${gameId}`);
                if (display) {
                    display.textContent = value;
                }
            }
        });
        // updateConfidenceTotal removed - no longer needed
    }
    
    console.log('✅ Selections restored');
}

// Select team for a game
function selectTeam(gameId, selection, teamName) {
    console.log(`🎯 Selected ${selection} (${teamName}) for game ${gameId}`);
    
    // Ensure userPicks exists
    if (!window.userPicks) {
        window.userPicks = {};
    }
    
    // Update picks tracking - use simple string values
    window.userPicks[gameId] = selection;
    
    console.log('Updated userPicks:', window.userPicks);
    
    // Update UI
    updateTeamSelectionUI(gameId, selection);
    
    validatePicks();
}

// Update team selection UI
function updateTeamSelectionUI(gameId, selection) {
    console.log(`🔍 Looking for game card with data-game-id="${gameId}"`);
    
    // Try multiple selector strategies
    let gameCard = document.querySelector(`[data-game-id="${gameId}"]`);
    if (!gameCard) {
        gameCard = document.querySelector(`[data-game-id='${gameId}']`);
    }
    if (!gameCard) {
        // Fallback: look for any game card and check its data attribute
        const allGameCards = document.querySelectorAll('.game-card');
        console.log(`Found ${allGameCards.length} game cards total`);
        allGameCards.forEach((card, index) => {
            const cardGameId = card.getAttribute('data-game-id');
            console.log(`Game card ${index}: data-game-id="${cardGameId}"`);
            if (cardGameId === gameId) { // Use strict equality for string comparison
                gameCard = card;
            }
        });
    }
    
    if (gameCard) {
        console.log(`✅ Found game card for gameId: ${gameId}`);
        
        // Remove previous selections and reset aria-pressed
        gameCard.querySelectorAll('.team-btn').forEach(btn => {
            btn.classList.remove('selected');
            btn.setAttribute('aria-pressed', 'false');
        });
        
        // Add selection to clicked button
        const selectedBtn = gameCard.querySelector(`[data-team="${selection}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
            selectedBtn.setAttribute('aria-pressed', 'true');
            console.log(`✅ Button selected: ${selectedBtn.textContent}`);
        } else {
            console.error(`❌ Button not found for team: ${selection}`);
            console.log('Available buttons:', gameCard.querySelectorAll('.team-btn'));
        }
    } else {
        console.error(`❌ Game card not found for gameId: ${gameId}`);
        console.log('All game cards:', document.querySelectorAll('.game-card'));
    }
}

// Adjust confidence for a game
// adjustConfidence function removed - no longer needed

// updateConfidenceTotal function removed - no longer needed

// Validate picks and enable/disable submit button
function validatePicks() {
    const totalGames = Object.keys(window.userPicks || {}).length;
    const pickedGames = Object.values(window.userPicks || {}).filter(pick => pick).length;
    
    // Update picks count display
    const picksCountEl = document.getElementById('picks-count');
    if (picksCountEl) {
        picksCountEl.textContent = pickedGames;
    }
    
    const submitBtn = document.getElementById('submit-picks-btn');
    const validation = document.getElementById('picks-validation');
    
    let isValid = false;
    let message = '';
    
    if (pickedGames < totalGames) {
        message = `Select all ${totalGames} games (${pickedGames}/${totalGames} selected)`;
    } else {
        message = 'Ready to submit!';
        isValid = true;
    }
    
    if (validation) {
        validation.textContent = message;
        validation.style.color = isValid ? '#4CAF50' : '#fff';
    }
    
    if (submitBtn) {
        submitBtn.disabled = !isValid;
    }
    
    return isValid;
}

// Submit picks and move to trivia
async function submitPicks() {
    console.log('📤 Submitting picks...');
    
    // Validate that all games have been picked
    const totalGames = Object.keys(window.userPicks).length;
    const pickedGames = Object.values(window.userPicks).filter(pick => pick).length;
    
    if (pickedGames !== totalGames) {
        console.error(`❌ Not all games picked: ${pickedGames}/${totalGames}`);
        showNotification(`Please pick all ${totalGames} games before submitting`, 'error');
        return;
    }
    
    // Validate we have the expected number of games
    const expectedGames = typeof WEEKLY_CHALLENGE_GAMES !== 'undefined' ? WEEKLY_CHALLENGE_GAMES.length : 9;
    if (totalGames !== expectedGames) {
        console.error(`❌ Expected ${expectedGames} games, got: ${totalGames}`);
        showNotification('Please wait for all games to load', 'error');
        return;
    }
    
    // No confidence validation needed - removed completely
    
    try {
        const picks = Object.keys(window.userPicks).map(gameId => {
            console.log(`Game ${gameId}: selection=${window.userPicks[gameId]}`);
            
            return {
                gameId: gameId, // Keep as string (UUID)
                selection: window.userPicks[gameId] === 'favorite' ? 'FAV' : 'DOG' // Convert to backend format
                // No confidence field needed
            };
        });
        
        // For now, send empty trivia answers array (we'll implement trivia later)
        const triviaAnswers = [];
        
        console.log('Picks to submit:', picks);
        console.log('Trivia answers:', triviaAnswers);
        console.log('Auth token:', authToken ? 'Present' : 'Missing');
        
        const response = await fetch(`${API_URL}/picks/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
            },
            body: JSON.stringify({ picks, triviaAnswers })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Backend error response:', errorData);
            throw new Error(`HTTP ${response.status}: ${response.statusText} - ${JSON.stringify(errorData)}`);
        }
        
        const result = await response.json();
        console.log('✅ Picks submitted:', result);
        
        // Mark user as completed for this week
        const currentWeek = getCurrentWeek();
        localStorage.setItem(`challenge_completed_${currentWeek}`, 'true');
        localStorage.setItem(`challenge_completed_${currentWeek}_timestamp`, Date.now().toString());
        
        // Update completion tracking
        window.challengeCompleted = true;
        
        // Move directly to thank you (no trivia)
        showState('thank-you');
        
    } catch (error) {
        console.error('❌ Failed to submit picks:', error);
        
        // Check if the error is because user already submitted
        if (error.message.includes('already submitted picks for this week')) {
            console.log('✅ User already completed this week - showing thank you screen');
            
            // Mark as completed and show thank you
            const currentWeek = getCurrentWeek();
            localStorage.setItem(`challenge_completed_${currentWeek}`, 'true');
            localStorage.setItem(`challenge_completed_${currentWeek}_timestamp`, Date.now().toString());
            window.challengeCompleted = true;
            
            showState('thank-you');
        } else {
            showNotification('Failed to submit picks. Please try again.', 'error');
        }
    }
}

// Export functions for global access
// Global functions for testing
window.showWeeklyChallengeModal = showWeeklyChallengeModal;
window.closeWeeklyChallengeModal = closeWeeklyChallengeModal;
window.handleModalClick = handleModalClick;
window.checkAuthAndShowModal = checkAuthAndShowModal;
window.switchAuthTab = switchAuthTab;
window.handleChallengeRegister = handleChallengeRegister;
window.handleChallengeLogin = handleChallengeLogin;
window.startPicks = startPicks;
window.startTrivia = startTrivia;
window.continueToChallenge = continueToChallenge;
window.startWeeklyChallenge = startWeeklyChallenge;
window.showState = showState;

// Test function to manually show modal
window.testWeeklyChallenge = function() {
    console.log('🧪 Testing weekly challenge modal...');
    showWeeklyChallengeModal();
    showState('auth');
};
window.selectTeam = selectTeam;
// adjustConfidence function defined at top of file to prevent errors
window.submitWeeklyPicks = submitWeeklyPicks;
window.selectTriviaAnswer = selectTriviaAnswer;
window.viewLeaderboard = viewLeaderboard;
window.signOut = signOut;
window.closeThankYouCard = closeThankYouCard;
window.loadWeeklyGames = loadWeeklyGames;
window.submitPicks = submitPicks;

console.log('🚀 Weekly Challenge JavaScript loaded and ready!');