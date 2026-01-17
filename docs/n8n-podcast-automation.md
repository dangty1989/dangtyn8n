# Tự Động Hóa Podcast RSS Với n8n

Chào bạn kiến trúc sư automation! Để duy trì Podcast trên Spotify và YouTube mà không cần sửa code XML thủ công, bạn hãy thiết lập workflow n8n như sau:

## 🚀 Workflow: 1-Click Podcast Publishing

### 1. Trigger
- **Google Drive Node**: Lắng nghe (Watch) một thư mục cụ thể trên Drive của bạn.
- **Event**: Khi có file mới được tải lên (file `.mp3` hoặc `.mp4`).

### 2. AI Automation (Tùy chọn nhưng nên làm)
- **OpenAI Node**: Sử dụng mô hình `whisper-1` để transcribe (chuyển âm thanh thành văn bản).
- **AI Agent Node**: Tóm tắt đoạn văn bản đó thành:
    - Tiêu đề tập phim (Title)
    - Mô tả tóm tắt (Summary) cho Spotify.
    - Show notes chi tiết.

### 3. Cập nhật file XML (Quan trọng nhất)
- **GitHub Node (Get Content)**: Lấy nội dung hiện tại của `rss/podcast.xml`.
- **Code Node**: Chèn một thẻ `<item>` mới vào ngay sau thẻ `<channel>`.
    
Sử dụng logic JavaScript tương tự bài Blog:
```javascript
let xml = $node["GitHub"].json.content;
let newItem = `
    <item>
      <title>${$node["Review"].json.title}</title>
      <link>https://DangTyn8n.io.vn/podcast/${$node["Review"].json.slug}</link>
      <guid>${Date.now()}</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <description><![CDATA[${$node["Review"].json.description}]]></description>
      <enclosure url="${$node["GDrive"].json.webContentLink}" length="${$node["GDrive"].json.size}" type="audio/mpeg"/>
      <itunes:email>dangducty@gmail.com</itunes:email>
      <itunes:duration>${$node["Metadata"].json.duration}</itunes:duration>
    </item>
`;
// Insert newItem after <channel>
return xml.replace('<channel>', '<channel>' + newItem);
```

### 4. GitHub Node (Push)
- Đẩy nội dung đã cập nhật ngược lại file `rss/podcast.xml`.

## 💡 Lưu ý cho Spotify & YouTube
- **Spotify**: Ưu tiên ảnh Cover (Artwork) phải là hình vuông, kích thước 1400x1400px trở lên. Link ảnh trong thẻ `<itunes:image>` phải luôn hoạt động.
- **YouTube**: Nếu bạn muốn YouTube Podcast lấy nguồn từ RSS này, hãy đảm bảo link trong thẻ `<enclosure>` là link trực tiếp đến file (Direct Download Link).

---
> [!NOTE]
> Link của bạn bây giờ là: `https://[domain-cua-ban]/rss/podcast.xml`. Bạn hãy dùng link này dán vào **Spotify for Podcasters** và **YouTube Studio** là xong!
