// Workflow #2: Quản Lý Khối Lượng Công Việc Tự Động

const DINH_MUC = {
    'tuong': { unit: 'm2', workerPerUnit: 0.5, daysPerUnit: 0.1 },
    'san': { unit: 'm3', workerPerUnit: 2, daysPerUnit: 0.2 },
    'son': { unit: 'm2', workerPerUnit: 0.2, daysPerUnit: 0.05 }
};

function calculateRequirements(workType, volume) {
    const dinhMuc = DINH_MUC[workType];
    if (!dinhMuc) return null;

    // 1. Calculate: Khối lượng from input (already volume)
    // 2. Assign: Công nhân cần = Khối lượng / Định mức ngày (simplified)
    const workersNeeded = Math.ceil(volume * dinhMuc.workerPerUnit);

    // 3. Calc: Thời gian = Công nhân cần / (Số công nhân available)
    // Assuming 5 workers available for this example
    const availableWorkers = 5;
    const timeEstimated = (volume * dinhMuc.daysPerUnit) / availableWorkers;

    return {
        unit: dinhMuc.unit,
        workersNeeded,
        timeEstimated: timeEstimated.toFixed(1)
    };
}

// Logic for manual input processing
function processManualInput(data) {
    // This would be called by the form submit
    const results = calculateRequirements(data.workType, data.volume);
    console.log("Calculated Requirements:", results);
    return results;
}
