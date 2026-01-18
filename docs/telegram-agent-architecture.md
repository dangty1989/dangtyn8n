# Hệ Thống Telegram Agent - Kiến Trúc Toàn Diện

## 🎯 Mục Tiêu
Xây dựng một Bot Telegram Agent trung tâm để vận hành tự động:
- **Blog** → GitHub Pages (`posts.json`)
- **Podcast** → RSS Feed + Google Drive
- **YouTube** → (Tương lai) Video upload via API
- **Fanpage** → (Tương lai) Cross-post to Facebook

---

## 🔴 VẤN ĐỀ HIỆN TẠI: FILE KHÔNG TRUYỀN SANG SUBFLOW

### Nguyên nhân gốc rễ
Trong n8n, khi sử dụng `Execute Workflow` hoặc `Tool Workflow`:
- **JSON data** (text, metadata) → ✅ Truyền được
- **Binary data** (file audio, video, ảnh) → ❌ KHÔNG tự động truyền

Khi anh gửi file audio từ Telegram, node `Listen for incoming events` nhận được:
```json
{
  "message": {
    "audio": {
      "file_id": "CQACAgUAAxkB...",
      "file_name": "podcast.m4a",
      "mime_type": "audio/mp4"
    }
  }
}
```

Nhưng khi gọi subworkflow, chỉ có JSON được truyền, còn **file binary bị mất**.

### Giải pháp: Subflow tự tải file từ Telegram

```
[Main Dispatcher]                      [Subworkflow (Blog/Podcast)]
     │                                        │
     │ Truyền: { fileId, fileName, ... }      │
     └───────────────────────────────────────>│
                                              │
                                   [Telegram: Get File]
                                              │ (Tải file từ Telegram API)
                                              ▼
                                   [Google Drive Upload / Process]
```

---

## 📐 KIẾN TRÚC MỚI

```
┌─────────────────────────────────────────────────────────────────────┐
│                        TELEGRAM BOT                                 │
│                   (Listen for incoming events)                      │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     CODE: Parse Message                             │
│  Output: { type, text, fileId, fileName, mimeType, chatId }        │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        AI AGENT                                     │
│  - Phân tích loại nội dung                                         │
│  - Chọn tool phù hợp                                                │
│  - Truyền TOÀN BỘ metadata (bao gồm fileId) cho tool               │
└─────────────────────────────────────────────────────────────────────┘
          │                    │                    │
          ▼                    ▼                    ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  Blog Publisher  │ │ Podcast Publisher│ │ Video Publisher  │
│       v2         │ │        v2        │ │       v1         │
└──────────────────┘ └──────────────────┘ └──────────────────┘
          │                    │                    │
          │                    ▼                    │
          │         ┌──────────────────┐            │
          │         │ Telegram: Get    │            │
          │         │ File (Tải file)  │            │
          │         └──────────────────┘            │
          │                    │                    │
          ▼                    ▼                    ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  GitHub: Commit  │ │ Google Drive +   │ │  YouTube API     │
│   posts.json     │ │ GitHub: RSS      │ │   Upload         │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

---

## 🔧 CÁC THAY ĐỔI CẦN THỰC HIỆN

### 1. Main Dispatcher (Telegram Agent)

**Thay đổi trong `Code: Parse Message`:**
- Giữ nguyên logic phân loại
- **THÊM**: Truyền credential name của Telegram vào output để subflow có thể dùng

**Thay đổi trong `Tool Workflow` nodes:**
- **workflowInputs**: Định nghĩa rõ ràng các field cần truyền:
  - `fileId` (string)
  - `fileName` (string)
  - `mimeType` (string)
  - `title` (string)
  - `content` (string)
  - `chatId` (number) - để gửi phản hồi

### 2. Podcast Publisher v2 (Subworkflow)

**Flow mới:**
```
[Execute Workflow Trigger]
        │
        ▼
[Telegram: Get File] ← Sử dụng fileId từ input
        │
        ▼
[Google Drive: Upload Audio]
        │
        ▼
[Google Drive: Set Public]
        │
        ▼
[Prepare Episode Metadata]
        │
        ├──────────────────────┐
        ▼                      ▼
[GitHub: Get RSS]    [GitHub: Get Episodes JSON]
        │                      │
        ▼                      ▼
[Build RSS Item]     [Merge Episodes JSON]
        │                      │
        ▼                      ▼
[GitHub: Commit RSS] [GitHub: Commit JSON]
        │                      │
        └──────────┬───────────┘
                   ▼
        [Return Success Output]
