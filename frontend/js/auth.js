// Hardcoded credentials (for demo purposes)
const DEMO_USERS = [
    { email: 'demo@dermsight.com', password: 'demo123', name: 'Demo User' },
    { email: 'patient@dermsight.com', password: 'patient123', name: 'Test Patient' },
    { email: 'doctor@dermsight.com', password: 'doctor123', name: 'Dr. Smith' }
];

// Check if user is already logged in
function checkAuthStatus() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser && window.location.pathname.includes('index.html')) {
        window.location.href = 'dashboard.html';
    } else if (!currentUser && !window.location.pathname.includes('index.html')) {
        window.location.href = 'index.html';
    }
}

// Login function
function login(email, password) {
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify({
            email: user.email,
            name: user.name,
            loginTime: new Date().toISOString()
        }));
        return { success: true, user: user };
    } else {
        return { success: false, message: 'Invalid email or password' };
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('assessmentHistory');
    window.location.href = 'index.html';
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// DOM Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check auth status on page load
    checkAuthStatus();
    
    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('error-message');
            
            const result = login(email, password);
            
            if (result.success) {
                window.location.href = 'dashboard.html';
            } else {
                errorDiv.textContent = result.message;
                errorDiv.style.display = 'block';
            }
        });
    }
});