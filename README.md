# Graduation Thesis Web Application

Dưới đây là bản hướng dẫn cài đặt và chạy thử phần mềm cho Khóa luận tốt nghiệp.

## 🚀 Công nghệ sử dụng

- Back-end: ExpressJS (Node.js)
- TypeScript
- EJS View Engine
- ORM: Prisma
- Database: MySQL
- FastAPI (AI Chatbot Backend)
- OpenAI API

---

# 🛠️ Hướng dẫn cài đặt và chạy dự án

## 1. Clone project

```bash
git clone https://github.com/hiendepzainn/Camera-Alphard.git
```

---

## 2. Di chuyển vào thư mục project

```bash
cd Camera-Alphard
```

---

## 3. Cài đặt các dependencies

```bash
npm install
```

---

## 4. Tạo database trong MySQL Workbench

Mở MySQL Workbench và tạo một schema mới với tên tùy ý: <your_schema>.

> ⚠️ Hãy ghi nhớ tên schema để sử dụng trong file `.env`.

---

## 5. Cấu hình file môi trường `.env`

Đổi tên file:

```text
.env.example
```

thành:

```text
.env
```

Sau đó điền các thông tin cấu hình cần thiết bên trong file `.env`.

Ví dụ:

```env
PORT=8000
JWT_SECRET=6a8aef-04b3-42332f-beee-83b445b089591
SECURE_SECRET="NFIE84NE9EN29BF8"
TMN_CODE="7DN93EI"
DATABASE_URL="mysql://root:<your_password>@localhost:3306/<your_schema>"
```

---

## 6. Import data vào Database

Trong MySQL Workbench:

- Chọn menu:

```text
Server -> Data Import
```

- Chọn:

```text
Import from Self-Contained File
```

- Chọn file:

```text
dump-data/dump.sql
```

- Chọn schema đã tạo ở bước 4
- Nhấn:

```text
Start Import
```

---

## 7. Chạy web application

```bash
npm start
```

---

# 🤖 Chạy AI-Chatbot-Backend

## 8. Điền OpenAI API Key

Mở file:

```text
ai-chatbot-backend/key_openai.txt
```

Sau đó dán OpenAI API Key của bạn vào file.

---

## 9. Di chuyển đến thư mục AI chatbot backend

```bash
cd ai-chatbot-backend
```

---

## 10. Chạy AI chatbot backend

```bash
uvicorn main:app --reload
```

> ⚠️ Đảm bảo máy đã cài Python và thư viện `uvicorn`.

Nếu chưa cài:

```bash
pip install uvicorn fastapi
```

---

# 🌐 Truy cập ứng dụng

Sau khi chạy thành công:

Mở trình duyệt và truy cập:

```text
http://localhost:<your_port>/
```

Ví dụ:

```text
http://localhost:8000/
```

---

# ✅ Hoàn tất

Nếu mọi thứ được cấu hình chính xác, web application sẽ hoạt động thành công cùng với AI chatbot backend.

Enjoy 🎉
