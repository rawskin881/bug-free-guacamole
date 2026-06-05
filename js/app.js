// Data Store
let airdropsData = [];
let currentPage = 'dashboard';

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    loadInitialData();
    initializeCharts();
    setupAutoRefresh();
});

// Navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            switchPage(page);
        });
    });
}

function switchPage(page) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) {
            item.classList.add('active');
        }
    });
    
    // Update pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    
    const targetPage = document.getElementById(page);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = page;
        
        // Load page-specific data
        switch(page) {
            case 'projects':
                loadProjects();
                break;
            case 'finder':
                initializeFinder();
                break;
            case 'stats':
                initializeDetailedStats();
                break;
            case 'alerts':
                loadAlerts();
                break;
        }
    }
}

// Load Initial Data
function loadInitialData() {
    // Simulated data - Replace with API calls
    airdropsData = [
        {
            id: 1,
            name: "Arbitrum Nova",
            type: "Token Airdrop",
            value: "$850K",
            status: "active",
            deadline: "2024-03-15",
            chain: "Arbitrum",
            difficulty: "Easy",
            participants: 15420,
            progress: 75
        },
        {
            id: 2,
            name: "ZkSync Era",
            type: "Token Airdrop",
            value: "$1.2M",
            status: "upcoming",
            deadline: "2024-04-01",
            chain: "Ethereum",
            difficulty: "Medium",
            participants: 23450,
            progress: 45
        },
        {
            id: 3,
            name: "LayerZero",
            type: "Retroactive",
            value: "$950K",
            status: "active",
            deadline: "2024-03-20",
            chain: "Multi-chain",
            difficulty: "Hard",
            participants: 32100,
            progress: 90
        },
        {
            id: 4,
            name: "Scroll",
            type: "Testnet",
            value: "$500K",
            status: "active",
            deadline: "2024-03-30",
            chain: "Ethereum",
            difficulty: "Easy",
            participants: 8750,
            progress: 60
        }
    ];
    
    updateDashboardStats();
    loadRecentAirdrops();
}

// Update Dashboard Statistics
function updateDashboardStats() {
    document.getElementById('activeAirdrops').textContent = airdropsData.length;
    
    const totalValue = airdropsData.reduce((sum, airdrop) => {
        const value = parseFloat(airdrop.value.replace('$', '').replace('K', '').replace('M', '')) * 
                     (airdrop.value.includes('M') ? 1000000 : 1000);
        return sum + value;
    }, 0);
    
    document.getElementById('totalValue').textContent = `$${(totalValue / 1000000).toFixed(1)}M`;
    
    const totalParticipants = airdropsData.reduce((sum, airdrop) => sum + airdrop.participants, 0);
    document.getElementById('participants').textContent = totalParticipants.toLocaleString();
    
    document.getElementById('successRate').textContent = '78%';
}

// Load Recent Airdrops Table
function loadRecentAirdrops() {
    const tbody = document.getElementById('recentAirdrops');
    tbody.innerHTML = airdropsData.map(airdrop => `
        <tr>
            <td><strong>${airdrop.name}</strong></td>
            <td>${airdrop.type}</td>
            <td>${airdrop.value}</td>
            <td><span class="status-badge ${airdrop.status}">${airdrop.status}</span></td>
            <td>${airdrop.deadline}</td>
            <td><button class="btn-view" onclick="viewProject(${airdrop.id})">View</button></td>
        </tr>
    `).join('');
}

// Initialize Charts
function initializeCharts() {
    // Value Trend Chart
    const valueCtx = document.getElementById('valueChart').getContext('2d');
    new Chart(valueCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Total Value',
                data: [1.5, 1.8, 2.1, 2.4, 2.7, 3.0],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    grid: {
                        color: '#2a2a2a'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value + 'M';
                        }
                    }
                },
                x: {
                    grid: {
                        color: '#2a2a2a'
                    }
                }
            }
        }
    });
    
    // Category Chart
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: ['Token', 'NFT', 'Testnet', 'Retroactive'],
            datasets: [{
                data: [45, 15, 25, 15],
                backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#a0a0a0',
                        padding: 20
                    }
                }
            }
        }
    });
}

