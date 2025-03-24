// Weights for each parameter
const SCORE_WEIGHTS = {
    laneDiscipline: 0.20,      // 20%
    speedCompliance: 0.20,     // 20%
    penaltyHistory: 0.15,      // 15%
    complianceRecord: 0.15,    // 15%
    incidentHistory: 0.20,     // 20%
    vehicleMaintenance: 0.10   // 10%
};

// Function to validate input score (0-100)
function validateScore(score) {
    return score >= 0 && score <= 100;
}

// Function to update needle position
function updateNeedle(score) {
    const needle = document.querySelector('.needle');
    const rotation = -90 + (score * 180 / 100);
    needle.style.transform = `rotate(${rotation}deg)`;
}

// Function to calculate the driving score
function calculateDrivingScore() {
    // Get all input values
    const scores = {
        laneDiscipline: parseFloat(document.getElementById('laneDiscipline').value),
        speedCompliance: parseFloat(document.getElementById('speedCompliance').value),
        penaltyHistory: parseFloat(document.getElementById('penaltyHistory').value),
        complianceRecord: parseFloat(document.getElementById('complianceRecord').value),
        incidentHistory: parseFloat(document.getElementById('incidentHistory').value),
        vehicleMaintenance: parseFloat(document.getElementById('vehicleMaintenance').value)
    };

    // Validate all inputs
    let errorMessage = '';
    for (const [parameter, score] of Object.entries(scores)) {
        if (isNaN(score) || !validateScore(score)) {
            errorMessage += `${parameter.replace(/([A-Z])/g, ' $1').trim()}: Please enter a valid score (0-100)\n`;
        }
    }

    // If there are validation errors, show them and return
    if (errorMessage) {
        alert(errorMessage);
        return;
    }

    // Calculate final score (weighted average)
    const weights = {
        laneDiscipline: 0.2,
        speedCompliance: 0.2,
        penaltyHistory: 0.15,
        complianceRecord: 0.15,
        incidentHistory: 0.15,
        vehicleMaintenance: 0.15
    };

    let finalScore = 0;
    for (const [key, value] of Object.entries(scores)) {
        finalScore += value * weights[key];
    }
    finalScore = Math.round(finalScore);

    // Store the score data
    const scoreData = {
        timestamp: new Date().toISOString(),
        overall: finalScore,
        parameters: scores
    };

    // Get existing scores from localStorage
    let storedScores = JSON.parse(localStorage.getItem('drivingScores') || '[]');
    
    // Add new score
    storedScores.push(scoreData);
    
    // Keep only last 180 days of scores
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 180);
    storedScores = storedScores.filter(score => new Date(score.timestamp) > cutoffDate);
    
    // Save back to localStorage
    localStorage.setItem('drivingScores', JSON.stringify(storedScores));

    // Update the display
    const scoreDisplay = document.getElementById('finalScore');
    const scoreValue = document.getElementById('scoreValue');
    const scoreMessage = document.getElementById('scoreMessage');
    
    // Update score value and needle position
    scoreValue.textContent = finalScore;
    updateNeedle(finalScore);
    
    // Determine score category and message
    let message = '';
    if (finalScore >= 75) {
        message = 'Excellent! You are a top-tier driver with outstanding performance across all parameters.';
        scoreMessage.className = 'text-green-600 text-lg';
    } else if (finalScore >= 50) {
        message = 'Good! You demonstrate solid driving skills with room for improvement in some areas.';
        scoreMessage.className = 'text-blue-600 text-lg';
    } else if (finalScore >= 25) {
        message = 'Average. Consider focusing on improving your driving habits and safety practices.';
        scoreMessage.className = 'text-orange-600 text-lg';
    } else {
        message = 'Needs significant improvement. Please prioritize safe driving practices and consider additional training.';
        scoreMessage.className = 'text-red-600 text-lg';
    }
    
    scoreMessage.textContent = message;
    scoreDisplay.classList.remove('hidden');
}

// Function to reset all form fields
function resetForm() {
    document.getElementById('scoringForm').reset();
    updateNeedle(0); // Reset needle to 0
    document.getElementById('finalScore').classList.add('hidden');
}

// Add event listeners when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add input validation for all score inputs
    const scoreInputs = document.querySelectorAll('input[type="number"]');
    scoreInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value > 100) this.value = 100;
            if (this.value < 0) this.value = 0;
        });
    });
    
    // Add calculate button listener
    document.getElementById('calculateButton').addEventListener('click', calculateDrivingScore);
    
    // Add reset button listener
    document.getElementById('resetButton').addEventListener('click', resetForm);
});
