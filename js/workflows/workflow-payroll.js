// Workflow #3: Tự Động Tính Lương + Phụ Cấp Công Nhân

const WORKERS = [
    { id: 1, name: "Nguyễn Văn A", level: 5, baseSalary: 500000 },
    { id: 2, name: "Trần Thị B", level: 3, baseSalary: 350000 }
];

function calculateSalary(workerId, daysWorked, isDangerous, extraBonusPercent = 0) {
    const worker = WORKERS.find(w => w.id === workerId);
    if (!worker) return 0;

    // 1. Get: Lương cơ bản from level
    let dailyWage = worker.baseSalary;

    // 2. Calc: Lương = (Ngày công × Lương/ngày)
    let totalSalary = daysWorked * dailyWage;

    // 3. Check: IF công_nguy_hiểm THEN add 20% phụ cấp
    if (isDangerous) {
        totalSalary *= 1.2;
    }

    // 4. Check: IF vượt_quota THEN add bonus
    if (extraBonusPercent > 0) {
        totalSalary += totalSalary * (extraBonusPercent / 100);
    }

    // 5. Store: Database (simulate)
    console.log(`Salary calculated for ${worker.name}: ${totalSalary} VNĐ`);

    return totalSalary;
}

function generatePaySheet(workerData) {
    // Logic to generate data for PDF payslips
    return workerData.map(w => ({
        name: w.name,
        total: calculateSalary(w.id, w.days, w.isDangerous, w.bonus)
    }));
}
