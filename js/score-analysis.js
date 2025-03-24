// Initialize Chart.js
let scoreChart;

// Get stored scores from localStorage
function getStoredScores() {
    return JSON.parse(localStorage.getItem('drivingScores') || '[]');
}

// Filter scores by date range
function filterScoresByDays(scores, days) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return scores.filter(score => new Date(score.timestamp) > cutoffDate);
}

// Get scores for a specific parameter
function getParameterScores(scores, parameter) {
    return scores.map(score => ({
        date: new Date(score.timestamp),
        score: parameter === 'overall' ? score.overall : score.parameters[parameter]
    }));
}

// Format date for display
function formatDate(date) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Initialize the chart
function initChart() {
    const ctx = document.getElementById('scoreChart').getContext('2d');
    
    scoreChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Score',
                data: [],
                borderColor: '#FF4500',
                backgroundColor: 'rgba(255, 69, 0, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#FF4500'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleColor: '#fff',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    displayColors: false
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Update chart with stored data
function updateChart(parameter, days) {
    const allScores = getStoredScores();
    const filteredScores = filterScoresByDays(allScores, days);
    const parameterScores = getParameterScores(filteredScores, parameter);
    
    // Sort scores by date
    parameterScores.sort((a, b) => a.date - b.date);
    
    const labels = parameterScores.map(item => formatDate(item.date));
    const scores = parameterScores.map(item => item.score);
    
    scoreChart.data.labels = labels;
    scoreChart.data.datasets[0].data = scores;
    scoreChart.update();
    
    // Update statistics
    updateStatistics(scores, parameterScores);
}

// Update statistics cards
function updateStatistics(scores, parameterScores) {
    if (scores.length === 0) {
        document.getElementById('averageScore').textContent = 'N/A';
        document.getElementById('trendText').textContent = 'No Data';
        document.getElementById('latestScore').textContent = 'N/A';
        return;
    }

    // Calculate average
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    document.getElementById('averageScore').textContent = Math.round(average);
    
    // Calculate trend
    const firstScore = scores[0];
    const lastScore = scores[scores.length - 1];
    const trend = lastScore - firstScore;
    
    const trendElement = document.getElementById('trendText');
    if (trend > 0) {
        trendElement.textContent = 'Improving';
        trendElement.className = 'text-2xl font-bold text-green-600';
    } else if (trend < 0) {
        trendElement.textContent = 'Declining';
        trendElement.className = 'text-2xl font-bold text-red-600';
    } else {
        trendElement.textContent = 'Stable';
        trendElement.className = 'text-2xl font-bold text-blue-600';
    }
    
    // Update latest score
    document.getElementById('latestScore').textContent = Math.round(lastScore);

    // Update insights based on real data
    updateInsights(scores, parameterScores);
}

// Update insights based on actual data
function updateInsights(scores, parameterScores) {
    const insightsList = document.getElementById('insightsList');
    const recommendationsList = document.getElementById('recommendationsList');
    
    // Clear existing insights
    insightsList.innerHTML = '';
    recommendationsList.innerHTML = '';
    
    // Calculate insights
    const lastScore = scores[scores.length - 1];
    const scoreChange = ((lastScore - scores[0]) / scores[0] * 100).toFixed(1);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    
    // Add insights
    addInsight(insightsList, 
        scoreChange > 0 
            ? `Your driving score has improved by ${scoreChange}% over this period`
            : `Your driving score has decreased by ${Math.abs(scoreChange)}% over this period`,
        scoreChange > 0 ? 'green' : 'yellow'
    );
    
    addInsight(insightsList,
        `Your average score is ${avgScore}`,
        avgScore >= 75 ? 'green' : avgScore >= 50 ? 'blue' : 'yellow'
    );
    
    // Add recommendations based on score
    if (avgScore < 50) {
        addRecommendation(recommendationsList,
            'Consider taking a defensive driving course to improve your overall performance',
            'indigo'
        );
    }
    
    if (lastScore < scores[scores.length - 2]) {
        addRecommendation(recommendationsList,
            'Review your recent driving patterns to identify areas for improvement',
            'purple'
        );
    }
    
    addRecommendation(recommendationsList,
        'Schedule regular vehicle maintenance checks to maintain safety standards',
        'pink'
    );
}

// Helper function to add an insight
function addInsight(container, text, color) {
    container.innerHTML += `
        <li class="flex items-start">
            <span class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-${color}-100 text-${color}-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            </span>
            <span class="ml-3">${text}</span>
        </li>
    `;
}

// Helper function to add a recommendation
function addRecommendation(container, text, color) {
    container.innerHTML += `
        <li class="flex items-start">
            <span class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-${color}-100 text-${color}-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            </span>
            <span class="ml-3">${text}</span>
        </li>
    `;
}

// Handle parameter change
function handleParameterChange() {
    const parameter = document.getElementById('parameterSelect').value;
    const days = parseInt(document.getElementById('timeRangeSelect').value);
    updateChart(parameter, days);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initChart();
    
    // Set up event listeners
    document.getElementById('parameterSelect').addEventListener('change', handleParameterChange);
    document.getElementById('timeRangeSelect').addEventListener('change', handleParameterChange);
    
    // Handle download button click
    document.getElementById('downloadBtn').addEventListener('click', () => {
        const canvas = document.getElementById('scoreChart');
        const link = document.createElement('a');
        link.download = 'score-analysis.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
    
    // Initial chart update
    handleParameterChange();
});
