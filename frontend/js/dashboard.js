// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        document.getElementById('userWelcome').textContent = `Welcome, ${currentUser.name}`;
        loadUserData();
    }
});

// Load user-specific data
function loadUserData() {
    const assessmentHistory = getAssessmentHistory();
    if (assessmentHistory.length > 0) {
        updateLatestAssessment(assessmentHistory[assessmentHistory.length - 1]);
        updateHistoryTable(assessmentHistory);
        updateRiskTrend(assessmentHistory);
    }
}

// Navigation functions
function newAssessment() {
    window.location.href = 'details.html';
}

function viewHistory() {
    // Could open a modal or navigate to a detailed history page
    alert('Full history view - Feature coming soon!');
}

function goToDashboard() {
    window.location.href = 'dashboard.html';
}

// Get assessment history from localStorage
function getAssessmentHistory() {
    const historyStr = localStorage.getItem('assessmentHistory');
    return historyStr ? JSON.parse(historyStr) : [];
}

// Update latest assessment display
function updateLatestAssessment(assessment) {
    if (!assessment) return;
    
    const riskElement = document.querySelector('.risk');
    if (riskElement) {
        riskElement.textContent = `${assessment.riskLevel} Risk`;
        riskElement.className = `risk ${assessment.riskLevel.toLowerCase()}`;
    }
}

// Update history table
function updateHistoryTable(history) {
    const tableBody = document.getElementById('historyTable');
    if (!tableBody || history.length === 0) return;
    
    tableBody.innerHTML = '';
    
    history.slice(-5).reverse().forEach(assessment => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${new Date(assessment.date).toLocaleDateString()}</td>
            <td>${assessment.symptoms.substring(0, 50)}${assessment.symptoms.length > 50 ? '...' : ''}</td>
            <td>${assessment.hasImage ? 'Uploaded' : 'None'}</td>
            <td class="${assessment.riskLevel.toLowerCase()}">${assessment.riskLevel}</td>
            <td>${assessment.recommendation}</td>
        `;
    });
}

// Update risk trend
function updateRiskTrend(history) {
    const trendList = document.getElementById('riskTrend');
    if (!trendList || history.length === 0) return;
    
    trendList.innerHTML = '';
    
    history.slice(-3).reverse().forEach(assessment => {
        const li = document.createElement('li');
        li.textContent = `${new Date(assessment.date).toLocaleDateString()} – ${assessment.riskLevel} Risk`;
        trendList.appendChild(li);
    });
}

// Auth check and utility functions
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}
function openChat() {
  window.location.href = "chat.html";
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('assessmentHistory');
    window.location.href = 'index.html';
}