// Initialize Finder
function initializeFinder() {
    const finderResults = document.getElementById('finderResults');
    const sampleResults = airdropsData.map(airdrop => `
        <div class="project-card">
            <div class="project-header">
                <h3 class="project-name">${airdrop.name}</h3>
                <span class="project-type">${airdrop.type}</span>
            </div>
            <div class="project-details">
                <div class="detail-item">
                    <span class="detail-label">Chain</span>
                    <span class="detail-value">${airdrop.chain}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Difficulty</span>
                    <span class="detail-value">${airdrop.difficulty}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Value</span>
                    <span class="detail-value">${airdrop.value}</span>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${airdrop.progress}%"></div>
            </div>
            <button class="btn-view" onclick="viewProject(${airdrop.id})">View Details</button>
        </div>
    `).join('');
    
    finderResults.innerHTML = sampleResults;
}

// Find Airdrops
function findAirdrops() {
    const chain = document.getElementById('chainFilter').value;
    const type = document.getElementById('typeFilter').value;
    const difficulty = document.getElementById('difficultyFilter').value;
    
    // Simulate search with filters
    const filtered = airdropsData.filter(airdrop => {
        return (chain === 'All Chains' || airdrop.chain === chain) &&
               (type === 'All Types' || airdrop.type === type) &&
               (difficulty === 'All Difficulty' || airdrop.difficulty === difficulty);
    });
    
    displayFinderResults(filtered);
    
    // Show loading animation
    const btn = document.querySelector('.btn-find');
    btn.textContent = 'Searching...';
    setTimeout(() => {
        btn.innerHTML = '<span>🔍</span> Find Airdrops';
    }, 1000);
}

function displayFinderResults(results) {
    const finderResults = document.getElementById('finderResults');
    
    if (results.length === 0) {
        finderResults.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No airdrops found matching your criteria.</p>';
        return;
    }
    
    finderResults.innerHTML = results.map(airdrop => `
        <div class="project-card">
            <div class="project-header">
                <h3 class="project-name">${airdrop.name}</h3>
                <span class="project-type">${airdrop.type}</span>
            </div>
            <div class="project-details">
                <div class="detail-item">
                    <span class="detail-label">Chain</span>
                    <span class="detail-value">${airdrop.chain}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Difficulty</span>
                    <span class="detail-value">${airdrop.difficulty}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Value</span>
                    <span class="detail-value">${airdrop.value}</span>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${airdrop.progress}%"></div>
            </div>
            <button class="btn-view" onclick="viewProject(${airdrop.id})">View Details</button>
        </div>
    `).join('');
}

// Auto Refresh Setup
function setupAutoRefresh() {
    const autoRefreshCheckbox = document.getElementById('autoRefresh');
    
    setInterval(() => {
        if (autoRefreshCheckbox && autoRefreshCheckbox.checked) {
            refreshData();
        }
    }, 300000); // 5 minutes
}

// Refresh Data
function refreshData() {
    // Show loading state
    const refreshBtn = document.querySelector('.btn-refresh');
    if (refreshBtn) {
        refreshBtn.style.opacity = '0.7';
        refreshBtn.innerHTML = '<span>↻</span> Refreshing...';
    }
    
    // Simulate API call
    setTimeout(() => {
        loadInitialData();
        
        if (refreshBtn) {
            refreshBtn.style.opacity = '1';
            refreshBtn.innerHTML = '<span>↻</span> Refresh';
        }
        
        // Show notification
        showNotification('Data refreshed successfully!');
    }, 1500);
}

// View Project
function viewProject(id) {
    const project = airdropsData.find(a => a.id === id);
    if (project) {
        alert(`Viewing project: ${project.name}\nValue: ${project.value}\nParticipants: ${project.participants}`);
    }
}

