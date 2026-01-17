# Hướng Dẫn Tự Động Hóa Viết Blog Với n8n

Tài liệu này hướng dẫn cách thiết lập workflow trên n8n để tự động tạo bài viết (sử dụng AI) và đẩy trực tiếp lên website của bạn thông qua việc cập nhật file `data/posts.json` trên GitHub.

## 🚀 Quy Trình Tổng Quan

1. **Trigger**: (Ví dụ: Nhận tin nhắn Zalo, Google Form, hoặc định kỳ mỗi tuần).
2. **AI Node**: Sử dụng GPT-4o hoặc Claude 3.5 để viết bài dựa trên chủ đề yêu cầu.
3. **GitHub Node (Get)**: Lấy nội dung hiện tại của file `data/posts.json`.
4. **Code Node**: Chèn bài viết mới vào mảng JSON.
5. **GitHub Node (Update)**: Commit và Push file đã cập nhật lên Repo.

## 🛠️ Yêu Cầu Cần Thiết

- **GitHub Personal Access Token**: Quyền `repo` để đọc/ghi file.
- **n8n Hosting**: Đã cài đặt trên VPS (như bạn dự định).
- **OpenAI/Anthropic API Key**: Để AI viết nội dung.

## 🧠 Chi Tiết Từng Bước

### 1. GitHub Node (Lấy file hiện tại)
- **Resource**: File
- **Operation**: Get
- **Repository Owner**: [Tên username GitHub của bạn]
- **Repository Name**: `DangTyn8n-site-main`
- **Email**: dangducty@gmail.com
- **File Path**: `data/posts.json`

### 2. Code Node (Xử lý chèn bài)
Sử dụng đoạn code sau để chèn bài viết mới:
```javascript
const existingData = JSON.parse(Buffer.from($node["GitHub"].binary.data, 'base64').toString());
const newPost = {
  "id": existingData.posts.length + 1,
  "title": $node["AI Generation"].json.title,
  "slug": $node["AI Generation"].json.slug,
  "excerpt": $node["AI Generation"].json.excerpt,
  "content": $node["AI Generation"].json.content,
  "author": "Đặng Tỵ",
  "date": new Date().toISOString().split('T')[0],
  "image": "https://source.unsplash.com/featured/?construction",
  "category": "AI Automation",
  "tags": ["Automation", "n8n", "AI"],
  "readTime": 5,
  "status": "published",
  "aiGenerated": true
};

existingData.posts.unshift(newPost); // Đưa bài mới lên đầu
return { json: { content: JSON.stringify(existingData, null, 2) } };
```

### 3. GitHub Node (Cập nhật file)
- **Resource**: File
- **Operation**: Update
- **File Path**: `data/posts.json`
- **File Content**: Content từ bước Code Node.

## 📝 Gợi Ý Nội Dung AI (Prompt)

*"Bạn là chuyên gia tư vấn tự động hóa trong ngành vật liệu xây dựng (VLXD). Hãy viết một bài blog chuyên sâu về [Chủ đề]. Sử dụng HTML cho thẻ h2, p, ul. Văn phong chuyên nghiệp, tập trung vào lợi ích kinh tế (ROI) và giải pháp n8n."*

---
> [!TIP]
> Bạn nên thiết lập n8n gửi thông báo qua Zalo sau khi hoàn tất việc đăng bài để kịp thời kiểm tra.
