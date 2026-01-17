// Workflow #6: Alert System + Notification Hub

const ALERT_CONDITIONS = [
    { id: 'delay', label: 'Dự án chậm tiến độ > 5%', severity: 'High' },
    { id: 'budget', label: 'Chi phí vượt budget > 10%', severity: 'Critical' },
    { id: 'profit', label: 'Lợi nhuận < 10%', severity: 'High' }
];

function checkAlerts(project) {
    const alerts = [];
    const expectedProgress = 70; // Mocked

    // 1. Dự án chậm tiến độ > 5%
    if (project.progress < expectedProgress - 5) {
        alerts.push({ type: 'delay', message: `Dự án ${project.name} chậm tiến độ (${project.progress}%)` });
    }

    // 2. Chi phí vượt budget > 10%
    if (project.actual > project.budget * 1.1) {
        alerts.push({ type: 'budget', message: `Dự án ${project.name} vượt quá 10% ngân sách!` });
    }

    // 3. Lợi nhuận < 10%
    const margin = ((project.budget - project.actual) / project.budget) * 100;
    if (margin < 10) {
        alerts.push({ type: 'profit', message: `Dự án ${project.name} lợi nhuận thấp (${margin.toFixed(1)}%)` });
    }

    return alerts;
}

function sendNotification(alert, channels = ['dashboard', 'email']) {
    console.log(`Sending Alert: [${alert.type}] ${alert.message}`);

    if (channels.includes('email')) {
        console.log("Email sent to Manager.");
    }
    if (channels.includes('sms')) {
        console.log("SMS sent via Twilio API.");
    }
    if (channels.includes('zalo')) {
        console.log("Zalo notification sent.");
    }

    // Log to DB
    logAlert(alert);
}

function logAlert(alert) {
    // In real app: append to Google Sheets 'AlertLogs'
    console.log("Alert logged to database.");
}
