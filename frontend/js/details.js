
// ================= IMAGE PREVIEW =================

document.addEventListener('DOMContentLoaded', function () {
    const imageUpload = document.getElementById('imageUpload');
    const preview = document.getElementById('preview');

    if (imageUpload) {
        imageUpload.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Form submit
    const assessmentForm = document.getElementById('assessmentForm');
    if (assessmentForm) {
        assessmentForm.addEventListener('submit', function (e) {
            e.preventDefault();
            analyzeRisk();
        });
    }
});


// ================= MAIN FUNCTION =================
async function analyzeRisk() {
    try {
        // Get values
        const age = document.getElementById('age').value;
        const gender = document.getElementById('gender').value;
        const conditions = document.getElementById('conditions').value;
        const symptoms = document.getElementById('symptoms').value;

        // ✅ STORE FOR CHAT PAGE
        localStorage.setItem("healthData", JSON.stringify({
            age,
            gender,
            conditions,
            symptoms
        }));

        // Create FormData
        const formData = new FormData();
        formData.append("age", age);
        formData.append("gender", gender);
        formData.append("conditions", conditions);
        formData.append("symptoms", symptoms);

        const imageFile = document.getElementById('imageUpload').files[0];
        if (imageFile) {
            formData.append("image", imageFile);
        }

        // 🔥 CALL BACKEND API
        const res = await fetch("http://localhost:5000/api/triage", {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        console.log("API Response:", data);

        // Store assessment history
        window.currentAssessment = {
            date: new Date().toISOString(),
            age,
            gender,
            conditions,
            symptoms,
            riskLevel: data.riskLevel,
            recommendation: data.advice || data.summary
        };

        // Display results
        displayResults(
            data.riskLevel,
            data.riskLevel.toLowerCase(),
            data.riskLevel === "HIGH"
                ? `⚠️ Consult: ${data.department} (${data.urgency})`
                : data.advice
        );

    } catch (error) {
        console.error("API failed, using fallback logic", error);

        fallbackRiskAnalysis();
    }
}


// ================= FALLBACK LOGIC =================
function fallbackRiskAnalysis() {
    const age = parseInt(document.getElementById('age').value);
    const symptoms = document.getElementById('symptoms').value.toLowerCase();
    const imageUpload = document.getElementById('imageUpload');
    const hasImage = imageUpload.files.length > 0;

    let riskScore = 0;

    const highRiskKeywords = ['bleeding', 'severe', 'intense pain', 'fever', 'swelling', 'pus', 'rapid growth'];
    const moderateRiskKeywords = ['rash', 'itching', 'discomfort', 'mild pain', 'redness', 'irritation'];

    highRiskKeywords.forEach(k => {
        if (symptoms.includes(k)) riskScore += 3;
    });

    moderateRiskKeywords.forEach(k => {
        if (symptoms.includes(k)) riskScore += 1;
    });

    if (age < 5 || age > 65) riskScore += 1;

    let riskLevel, advice, riskClass;

    if (riskScore >= 5) {
        riskLevel = 'HIGH';
        riskClass = 'high';
        advice = 'Immediate medical attention recommended.';
    } else if (riskScore >= 2) {
        riskLevel = 'MEDIUM';
        riskClass = 'moderate';
        advice = 'Consult a doctor soon.';
    } else {
        riskLevel = 'LOW';
        riskClass = 'low';
        advice = 'Monitor symptoms.';
    }

    // ✅ ALSO STORE FOR CHAT PAGE (fallback case)
    localStorage.setItem("healthData", JSON.stringify({
        age,
        symptoms
    }));

    window.currentAssessment = {
        date: new Date().toISOString(),
        age,
        symptoms,
        hasImage,
        riskLevel,
        recommendation: advice
    };

    displayResults(riskLevel, riskClass, advice);
}


// ================= DISPLAY =================
function displayResults(riskLevel, riskClass, advice) {
    const resultBox = document.getElementById('resultBox');
    const riskText = document.getElementById('riskText');
    const adviceText = document.getElementById('adviceText');

    resultBox.className = `result ${riskClass}`;

    riskText.innerHTML = `<strong>Risk Level:</strong> ${riskLevel}`;
    adviceText.innerHTML = `<strong>Recommendation:</strong> ${advice}`;

    resultBox.style.display = 'block';

    resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
}


// ================= SAVE =================
function saveAssessment() {
    if (!window.currentAssessment) {
        alert('No data to save');
        return;
    }

    const history = JSON.parse(localStorage.getItem('assessmentHistory')) || [];
    history.push(window.currentAssessment);

    localStorage.setItem('assessmentHistory', JSON.stringify(history));

    alert('Saved successfully!');
}


// ================= NAV =================
function goToDashboard() {
    window.location.href = 'dashboard.html';
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

// ✅ OPEN CHAT BUTTON FUNCTION (USE LATER)
function openChat() {
    window.location.href = 'chat.html';
}
