// Workflow #4: Tự Động Tạo Hóa Đơn, Biên Bản, Báo Cáo

function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function generateInvoiceData(project, items) {
    // 1. Gather: Project info + Items
    const total = items.reduce((acc, item) => acc + (item.volume * item.price), 0);

    // 2. Populate data for template
    const invoiceData = {
        invoiceNo: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        date: new Date().toLocaleDateString('vi-VN'),
        projectName: project.name,
        clientName: project.client,
        items: items.map(item => ({
            ...item,
            total: formatVND(item.volume * item.price)
        })),
        totalFormatted: formatVND(total)
    };

    console.log("Invoice Data Generated:", invoiceData);
    return invoiceData;
}

// In a real browser environment, this would use Puppeteer/wkhtmltopdf via API
// For now, we simulate the output
function exportToPDF(data, type) {
    console.log(`Exporting ${type} to PDF...`);
    return `PDF_BLOB_FOR_${type}`;
}