```

**Node mới cần thêm:**
```javascript
// Node: Telegram Get File
{
  "parameters": {
    "resource": "file",
    "operation": "get",
    "fileId": "={{ $json.fileId }}"
  },
  "credentials": {
    "telegramApi": {
      "id": "EW2xjt48g5VAJ0M2",
      "name": "Telegram account"
    }
  }
}
```

### 3. Blog Publisher v2 (Subworkflow)

**Flow mới (cho file .md/.txt):**
```
[Execute Workflow Trigger]
        │
        ├── Nếu có fileId ──> [Telegram: Get File] ──> [Extract Text from File]
        │
        └── Nếu chỉ có text ──> [Prepare Blog Post]
                                        │
                                        ▼
                              [GitHub: Get posts.json]
                                        │
                                        ▼
                              [Merge JSON]
                                        │
                                        ▼
                              [GitHub: Commit posts.json]
                                        │
                                        ▼
                              [Return Success Output]
```

---

## 📝 ĐỊNH NGHĨA INPUT/OUTPUT CHUẨN

### Input cho Blog Publisher v2
```typescript
interface BlogInput {
  // Nội dung bài viết (bắt buộc nếu không có file)
  title?: string;
  content?: string;
  
  // Nếu gửi file .md/.txt
  fileId?: string;
  fileName?: string;
  
  // Metadata tùy chọn
  tags?: string[];
  date?: string;
  author?: string;
  
  // Để gửi phản hồi về Telegram
  chatId?: number;
}
```

### Output từ Blog Publisher v2
```typescript
interface BlogOutput {
  success: boolean;
  type: 'blog';
  postUrl: string;
  postId: string;
  postSlug: string;
  postTitle: string;
  commitSha: string;
  commitUrl: string;
  totalPosts: number;
  message: string;
  timestamp: string;
}
```

### Input cho Podcast Publisher v2
```typescript
interface PodcastInput {
  // File audio (bắt buộc)
  fileId: string;       // Telegram file_id
  fileName: string;
  mimeType?: string;
  
  // Metadata
  title?: string;       // Lấy từ caption hoặc fileName
  description?: string;
  duration?: number;    // Phút
  tags?: string[];
  
  // Để gửi phản hồi
  chatId?: number;
}
```

### Output từ Podcast Publisher v2
```typescript
interface PodcastOutput {
  success: boolean;
  type: 'podcast';
  episodeUrl: string;
  episodeId: string;
  episodeSlug: string;
  episodeTitle: string;
  audioUrl: string;
  audioFileId: string;  // Google Drive file ID
  rssFeedUrl: string;
  rssCommitSha: string;
  jsonCommitSha: string;
  totalEpisodes: number;
  message: string;
  timestamp: string;
}
```

---

## 🚀 BƯỚC TIẾP THEO

1. [ ] Tạo workflow JSON mới cho **Podcast Publisher v2** (thêm node Telegram Get File)
2. [ ] Tạo workflow JSON mới cho **Blog Publisher v2** (hỗ trợ cả text và file)
3. [ ] Cập nhật **Main Dispatcher** với schema input rõ ràng
4. [ ] Tạo workflow cho **Video Publisher v1** (YouTube)
5. [ ] Tạo workflow cho **Image Gallery Publisher v1**
6. [ ] Test end-to-end

---

## 📁 CẤU TRÚC FILE

---

## 💡 XỬ LÝ BLOG DÀI (NOTEBOOKLM)

### Vấn đề: Giới hạn 4096 ký tự của Telegram
Khi anh copy bài rất dài từ NotebookLM (thường > 4000 ký tự) và dán trực tiếp vào Telegram:
1. Telegram sẽ tự động cắt bớt văn bản.
2. Hoặc nó sẽ gửi thành nhiều tin nhắn rời rạc, làm AI Agent bị rối.

### Giải pháp tối ưu: Gửi bài dưới dạng FILE
Thay vì dán trực tiếp, anh hãy làm theo các bước sau:
1. **Copy** nội dung từ NotebookLM.
2. **Dán** vào một file text (Notepad) hoặc Markdown editor.
3. **Lưu** file với đuôi `.md` hoặc `.txt`.
4. **Gửi file** này cho Bot Telegram.

Workflow `Blog Publisher v2` đã được tôi thiết kế để:
- Nhận file qua nhánh `IF: Has File?`.
- Tự động tải file và trích xuất toàn bộ nội dung (không bị giới hạn ký tự).
- Lấy tiêu đề từ dòng đầu tiên của file (Heading `#`).

### Giải pháp 3 (Cực kỳ thuận tiện): Gửi link Google DOCS
Đây là cách nhanh nhất trên cả Điện thoại và Máy tính:
1. **Copy** từ NotebookLM.
2. **Dán** vào một file Google Doc mới (Trên điện thoại dùng app Docs, máy tính dùng `docs.new`).
3. **Gửi link** Google Doc đó cho Bot Telegram.
Bot sẽ tự vào đọc nội dung và đăng bài.

