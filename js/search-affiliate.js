document.addEventListener('DOMContentLoaded', function() {
  console.log("search-affiliate.js loaded");

  const affiliateList = document.getElementById('affiliateList');
  if (!affiliateList) {
    console.error("Không tìm thấy #affiliateList");
    return;
  }

  // Dữ liệu affiliate mẫu
  const affiliateData = [
    { name: "n8n VPS Self-Hosted", price: "199k/tháng", platform: "VPS", url: "https://n8n.dangtyn8n.io.vn", commission: "20%" },
    { name: "OpenRouter API", price: "Free tier", platform: "OpenRouter", url: "https://openrouter.ai", commission: "15%" },
    { name: "Make.com Pro", price: "9$/tháng", platform: "Make", url: "https://make.com", commission: "25%" },
    { name: "Claude Pro", price: "20$/tháng", platform: "Anthropic", url: "https://claude.ai", commission: "10%" }
  ];

  // Render danh sách
  function renderAffiliates(data) {
    const searchBox = `
      <div style="margin-bottom: 1.5rem;">
        <input type="text" id="affSearch" placeholder="🔍 Tìm Shopee/n8n/OpenRouter..." 
               style="padding: 12px; width: 100%; max-width: 400px; border-radius: 8px; border: 1px solid var(--accent); background: rgba(0,0,0,0.3); color: var(--text-primary); font-size: 1rem;">
      </div>
    `;

    const cards = data.map(item => `
      <div class="product-card">
        <div class="product-header">
          <div class="product-title">
            <h3>${item.name}</h3>
            <div class="product-category-tag">${item.platform}</div>
          </div>
        </div>
        <p class="product-description">Giá: ${item.price} | Hoa hồng: ${item.commission}</p>
        <a href="${item.url}" target="_blank" class="affiliate-link">Xem chi tiết →</a>
      </div>
    `).join('');

    affiliateList.innerHTML = searchBox + `<div class="grid" id="affResults">${cards}</div>`;

    // Gắn sự kiện tìm kiếm
    const searchInput = document.getElementById('affSearch');
    if (searchInput) {
      searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        const filtered = affiliateData.filter(item => 
          item.name.toLowerCase().includes(query) ||
          item.platform.toLowerCase().includes(query)
        );
        
        const resultsDiv = document.getElementById('affResults');
        if (filtered.length === 0) {
          resultsDiv.innerHTML = '<p style="color: var(--text-secondary);">Không tìm thấy sản phẩm phù hợp.</p>';
        } else {
          resultsDiv.innerHTML = filtered.map(item => `
            <div class="product-card">
              <div class="product-header">
                <div class="product-title">
                  <h3>${item.name}</h3>
                  <div class="product-category-tag">${item.platform}</div>
                </div>
              </div>
              <p class="product-description">Giá: ${item.price} | Hoa hồng: ${item.commission}</p>
              <a href="${item.url}" target="_blank" class="affiliate-link">Xem chi tiết →</a>
            </div>
          `).join('');
        }
      });
    }
  }

  // Gọi render
  renderAffiliates(affiliateData);
});
