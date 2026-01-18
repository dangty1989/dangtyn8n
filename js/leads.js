// Lead capture handling for DangTyn8n Automation Sales Site

document.addEventListener('DOMContentLoaded', () => {
    const leadForm = document.getElementById('leadForm');

    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get form data
            const formData = {
                name: leadForm.querySelector('input[type="text"]').value,
                phone: leadForm.querySelector('input[type="tel"]').value,
                email: leadForm.querySelector('input[type="email"]').value,
                message: leadForm.querySelector('textarea').value
            };

            // Simulate API call
            console.log("Saving Lead Information:", formData);

            // Show Success Message (Vietnamese)
            const originalContent = leadForm.innerHTML;
            leadForm.innerHTML = `
                <div style="padding: 2rem; background: rgba(255,255,255,0.1); border-radius: 1rem; text-align: center;">
                    <h3 style="margin-bottom: 1rem; color: #fbbf24;">✓ Đã gửi yêu cầu thành công!</h3>
                    <p>Cảm ơn bạn ${formData.name}. Chúng tôi sẽ liên hệ tư vấn cho bạn qua số điện thoại ${formData.phone} trong vòng 24 giờ tới.</p>
                </div>
            `;

            try {
                // Placeholder URL - User needs to replace this with their actual Google Apps Script URL
                const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
                await fetch(APPS_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors', // Common for Google Apps Script
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
            } catch (err) { console.error("Lead submission failed", err); }
        });
    }
});