// Load Projects Page
function loadProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = airdropsData.map(airdrop => `
        <div class="project-card">
            <div class="project-header">
                <h3 class="project-name">${airdrop.name}</h3>
                <span class="project-type">${airdrop.type}</span>
            </div>
            <div class="project-details">
                <div class="detail-item">
                    <span class="detail-label">Chain</span>
                    <span class="detail-value">${airdrop.chain}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Value</span>
                    <span class="detail-value">${airdrop.value}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Deadline</span>
                    <span class="detail-value">${airdrop.deadline}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Participants</span>
                    <span class="detail-value">${airdrop.participants.toLocaleString()}</span>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${airdrop.progress}%"></div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>${airdrop.progress}% Complete</span>
                <button class="btn-view" onclick="viewProject(${airdrop.id})">View</button>
            </div>
        </div>
    `).join('');
    
    // Add search functionality
    const searchInput = document.getElementById('projectSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            const filtered = airdropsData.filter(airdrop => 
                airdrop.name.toLowerCase().includes(query) ||
                airdrop.type.toLowerCase().includes(query)
            );
            
            projectsGrid.innerHTML = filtered.map(airdrop => `
                <div class="project-card">
                    <div class="project-header">
                        <h3 class="project-name">${airdrop.name}</h3>
                        <span class="project-type">${airdrop.type}</span>
                    </div>
                    <div class="project-details">
                        <div class="detail-item">
                            <span class="detail-label">Chain</span>
                            <span class="detail-value">${airdrop.chain}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Value</span>
                            <span class="detail-value">${airdrop.value}</span>
                        </div>
                    </div>
                    <button class="btn-view" onclick="viewProject(${airdrop.id})">View</button>
                </div>
            `).join('');
        });
    }
}

// Initialize Detailed Stats
function initializeDetailedStats() {
    // Chain Distribution Chart
    const chainCtx = document.getElementById('chainDistribution');
    if (chainCtx) {
        new Chart(chainCtx, {
            type: 'bar',
            data: {
                labels: ['Ethereum', 'Solana', 'Arbitrum', 'Polygon', 'BSC'],
                datasets: [{
                    label: 'Number of Airdrops',
                    data: [25, 15, 20, 18, 22],
                    backgroundColor: '#6366f1',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        grid: {
                            color: '#2a2a2a'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Weekly Activity Chart
    const weeklyCtx = document.getElementById('weeklyActivity');
    if (weeklyCtx) {
        new Chart(weeklyCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'New Airdrops',
                    data: [8, 12, 5, 9, 15, 7, 10],
                    borderColor: '#10b981',
                    tension: 0.4,
                    pointBackgroundColor: '#10b981'
                }, {
                    label: 'Completed',
                    data: [3, 7, 4, 8, 6, 9, 5],
                    borderColor: '#6366f1',
                    tension: 0.4,
                    pointBackgroundColor: '#6366f1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#a0a0a0'
                        }
                    }
                },
                scales: {
                    y: {
                        grid: {
                            color: '#2a2a2a'
                        }
                    },
                    x: {
                        grid: {
                            color: '#2a2a2a'
                        }
                    }
                }
            }
        });
    }
}

// Load Alerts
function loadAlerts() {
    const alertsList = document.getElementById('alertsList');
    if (!alertsList) return;
    
    const alerts = [
        {
            icon: '🔔',
            title: 'New Airdrop Detected',
            message: 'Arbitrum Odyssey Phase 2 is now live!',
            time: '5 minutes ago',
            type: 'new'
        },
        {
            icon: '⚠️',
            title: 'Deadline Approaching',
            message: 'ZkSync Era testnet ends in 24 hours',
            time: '1 hour ago',
            type: 'warning'
        },
        {
            icon: '✅',
            title: 'Airdrop Claimed',
            message: 'Successfully claimed 500 tokens from LayerZero',
            time: '3 hours ago',
            type: 'success'
        }
    ];
    
    alertsList.innerHTML = alerts.map(alert => `
        <div class="alert-item">
            <div class="alert-icon">${alert.icon}</div>
            <div class="alert-content">
                <div class="alert-title">${alert.title}</div>
                <div class="alert-message">${alert.message}</div>
                <div class="alert-time">${alert.time}</div>
            </div>
        </div>
    `).join('');
}

// Notification System
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--accent);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';
