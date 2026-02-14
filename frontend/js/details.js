// Image preview handler
document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('imageUpload');
    const preview = document.getElementById('preview');
    
    if (imageUpload) {
        imageUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Assessment form handler
    const assessmentForm = document.getElementById('assessmentForm');
    if (assessmentForm) {
        assessmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            analyzeRisk();
        });
    }
});

// Simple risk analysis algorithm (demo purposes)
function analyzeRisk() {
    const age = parseInt(document.getElementById('age').value);
    const symptoms = document.getElementById('symptoms').value.toLowerCase();
    const imageUpload = document.getElementById('imageUpload');
    const hasImage = imageUpload.files.length > 0;
    
    // Simple keyword-based risk assessment
    let riskScore = 0;
    const highRiskKeywords = ['bleeding', 'severe', 'intense pain', 'fever', 'swelling', 'pus', 'rapid growth'];
    const moderateRiskKeywords = ['rash', 'itching', 'discomfort', 'mild pain', 'redness', 'irritation'];
    
    // Check for high-risk keywords
    highRiskKeywords.forEach(keyword => {
        if (symptoms.includes(keyword)) riskScore += 3;
    });
    
    // Check for moderate-risk keywords
    moderateRiskKeywords.forEach(keyword => {
        if (symptoms.includes(keyword)) riskScore += 1;
    });
    
    // Age factor
    if (age < 5 || age > 65) riskScore += 1;
    
    // Determine risk level
    let riskLevel, advice, riskClass;
    if (riskScore >= 5) {
        riskLevel = 'High';
        riskClass = 'high';
        advice = 'Immediate medical attention recommended. Please consult a healthcare professional as soon as possible.';
    } else if (riskScore >= 2) {
        riskLevel = 'Moderate';
        riskClass = 'moderate';
        advice = 'Schedule an appointment with a dermatologist within 1-2 weeks. Monitor symptoms closely.';
    } else {
        riskLevel = 'Low';
        riskClass = 'low';
        advice = 'Continue monitoring. If symptoms worsen or persist beyond a week, consult a healthcare provider.';
    }
    
    // Store current assessment data
    window.currentAssessment = {
        date: new Date().toISOString(),
        age: age,
        gender: document.getElementById('gender').value,
        conditions: document.getElementById('conditions').value,
        symptoms: symptoms,
        hasImage: hasImage,
        riskLevel: riskLevel,
        riskScore: riskScore,
        recommendation: advice
    };
    
    // Display results
    displayResults(riskLevel, riskClass, advice);
}

// Display assessment results
function displayResults(riskLevel, riskClass, advice) {
    const resultBox = document.getElementById('resultBox');
    const riskText = document.getElementById('riskText');
    const adviceText = document.getElementById('adviceText');
    
    resultBox.className = `result ${riskClass}`;
    riskText.innerHTML = `<strong>Risk Level:</strong> ${riskLevel}`;
    adviceText.innerHTML = `<strong>Recommendation:</strong> ${advice}`;
    resultBox.style.display = 'block';
    
    // Scroll to results
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Save assessment to history
function saveAssessment() {
    if (!window.currentAssessment) {
        alert('No assessment data to save.');
        return;
    }
    
    const history = getAssessmentHistory();
    history.push(window.currentAssessment);
    localStorage.setItem('assessmentHistory', JSON.stringify(history));
    
    alert('Assessment saved successfully!');
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

// Get assessment history
function getAssessmentHistory() {
    const historyStr = localStorage.getItem('assessmentHistory');
    return historyStr ? JSON.parse(historyStr) : [];
}

// Navigation functions
function goToDashboard() {
    window.location.href = 'dashboard.html';
}

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