// Weekly Challenge Frontend Integration
// API Configuration
const API_URL = 'http://localhost:3001/api';
let authToken = localStorage.getItem('ball_knower_token');
let currentUser = null;
let currentChallenge = null;

// API Helper Functions
async function apiCall(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const options = {
    method,
    headers
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', async () => {
  console.log('Ball Knower Weekly Challenge initializing...');
  
  // Check if user is authenticated
  if (authToken) {
    try {
      const userData = await apiCall('/auth/me');
      currentUser = userData.user;
      await checkWeeklyChallengeStatus();
    } catch (error) {
      console.error('Auth check failed:', error);
      authToken = null;
      localStorage.removeItem('ball_knower_token');
      showWeeklyChallengeModal();
    }
  } else {
    // Show modal after 2 seconds for new users
    setTimeout(() => showWeeklyChallengeModal(), 2000);
  }
});

// Check if user has completed this week's challenge
async function checkWeeklyChallengeStatus() {
  try {
    const data = await apiCall('/challenges/current');
    currentChallenge = data.challenge;

    if (currentChallenge.user_progress) {
      const { picks_complete, trivia_complete } = currentChallenge.user_progress;
      
      // Show modal if not complete
      if (picks_complete < 5 || trivia_complete < 3) {
        showWeeklyChallengeModal();
        switchToChallengeOverview();
      }
    } else {
      showWeeklyChallengeModal();
    }
  } catch (error) {
    console.error('Failed to check challenge status:', error);
  }
}

// Modal Functions
function showWeeklyChallengeModal() {
  const modal = document.getElementById('weekly-challenge-modal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function closeWeeklyChallengeModal() {
  const modal = document.getElementById('weekly-challenge-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Tab Switching
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

// Registration Handler
async function handleChallengeRegister(event) {
  event.preventDefault();

  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  try {
    const data = await apiCall('/auth/register', 'POST', {
      username,
      email,
      password
    });

    // Save token
    authToken = data.token;
    localStorage.setItem('ball_knower_token', authToken);
    currentUser = data.user;

    // Show success and switch to overview
    alert(`Welcome to Ball Knower, ${data.user.username}!`);
    await loadCurrentChallenge();
    switchToChallengeOverview();
  } catch (error) {
    alert(`Registration failed: ${error.message}`);
  }
}

// Login Handler
async function handleChallengeLogin(event) {
  event.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const data = await apiCall('/auth/login', 'POST', {
      email,
      password
    });

    // Save token
    authToken = data.token;
    localStorage.setItem('ball_knower_token', authToken);
    currentUser = data.user;

    // Load challenge and switch to overview
    await loadCurrentChallenge();
    switchToChallengeOverview();
  } catch (error) {
    alert(`Login failed: ${error.message}`);
  }
}

// Load Current Challenge
async function loadCurrentChallenge() {
  try {
    const data = await apiCall('/challenges/current');
    currentChallenge = data.challenge;

    // Update modal with challenge data
    if (currentChallenge.user_progress) {
      document.getElementById('picks-complete').textContent = currentChallenge.user_progress.picks_complete || 0;
      document.getElementById('trivia-complete').textContent = currentChallenge.user_progress.trivia_complete || 0;
    }

    // Get user's rank
    const leaderboardData = await apiCall(`/leaderboards/${currentChallenge.id}/global?limit=100`);
    const userEntry = leaderboardData.leaderboard.find(entry => entry.id === currentUser.id);
    
    if (userEntry) {
      document.getElementById('user-current-rank').textContent = userEntry.rank;
      document.getElementById('user-current-points').textContent = userEntry.total_points;
    }
  } catch (error) {
    console.error('Failed to load challenge:', error);
  }
}

// Switch to Challenge Overview
function switchToChallengeOverview() {
  document.getElementById('challenge-auth-step').classList.remove('active');
  document.getElementById('challenge-overview-step').classList.add('active');
  
  if (currentUser) {
    document.getElementById('user-display-name').textContent = currentUser.username;
  }
}

// Start Picks
function startPicks() {
  closeWeeklyChallengeModal();
  // TODO: Navigate to picks page
  alert('Picks page coming soon! This will open the game picker interface.');
}

// Start Trivia
function startTrivia() {
  closeWeeklyChallengeModal();
  // TODO: Navigate to trivia page
  alert('Trivia page coming soon! This will open the timed trivia quiz.');
}

// Continue to Challenge
function continueToChallenge() {
  closeWeeklyChallengeModal();
  // TODO: Navigate to challenge dashboard
  alert('Challenge dashboard coming soon!');
}

// Expose functions to window for onclick handlers
window.switchAuthTab = switchAuthTab;
window.handleChallengeRegister = handleChallengeRegister;
window.handleChallengeLogin = handleChallengeLogin;
window.closeWeeklyChallengeModal = closeWeeklyChallengeModal;
window.startPicks = startPicks;
window.startTrivia = startTrivia;
window.continueToChallenge = continueToChallenge;

console.log('Ball Knower Weekly Challenge ready!');
