// Workflow #5: Financial Dashboard + Lợi Nhuận Dự Án

function calculateProjectFinance(project) {
    // 1. Revenue = Khối x Giá (from contract)
    const revenue = project.budget; // Simplified for demo

    // 2. Cost_labor = Tổng lương (from Workflow #3)
    const costLabor = project.actual * 0.4; // Simplified: 40% of actual cost

    // 3. Cost_material = From actual records
    const costMaterial = project.actual * 0.5; // Simplified: 50% of actual cost

    // 4. Cost_equipment & Other
    const costOthers = project.actual * 0.1;

    // 5. Total_Cost
    const totalCost = costLabor + costMaterial + costOthers;

    // 6. Profit_Margin = (Revenue - Total_Cost) / Revenue * 100
    const profitAmount = revenue - totalCost;
    const profitMargin = (profitAmount / revenue) * 100;

    // 7. Status calculation
    let status = "RISK";
    if (profitMargin > 20) status = "GOOD";
    else if (profitMargin > 10) status = "OK";

    return {
        revenue,
        totalCost,
        profitAmount,
        profitMargin: profitMargin.toFixed(1),
        status
    };
}

function getCompanyFinancials(allProjects) {
    const summary = allProjects.reduce((acc, p) => {
        const fin = calculateProjectFinance(p);
        acc.totalRevenue += fin.revenue;
        acc.totalCost += fin.totalCost;
        acc.totalProfit += fin.profitAmount;
        return acc;
    }, { totalRevenue: 0, totalCost: 0, totalProfit: 0 });

    summary.avgMargin = ((summary.totalProfit / summary.totalRevenue) * 100).toFixed(1);
    return summary;
}