**Kiến trúc xử lý link:**
```
### Mẹo "1 File Duy Nhất" (Không cần tạo nhiều file)
Anh không cần tạo file mới mỗi lần đâu! Hãy dùng cách này:
1. Tạo một file Google Doc đặt tên là **"Bản nháp DangTyn8n"**.
2. **Copy-Dán** nội dung từ NotebookLM vào đó.
3. Gửi link vào Telegram.
4. Ở bài blog **tiếp theo**: Anh chỉ cần **Xóa trắng** file đó đi, **Dán bài mới** vào, rồi lại gửi link đó cho Bot. 
   *(Việc này cực kỳ thuận tiện vì link file không bao giờ đổi)*.

---

## 📂 GIẢI PHÁP "XỊN" NHẤT: TỰ ĐỘNG HÓA THƯ MỤC GOOGLE DRIVE
Nếu anh không muốn mở Telegram luôn, tôi có thể cài node **Google Drive Trigger**:
1. Anh có một thư mục tên là `DangTyn8n Blogs`.
2. Trên Điện thoại/PC: Anh tạo 1 file Doc hoặc vứt file `.md` vào thư mục này.
3. **n8n tự động phát hiện**: 
   - Tự lên bài blog.
   - Tự lấy ảnh đại diện (nếu có).
   - Tự di chuyển file sang thư mục `Đã Đăng` để tránh trùng lặp.
   - Tự báo kết quả link về Telegram cho anh.

---

## 🚀 NÂNG CẤP: SMART SEO BLOG GENERATOR (DỰA TRÊN WORKFLOW MẪU)

Dựa trên workflow anh gửi, tôi sẽ nâng cấp hệ thống Agent của anh để không chỉ "đăng bài" mà còn là một **Chuyên gia SEO thực thụ**:

### 1. Quy trình SEO thông minh mới:
1. **User gửi Keyword**: Ví dụ "Phần mềm quản lý VLXD 2025".
2. **Perplexity Research**: Bot tự lên mạng tìm 10 đối thủ mạnh nhất, phân tích tại sao họ lên TOP.
3. **Phân tích Search Intent**: Hiểu khách hàng đang tìm thông tin gì (Mua hàng? Tham khảo? Hay so sánh?).
4. **Tạo Outline chuẩn Semantic SEO**: Sử dụng logic của anh (H1, H2, H3 phân cấp, Content GAP).
5. **Gửi nháp cho Anh**: Bot gửi bản Outline và Metadata (Title, Slug, Meta Desc) qua Telegram để anh duyệt.
6. **Viết & Đăng**: Sau khi anh nhấn "Duyệt", Bot sẽ tự viết nội dung chi tiết và đẩy lên GitHub.

### 2. Các công cụ (Tools) sẽ tích hợp:
- **Perplexity Sonar Pro**: Để cập nhật thông tin thị trường VLXD mới nhất.
- **Claude 3.7 Sonnet / GPT-4o**: Để viết nội dung có chiều sâu và giọng văn chuyên gia.
- **Semantic SEO Checklist**: Đảm bảo bài viết vượt qua mọi tiêu chuẩn khắt khe nhất của Google.

### ⚡ QUY TRÌNH "SUPER AGENT" TRỌN GÓI (TỪ KEYWORD ĐẾN BẢI ĐĂNG)

Dựa trên 2 workflow mẫu anh gửi, tôi sẽ tích hợp tính năng **Tạo Ảnh** và **Viết Bài Chuyên Sâu** cho DangTyn8n:

**Bước 1: Research & Outline (Logic Workflow 1)**
- Perplexity tìm TOP 10 đối thủ.
- AI Agent tạo Outline "Semantic SEO" vượt mặt đối thủ.

**Bước 2: Viết Bài & Tạo Ảnh (Logic Workflow 2)**
- **Writer Agent**: Viết 1500-2000 chữ dựa trên Outline. Giọng văn: *Chuyên gia, Tin cậy, Quyết đoán* (Phù hợp ngành VLXD).
- **Designer Agent**: Phân tích nội dung bài viết để tạo "Image Prompt".
- **Image Generator**: Tự động tạo ảnh bìa blog (DALL-E 3) mang phong cách hiện đại, chuyên nghiệp.

**Bước 3: Duyệt bài qua Telegram**
- Bot gửi cho anh: **Tiêu đề + Ảnh bìa + Link bản nháp (Google Doc)**.
- Dưới tin nhắn có 2 nút: `[✅ Đăng Ngay]` | `[🔄 Viết lại]`.

**Bước 4: Xuất bản tự động**
- Khi anh nhấn nút ✅: n8n tự động đẩy bài lên Website (GitHub) và cập nhật Metadata.

---

## 🛠️ CÁC WORKFLOW SẼ NÂNG CẤP
- `sub-blog-researcher.json`: Nghiên cứu đối thủ & Search Intent.
- `sub-blog-writer.json`: Viết bài & Tạo ảnh bìa.
- `main-bot-dispatcher-v3.json`: Điều phối và xử lý nút bấm [Duyệt].
