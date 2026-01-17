// Mock data for initial rendering
const projects = [
    {
        id: 1,
        name: "Nhà mẫu Sunrise City",
        client: "Novaland Group",
        status: "on-track",
        progress: 65,
        budget: 4200000000,
        actual: 2800000000,
        daysLeft: 45,
        workers: 24,
        updatedAt: "2 giờ trước"
    },
    {
        id: 2,
        name: "Căn hộ Vinhomes Grand Park",
        client: "Vingroup",
        status: "warning",
        progress: 40,
        budget: 12000000000,
        actual: 6500000000,
        daysLeft: 120,
        workers: 56,
        updatedAt: "5 giờ trước"
    },
    {
        id: 3,
        name: "Nhà phố Khang Điền",
        client: "Khang Điền",
        status: "danger",
        progress: 85,
        budget: 2500000000,
        actual: 2900000000,
        daysLeft: 5,
        workers: 12,
        updatedAt: "10 phút trước"
    },
    {
        id: 4,
        name: "Villa Ocean Park",
        client: "Chị Lan",
        status: "on-track",
        progress: 20,
        budget: 5800000000,
        actual: 1200000000,
        daysLeft: 180,
        workers: 18,
        updatedAt: "Hôm qua"
    }
];

function formatCurrency(amount) {
    if (amount >= 1000000000) {
        return (amount / 1000000000).toFixed(1) + "B ₫";
    }
    return (amount / 1000000).toFixed(1) + "M ₫";
}

// Workflow #1: Project Dashboard Real-Time Logic

function calculateProjectStatus(project) {
    // 1. Calculate: % tiến độ (already in mock data, but we can recalculate from tasks if needed)

    // 2. Calculate: Days remaining
    // In real app, this would use (project.endDate - today)

    // 3. Calculate: Budget vs Actual
    const budgetVariance = project.budget - project.actual;
    const budgetUsagePercent = (project.actual / project.budget) * 100;

    // 4. Check: IF (% tiến độ < Dự kiến - 5%) THEN Flag "CHẬM TIẾN ĐỘ"
    // Mocking "expected progress" for demonstration
    const expectedProgress = 70; // This would be calculated based on time elapsed
    let status = 'on-track';

    if (project.progress < expectedProgress - 5) {
        status = 'warning';
    }

    // 5. Check: IF (Chi phí thực tế > Budget * 1.1) THEN Flag "VƯỢT BUDGET"
    if (budgetUsagePercent > 110) {
        status = 'danger';
    }

    return status;
}

function updateSummaryStats() {
    const totalProjects = projects.length;
    const avgProgress = projects.reduce((acc, p) => acc + p.progress, 0) / totalProjects;
    const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
    const totalActual = projects.reduce((acc, p) => acc + p.actual, 0);

    document.getElementById('totalProjects').textContent = totalProjects;
    document.getElementById('avgProgress').textContent = Math.round(avgProgress) + '%';
    document.getElementById('totalBudget').textContent = formatCurrency(totalBudget).replace(' ₫', '');
    document.getElementById('actualCost').textContent = formatCurrency(totalActual).replace(' ₫', '');
}

function renderProjects() {
    const grid = document.getElementById('projectGrid');
    grid.innerHTML = projects.map(p => {
        const status = calculateProjectStatus(p);
        const statusText = status === 'on-track' ? 'On Track' : status === 'warning' ? 'Chậm tiến độ' : 'Vượt Budget';

        return `
            <div class="project-card animate-fade-in">
                <div class="project-header">
                    <div class="project-title">
                        <h3>${p.name}</h3>
                        <div class="project-client">${p.client}</div>
                    </div>
                    <span class="status-badge status-${status}">
                        ${statusText}
                    </span>
                </div>
                <div class="project-body">
                    <div class="progress-container">
                        <div class="progress-label">
                            <span>Tiến độ tổng thể</span>
                            <span>${p.progress}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${p.progress}%"></div>
                        </div>
                    </div>
                    <div class="project-metrics">
                        <div class="metric">
                            <span class="metric-label">Ngân sách</span>
                            <span class="metric-value">${formatCurrency(p.budget)}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Thực tế</span>
                            <span class="metric-value">${formatCurrency(p.actual)}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Ngày còn lại</span>
                            <span class="metric-value">${p.daysLeft} ngày</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Nhân sự</span>
                            <span class="metric-value">${p.workers}</span>
                        </div>
                    </div>
                </div>
                <div class="project-footer">
                    <span class="text-muted" style="font-size: 0.875rem">Cập nhật: ${p.updatedAt}</span>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <span class="status-badge" style="background: rgba(30, 41, 59, 0.5); font-size: 0.65rem">
                            Margin: 24%
                        </span>
                        <a href="#" class="btn" style="padding: 0.5rem; color: var(--primary)">Chi tiết →</a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    updateSummaryStats();
    renderProjects();

    // Auto-refresh simulation (Workflow #1 requirement)
    setInterval(() => {
        console.log("Refreshing dashboard data...");
        // In real app: await fetchLatestData();
        updateSummaryStats();
        renderProjects();
    }, 300000); // Every 5 minutes
});
