/**
 * Music Mastering Mastery - Web UI Application
 * Interactive frontend for the skill assessment and learning platform
 */

// API Configuration
const API_BASE_URL = '/api';

// Application State
let currentUser = null;
let currentAssessment = null;
let currentQuestionIndex = 0;
let userAnswers = {};

// ==================== Navigation ====================

function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Show selected section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }
  
  // Update nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === sectionId) {
      link.classList.add('active');
    }
  });
  
  // Load section-specific data
  if (sectionId === 'content') {
    loadContent();
  } else if (sectionId === 'dashboard' && currentUser) {
    loadDashboard();
  }
}

// ==================== User Management ====================

async function createUser(email, displayName) {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, displayName })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    
    const user = await response.json();
    currentUser = user;
    
    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    showToast('Profile created successfully!', 'success');
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    showToast('Failed to create profile. Please try again.', 'error');
    throw error;
  }
}

async function loadDashboard() {
  if (!currentUser) return;
  
  try {
    const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}/dashboard`);
    
    if (!response.ok) {
      throw new Error('Failed to load dashboard');
    }
    
    const dashboard = await response.json();
    renderDashboard(dashboard);
  } catch (error) {
    console.error('Error loading dashboard:', error);
    showToast('Failed to load dashboard data.', 'error');
  }
}

function renderDashboard(dashboard) {
  // Update user info
  const initials = dashboard.user.displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  document.getElementById('user-initials').textContent = initials;
  document.getElementById('user-display-name').textContent = dashboard.user.displayName;
  
  // Update assessment status
  const statusBadge = document.getElementById('assessment-status');
  if (dashboard.user.hasCompletedInitialAssessment) {
    statusBadge.innerHTML = '<span class="status-dot"></span><span>Assessment Complete</span>';
    statusBadge.classList.remove('pending');
    document.getElementById('start-assessment-btn').textContent = 'View Results';
  } else {
    statusBadge.innerHTML = '<span class="status-dot"></span><span>Assessment Pending</span>';
    statusBadge.classList.add('pending');
  }
  
  // Update skill ratings
  const skillsList = document.getElementById('skills-list');
  const categoryIcons = {
    'FREQUENCY_FINDER': '🎚️',
    'EQ_SKILL': '🎛️',
    'BALANCING': '⚖️',
    'COMPRESSION': '📊',
    'SONG_STRUCTURE': '🎼'
  };
  
  if (dashboard.skillRatings && dashboard.skillRatings.length > 0) {
    skillsList.innerHTML = dashboard.skillRatings.map(skill => {
      const percentage = (skill.rating / skill.maxRating) * 100;
      const icon = categoryIcons[skill.category] || '🎵';
      const trendIcon = skill.trend === 'improving' ? '📈' : skill.trend === 'declining' ? '📉' : '';
      
      return `
        <div class="skill-item">
          <div class="skill-info">
            <span class="skill-icon">${icon}</span>
            <span class="skill-name">${skill.categoryName} ${trendIcon}</span>
          </div>
          <div class="skill-rating">
            <div class="rating-bar">
              <div class="rating-fill" style="width: ${percentage}%"></div>
            </div>
            <span class="rating-value">${skill.rating.toFixed(1)}</span>
          </div>
        </div>
      `;
    }).join('');
  }
  
  // Update learning plan progress
  if (dashboard.currentPlan) {
    const progress = dashboard.currentPlan.progress;
    document.getElementById('plan-progress').textContent = `${progress}%`;
    document.getElementById('progress-text').textContent = `${progress}%`;
    
    // Update progress ring
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (progress / 100) * circumference;
    document.getElementById('progress-ring-fill').style.strokeDashoffset = offset;
    
    // Update plan items
    const planItems = document.getElementById('plan-items');
    if (dashboard.currentPlan.currentItem) {
      const current = dashboard.currentPlan.currentItem;
      const nextItems = dashboard.currentPlan.nextItems || [];
      
      planItems.innerHTML = `
        <div class="plan-current">
          <h5>Current: ${current.title}</h5>
          <p>${current.description}</p>
          <span class="tag tag-blue">${current.contentType}</span>
        </div>
        ${nextItems.length > 0 ? `
          <div class="plan-next">
            <h5>Up Next:</h5>
            <ul>
              ${nextItems.slice(0, 3).map(item => `
                <li>${item.title}</li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
      `;
    } else {
      planItems.innerHTML = '<p class="no-plan-message">All items completed! Great job!</p>';
    }
  }
  
  // Update recent activity
  const activityList = document.getElementById('activity-list');
  if (dashboard.recentActivity && dashboard.recentActivity.length > 0) {
    activityList.innerHTML = dashboard.recentActivity.map(activity => `
      <div class="activity-item">
        <div class="activity-icon">📚</div>
        <div class="activity-content">
          <div class="activity-text">${activity.activity}</div>
          <div class="activity-date">${new Date(activity.date).toLocaleDateString()}</div>
        </div>
        ${activity.score ? `<span class="activity-score">${activity.score}%</span>` : ''}
      </div>
    `).join('');
  } else {
    activityList.innerHTML = '<p class="no-activity-message">No recent activity yet. Start by taking the assessment!</p>';
  }
}

// ==================== Assessment ====================

async function startAssessment() {
  if (!currentUser) {
    showToast('Please create a profile first.', 'error');
    showSection('dashboard');
    return;
  }
  
  if (currentUser.hasCompletedInitialAssessment) {
    showToast('You have already completed the assessment.', 'info');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/assessment/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to start assessment');
    }
    
    const data = await response.json();
    currentAssessment = data;
    currentQuestionIndex = 0;
    userAnswers = {};
    
    // Show question UI
    document.getElementById('assessment-intro').classList.add('hidden');
    document.getElementById('assessment-questions').classList.remove('hidden');
    document.getElementById('assessment-results').classList.add('hidden');
    
    renderQuestion();
    showToast('Assessment started! Good luck!', 'success');
  } catch (error) {
    console.error('Error starting assessment:', error);
    showToast(error.message || 'Failed to start assessment.', 'error');
  }
}

function renderQuestion() {
  if (!currentAssessment || !currentAssessment.questions) return;
  
  const question = currentAssessment.questions[currentQuestionIndex];
  const totalQuestions = currentAssessment.questions.length;
  
  // Update progress
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  document.getElementById('question-progress-fill').style.width = `${progress}%`;
  document.getElementById('question-progress-label').textContent = 
    `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
  
  // Update question details
  const categoryNames = {
    'FREQUENCY_FINDER': 'Frequency Finder',
    'EQ_SKILL': 'EQ Skills',
    'BALANCING': 'Mix Balancing',
    'COMPRESSION': 'Compression',
    'SONG_STRUCTURE': 'Song Structure'
  };
  
  const difficultyNames = {
    1: 'Beginner',
    2: 'Intermediate',
    3: 'Advanced',
    4: 'Expert',
    5: 'Master'
  };
  
  document.getElementById('question-category').textContent = categoryNames[question.category] || question.category;
  document.getElementById('question-difficulty').textContent = difficultyNames[question.difficulty] || 'Unknown';
  document.getElementById('question-prompt').textContent = question.prompt;
  
  // Render options
  const optionsContainer = document.getElementById('question-options');
  if (question.options && question.options.length > 0) {
    optionsContainer.innerHTML = question.options.map((option, index) => {
      const letter = String.fromCharCode(65 + index);
      const isSelected = userAnswers[question.id] === option.id;
      
      return `
        <button class="option-btn ${isSelected ? 'selected' : ''}" 
                onclick="selectAnswer('${question.id}', '${option.id}')">
          <span class="option-letter">${letter}</span>
          <span class="option-text">${option.text}</span>
        </button>
      `;
    }).join('');
  } else {
    // For questions without options, show a text input
    optionsContainer.innerHTML = `
      <div class="form-group">
        <input type="text" id="text-answer" placeholder="Enter your answer" 
               value="${userAnswers[question.id] || ''}"
               onchange="selectAnswer('${question.id}', this.value)">
      </div>
    `;
  }
  
  // Update navigation buttons
  document.getElementById('prev-btn').disabled = currentQuestionIndex === 0;
  document.getElementById('next-btn').textContent = 
    currentQuestionIndex === totalQuestions - 1 ? 'Submit' : 'Next';
}

function selectAnswer(questionId, answerId) {
  userAnswers[questionId] = answerId;
  renderQuestion(); // Re-render to show selection
}

function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion();
  }
}

