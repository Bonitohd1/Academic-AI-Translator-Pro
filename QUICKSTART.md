# 🎓 Academic Research Translator

Công cụ dịch tài liệu học thuật với AI, bao gồm Q&A và tóm tắt chuyên nghiệp.

## 🚀 Bắt Đầu Nhanh

### 1. **Lấy API Key**
- Truy cập [Google AI Studio](https://aistudio.google.com/app/apikey)
- Tạo/sao chép API Key mới

### 2. **Cấu Hình API**
Tạo file `.env.local`:
```
VITE_GEMINI_API_KEY="your-api-key-here"
```

### 3. **Cài Đặt & Chạy**
```bash
npm install
npm run dev
```

Mở http://localhost:3000

---

## ✨ Tính Năng

### 📄 **Dịch Tài Liệu**
- Upload PDF hoặc dán văn bản
- Dịch giữa 7 ngôn ngữ (English, Vietnamese, French, Spanish, German, Chinese, Japanese)
- Giữ nguyên định dạng học thuật
- Tải xuống kết quả

### ❓ **Hỏi Đáp Thông Minh**
- Upload tài liệu → Đặt câu hỏi
- Trả lời dựa trên nội dung tài liệu
- Hiển thị các trích dẫn liên quan
- Lịch sử cuộc trò chuyện

### 📝 **Tóm Tắt Chuyên Nghiệp**
- 3 độ dài: Brief | Medium | Comprehensive
- Trích xuất các điểm chính (5-8 points)
- Tính toán tỷ lệ nén
- Xuất kết quả

---

## 🛠️ Công Nghệ

| Component | Công nghệ |
|-----------|-----------|
| **Frontend** | React 19 + Vite 6 + TypeScript |
| **Styling** | Tailwind CSS v4 |
| **AI** | Google Gemini 2.0 Flash |
| **PDF** | PDF.js (pdfjs-dist) |
| **Icons** | Lucide React |
| **Animations** | Motion |

---

## 📋 Cấu Trúc Folder

```
src/
├── pages/              # Các trang chính
│   ├── TranslationPage.tsx
│   ├── QAPage.tsx
│   └── SummarizationPage.tsx
├── components/         # Thành phần tái sử dụng
│   └── DocumentUpload.tsx
├── lib/               # Services & utilities
│   ├── gemini.ts      # Gemini API wrapper
│   └── pdf.ts         # PDF processing
├── types/             # TypeScript types
│   └── index.ts
├── styles/
│   └── (CSS files)
├── App.tsx            # App chính
└── main.tsx           # Entry point
```

---

## 🔧 Scripts

```bash
npm run dev          # Dev server (port 3000)
npm run build        # Production build
npm run preview      # Preview build
npm run lint         # Type checking
npm run clean        # Remove dist folder
```

---

## 🌍 Ngôn Ngữ Được Hỗ Trợ

- 🇬🇧 English
- 🇻🇳 Vietnamese
- 🇫🇷 French
- 🇪🇸 Spanish
- 🇩🇪 German
- 🇨🇳 Chinese
- 🇯🇵 Japanese

---

## 📦 Điều Kiện

- **Node.js** 16+
- **npm** 8+
- **Internet** (cho Gemini API)
- **PDF files** tối đa 50MB

---

## 🔐 API Key

Để bảo mật:
- **Không** commit file `.env.local`
- Sử dụng biến môi trường trong production
- API key chỉ được sử dụng trên client side

---

## 📄 Các Định Dạng Hỗ Trợ

- **Upload**: PDF (.pdf)
- **Export**: 
  - Văn bản (.txt)
  - Sao chép vào clipboard

---

## 🎯 Trường Hợp Sử Dụng

✅ Dịch paper nghiên cứu  
✅ Phân tích tài liệu học thuật  
✅ Tóm tắt nhanh nội dung  
✅ Hỏi đáp để hiểu sâu  
✅ Chuẩn bị tài liệu cho seminar  

---

## 📚 Thêm Tài Liệu

- [Gemini API Docs](https://ai.google.dev/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vite.dev/)

---

**Made with ❤️ for Academic Researchers**
