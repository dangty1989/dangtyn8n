# Hướng Dẫn Đưa Website Lên GitHub Pages 🚀

GitHub Pages là cách nhanh nhất và miễn phí để chạy website của bạn. Dưới đây là các bước để đưa code hiện tại lên:

## Bước 0: Dọn dẹp Code cũ trên GitHub (Nếu cần)
Nếu Repo của anh đang có code cũ và anh muốn "làm mới" hoàn toàn:
1. Truy cập vào Repo đó trên GitHub.
2. Nhấn vào nút **Settings** (của Repo đó).
3. Cuộn xuống dưới cùng tìm mục **Danger Zone**.
4. Anh có thể chọn **Delete this repository** để xóa hẳn đi rồi tạo lại cái mới (Sạch nhất).
5. *Hoặc*: Nếu muốn giữ Repo, anh có thể vào tab **Code**, nhấn chọn từng file/thư mục cũ rồi chọn **Delete** (nhưng cách này hơi mất thời gian nếu có nhiều file).
> [!TIP]
> **Gợi ý khi điền thông tin (như trong ảnh anh gửi):**
> - **Repository name**: `dangtyn8n` (như anh đã đặt là rất ổn).
> - **Description**: *"Website bán hàng & Hệ thống Automation cho ngành xây dựng (VLXD) - DangTyn8n"*
> - **Public/Private**: Chọn **Public** (Để dùng được GitHub Pages miễn phí).
> - **Add README**: Gạt sang **Off** (vì anh sẽ kéo code từ máy lên nên không cần tạo file trống).
> - **Create repository**: Nhấn nút này để bắt đầu.

## Bước 1: Tạo Repository trên GitHub (Hoặc dùng Repo cũ đã dọn dẹp)
1. Truy cập [github.com](https://github.com) và đăng nhập.
2. Nhấn nút **New** (nút dấu cộng) để tạo Repo mới.
3. Đặt tên Repo: `dangtyn8n-site` (hoặc tên tùy ý).
4. Chọn **Public**.
5. Nhấn **Create repository**.

## Bước 2: Tải code lên (Cách đơn giản nhất qua Web)
Nếu bạn không rành về dòng lệnh (Git Bash):
1. Trong trang Repo mới tạo, nhấn vào dòng link màu xanh: **"uploading an existing file"**.
2. **QUAN TRỌNG**: Anh hãy vào hẳn bên trong thư mục `dangtyn8n-site-main` trên máy tính, nhấn `Ctrl + A` để chọn **tất cả file và thư mục con bên trong**, sau đó mới kéo chúng vào trình duyệt.
   > [!CAUTION]
   > KHÔNG kéo cả cái thư mục cha vào, nếu không website sẽ không chạy được vì file `index.html` bị chui vào quá sâu.
3. Nhấn **Commit changes**.

## Bước 3: Kích hoạt GitHub Pages
1. Vào tab **Settings** của Repo.
2. Menu bên trái chọn **Pages**.
3. Tại mục **Build and deployment** -> **Branch**, chọn `main` và nhấn **Save**.
4. Chờ khoảng 1-2 phút, bạn sẽ thấy link: `https://[username].github.io/dangtyn8n-site/`.

## Bước 4: Cấu hình Tên miền riêng (Custom Domain)
Vì bạn đã có file `CNAME`, GitHub sẽ tự nhận diện tên miền `dangtyn8n.io.vn`.
1. Trong tab **Pages** (bước 3), cuộn xuống mục **Custom domain**.
2. Điền `dangtyn8n.io.vn` và nhấn **Save**.
3. Đảm bảo bạn đã trỏ bản ghi DNS (A record hoặc CNAME) từ nhà cung cấp tên miền về GitHub.

---
> [!TIP]
> Sau khi đưa lên, n8n của bạn sẽ có thể kết nối trực tiếp với file `posts.json` trên GitHub để tự động đăng bài!