async function nextQuestion() {
  const question = currentAssessment.questions[currentQuestionIndex];
  
  if (!userAnswers[question.id]) {
    showToast('Please select an answer before continuing.', 'error');
    return;
  }
  
  if (currentQuestionIndex < currentAssessment.questions.length - 1) {
    currentQuestionIndex++;
    renderQuestion();
  } else {
    // Submit assessment
    await submitAssessment();
  }
}

async function submitAssessment() {
  try {
    const response = await fetch(`${API_BASE_URL}/assessment/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assessmentId: currentAssessment.assessmentId,
        answers: userAnswers
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit assessment');
    }
    
    const data = await response.json();
    
    // Update current user
    currentUser.hasCompletedInitialAssessment = true;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Show results
    renderResults(data);
    showToast('Assessment completed!', 'success');
  } catch (error) {
    console.error('Error submitting assessment:', error);
    showToast('Failed to submit assessment.', 'error');
  }
}

function renderResults(data) {
  document.getElementById('assessment-intro').classList.add('hidden');
  document.getElementById('assessment-questions').classList.add('hidden');
  document.getElementById('assessment-results').classList.remove('hidden');
  
  // Overall score
  document.getElementById('overall-score').textContent = Math.round(data.result.overallScore);
  
  // Skill ratings
  const skillsContainer = document.getElementById('results-skills');
  skillsContainer.innerHTML = data.result.sections.map(section => {
    const stars = Array(5).fill(0).map((_, i) => 
      `<span class="star ${i < section.rating ? 'filled' : ''}">★</span>`
    ).join('');
    
    return `
      <div class="result-skill-item">
        <div class="result-skill-name">
          <span>${section.categoryName}</span>
        </div>
        <div class="result-skill-rating">
          <div class="rating-stars">${stars}</div>
          <span>${section.rating}/5</span>
        </div>
      </div>
    `;
  }).join('');
  
  // Recommendations
  const recommendationsList = document.getElementById('recommendations-list');
  recommendationsList.innerHTML = data.result.recommendations.map(rec => 
    `<li>${rec}</li>`
  ).join('');
}

// ==================== Content Browser ====================

async function loadContent() {
  const category = document.getElementById('category-filter').value;
  const type = document.getElementById('type-filter').value;
  const difficulty = document.getElementById('difficulty-filter').value;
  
  try {
    let url = `${API_BASE_URL}/content`;
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (type) params.append('type', type);
    if (difficulty) params.append('difficulty', difficulty);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to load content');
    }
    
    const data = await response.json();
    renderContent(data.content);
    updateContentStats(data.content);
  } catch (error) {
    console.error('Error loading content:', error);
    showToast('Failed to load content.', 'error');
  }
}

function renderContent(content) {
  const grid = document.getElementById('content-grid');
  
  if (!content || content.length === 0) {
    grid.innerHTML = '<p class="no-content-message">No content found matching your filters.</p>';
    return;
  }
  
  const categoryNames = {
    'FREQUENCY_FINDER': 'Frequency',
    'EQ_SKILL': 'EQ',
    'BALANCING': 'Balancing',
    'COMPRESSION': 'Compression',
    'SONG_STRUCTURE': 'Structure'
  };
  
  const typeClasses = {
    'LESSON': 'badge-lesson',
    'MINI_GAME': 'badge-game',
    'QUIZ': 'badge-quiz'
  };
  
  const typeIcons = {
    'LESSON': '📖',
    'MINI_GAME': '🎮',
    'QUIZ': '❓'
  };
  
  grid.innerHTML = content.map(item => {
    const diffDots = Array(4).fill(0).map((_, i) => 
      `<span class="diff-dot ${i < item.difficulty ? 'filled' : ''}"></span>`
    ).join('');
    
    return `
      <div class="content-card">
        <div class="content-card-header">
          <span class="content-type-badge ${typeClasses[item.contentType] || ''}">
            ${typeIcons[item.contentType] || ''} ${item.contentType.replace('_', ' ')}
          </span>
          <div class="content-difficulty">${diffDots}</div>
        </div>
        <div class="content-card-body">
          <h4 class="content-card-title">${item.title}</h4>
          <p class="content-card-desc">${item.description}</p>
          <div class="content-card-meta">
            <span class="content-card-category">${categoryNames[item.category] || item.category}</span>
            <span>⏱️ ${item.estimatedDuration} min</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function updateContentStats(content) {
  document.getElementById('total-content').textContent = content.length;
  document.getElementById('total-lessons').textContent = content.filter(c => c.contentType === 'LESSON').length;
  document.getElementById('total-games').textContent = content.filter(c => c.contentType === 'MINI_GAME').length;
  document.getElementById('total-quizzes').textContent = content.filter(c => c.contentType === 'QUIZ').length;
}

function filterContent() {
  loadContent();
}

// ==================== Toast Notifications ====================

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };
  
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ'}</span>
    <span class="toast-message">${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ==================== Initialization ====================

document.addEventListener('DOMContentLoaded', () => {
  // Set up navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      showSection(section);
    });
  });
  
  // Load saved user
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
      
      // Show dashboard content
      document.getElementById('user-setup').classList.add('hidden');
      document.getElementById('dashboard-content').classList.remove('hidden');
      
      // Load dashboard data
      loadDashboard();
    } catch (e) {
      console.error('Error loading saved user:', e);
      localStorage.removeItem('currentUser');
    }
  }
  
  // Set up user form
  const userForm = document.getElementById('user-form');
  if (userForm) {
    userForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const displayName = document.getElementById('display-name').value;
      const email = document.getElementById('email').value;
      
      try {
        await createUser(email, displayName);
        
        // Show dashboard content
        document.getElementById('user-setup').classList.add('hidden');
        document.getElementById('dashboard-content').classList.remove('hidden');
        
        loadDashboard();
      } catch (error) {
        // Error already handled in createUser
      }
    });
  }
  
  // Initial section
  showSection('home');
});
