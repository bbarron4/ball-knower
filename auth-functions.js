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
async function showState(stateName) {
    console.log(`🔄 Switching to state: ${stateName}`);
    
    // Check if user is trying to access picks but has already submitted
    if (stateName.toUpperCase() === 'PICKS') {
        const authToken = localStorage.getItem('ball_knower_token');
        if (authToken) {
            try {
                const response = await fetch('http://localhost:3001/api/challenges/current', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const challenge = data.challenge;
                    
                    if (challenge.user_progress && challenge.user_progress.has_submitted) {
                        console.log('🚫 User already submitted - redirecting to thank you');
                        showState('thank-you');
                        return;
                    }
                }
            } catch (error) {
                console.error('Failed to check submission status:', error);
            }
        }
    }
    
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
            case 'AUTH':
                // Update modal title with personalized greeting
                updateModalTitle();
                // Also try a direct approach as backup
                setTimeout(() => {
                    updateModalTitleDirectly();
                }, 200);
                // Chrome-specific fix - try multiple times with different delays
                setTimeout(() => {
                    forceUpdateModalTitle();
                }, 500);
                setTimeout(() => {
                    forceUpdateModalTitle();
                }, 1000);
                break;
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

// Update modal title with personalized greeting
async function updateModalTitle(retryCount = 0) {
    console.log(`🔄 updateModalTitle called (attempt ${retryCount + 1})`);
    const modalTitle = document.getElementById('modal-title');
    if (!modalTitle) {
        console.log('❌ Modal title element not found');
        // Retry up to 3 times with increasing delay
        if (retryCount < 3) {
            console.log(`🔄 Retrying in ${(retryCount + 1) * 200}ms...`);
            setTimeout(() => updateModalTitle(retryCount + 1), (retryCount + 1) * 200);
        }
        return;
    }
    
    console.log('✅ Modal title element found:', modalTitle);
    
    // Check if user is signed in
    const authToken = localStorage.getItem('ball_knower_token');
    console.log('🔑 Auth token found:', !!authToken);
    
    if (authToken) {
        try {
            // Try to get cached user data first
            const userData = localStorage.getItem('ball_knower_user');
            console.log('📦 Cached user data:', userData ? 'Found' : 'Not found');
            
            if (userData) {
                const cached = JSON.parse(userData);
                console.log('📦 Parsed cached data:', cached);
                
                if (cached.user && cached.timestamp && (Date.now() - cached.timestamp) < 5 * 60 * 1000) {
                    const displayName = cached.user.display_name || cached.user.username;
                    console.log('✅ Using cached user data:', displayName);
                    modalTitle.textContent = `Hi ${displayName}! 👋`;
                    return;
                } else {
                    console.log('⏰ Cached data expired or invalid');
                }
            }
            
            // Fetch fresh user data
            console.log('🌐 Fetching fresh user data from API...');
            const response = await fetch('http://localhost:3001/api/users/me', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            console.log('🌐 API response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                const user = data.user;
                const displayName = user.display_name || user.username;
                console.log('✅ API user data received:', displayName);
                modalTitle.textContent = `Hi ${displayName}! 👋`;
                
                // Cache the user data
                localStorage.setItem('ball_knower_user', JSON.stringify({
                    user: user,
                    timestamp: Date.now()
                }));
                console.log('💾 User data cached');
            } else {
                console.log('❌ API request failed:', response.status);
                modalTitle.textContent = 'Ball Knower Weekly Challenge';
            }
        } catch (error) {
            console.error('Error updating modal title:', error);
            modalTitle.textContent = 'Ball Knower Weekly Challenge';
        }
    } else {
        modalTitle.textContent = 'Ball Knower Weekly Challenge';
    }
}

// Direct modal title update (backup approach)
function updateModalTitleDirectly() {
    console.log('🔄 updateModalTitleDirectly called');
    const modalTitle = document.getElementById('modal-title');
    if (!modalTitle) {
        console.log('❌ Modal title element not found in direct approach');
        return;
    }
    
    const authToken = localStorage.getItem('ball_knower_token');
    if (!authToken) {
        console.log('❌ No auth token found in direct approach');
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
                console.log('✅ Direct approach - using cached user:', displayName);
                modalTitle.textContent = `Hi ${displayName}! 👋`;
                return;
            }
        } catch (error) {
            console.error('Error parsing cached user data in direct approach:', error);
        }
    }
    
    console.log('❌ No valid user data found in direct approach');
    modalTitle.textContent = 'Ball Knower Weekly Challenge';
}

// Force update modal title (Chrome-specific fix)
function forceUpdateModalTitle() {
    console.log('🔥 forceUpdateModalTitle called (Chrome fix)');
    
    // Try multiple ways to find the modal title
    let modalTitle = document.getElementById('modal-title');
    if (!modalTitle) {
        // Try alternative selectors
        modalTitle = document.querySelector('.challenge-modal-title');
        if (!modalTitle) {
            modalTitle = document.querySelector('h2');
        }
    }
    
    if (!modalTitle) {
        console.log('❌ Modal title element not found in force approach');
        return;
    }
    
    console.log('✅ Modal title element found in force approach:', modalTitle);
    
    const authToken = localStorage.getItem('ball_knower_token');
    if (!authToken) {
        console.log('❌ No auth token found in force approach');
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
                console.log('🔥 Force approach - using cached user:', displayName);
                modalTitle.textContent = `Hi ${displayName}! 👋`;
                modalTitle.innerHTML = `Hi ${displayName}! 👋`; // Also try innerHTML
                return;
            }
        } catch (error) {
            console.error('Error parsing cached user data in force approach:', error);
        }
    }
    
    console.log('❌ No valid user data found in force approach');
    modalTitle.textContent = 'Ball Knower Weekly Challenge';
}

// Export functions to global scope
window.switchToSignIn = switchToSignIn;
window.switchToSignInTab = switchToSignInTab;
window.switchToCreateAccount = switchToCreateAccount;
window.switchToCreateTab = switchToCreateTab;
window.updateProfileView = updateProfileView;
window.showState = showState;
window.updateModalTitle = updateModalTitle;
window.updateModalTitleDirectly = updateModalTitleDirectly;
window.forceUpdateModalTitle = forceUpdateModalTitle;

