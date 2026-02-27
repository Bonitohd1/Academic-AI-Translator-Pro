# 🎓 Academic Research Translator

An intelligent AI-powered application for accurate translation, Q&A, and professional summarization of academic research documents.

**Powered by Google Gemini 2.0 Flash** | **Built with React 19 + Vite**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-16+-green)

## ✨ Features

### 📄 **Document Translation**
- Translate research papers between **7 languages**
- Maintains academic terminology and citation formats
- Preserves document structure and formatting
- **Export** translated documents as text files
- Supports both PDF upload and manual text input

### ❓ **Intelligent Q&A**
- Ask questions about your documents
- Context-aware answers based on document content
- View **relevant excerpts** from source material
- Full conversation history tracking
- Multi-turn dialogue support

### 📝 **Professional Summarization**
- **3 summary levels**: Brief (2-3 para) | Medium (4-6 para) | Comprehensive (8-10 para)
- Automatic **5-8 key points** extraction
- Compression ratio calculation
- Download summaries with key points
- Academic-focused content analysis

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ ([Download](https://nodejs.org/))
- **npm** 8+
- **Free Gemini API Key** ([Get Here](https://aistudio.google.com/app/apikey))

### Installation & Setup

```bash
# 1. Clone & Install
git clone https://github.com/Bonitohd1/Academic-AI-Translator.git
cd Academic-AI-Translator
npm install

# 2. Configure API Key
cp .env.example .env.local
# Edit .env.local and add your API key:
# VITE_GEMINI_API_KEY=your_api_key_here

# 3. Start Development Server
npm run dev
```

**Open:** [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build       # Create optimized build
npm run preview     # Preview production build
npm run lint        # Type checking
npm run clean       # Remove dist folder
```

## 📁 Project Structure

```
src/
├── pages/
│   ├── TranslationPage.tsx      # 📄 Multi-language translation
│   ├── QAPage.tsx               # ❓ Document Q&A interface
│   └── SummarizationPage.tsx   # 📝 AI-powered summaries
├── components/
│   └── DocumentUpload.tsx        # 📤 PDF upload with validation
├── lib/
│   ├── gemini.ts                # 🤖 Gemini API wrapper
│   └── pdf.ts                   # 📕 PDF text extraction
├── types/
│   └── index.ts                 # 📋 TypeScript definitions
├── styles/
│   └── index.css                # 🎨 Global styles
├── App.tsx                      # 🏠 Main application
└── main.tsx                     # ⚙️ React entry point
```

## 🌍 Supported Languages

| 🇬🇧 English | 🇻🇳 Vietnamese | 🇫🇷 French | 🇪🇸 Spanish |
|---|---|---|---|
| 🇩🇪 German | 🇨🇳 Chinese | 🇯🇵 Japanese | |

## 🛠️ Tech Stack

### Frontend Framework
```json
{
  "React": "19.0.0",
  "Vite": "6.2.0",
  "TypeScript": "5.8.2",
  "Tailwind CSS": "4.1.14"
}
```

### AI & Processing
```json
{
  "Google Gemini API": "@google/genai ^1.29.0",
  "PDF Processing": "pdfjs-dist ^5.4.624",
  "Markdown": "react-markdown ^10.1.0"
}
```

### UI Components
```json
{
  "Icons": "lucide-react 0.546.0",
  "Animations": "motion 12.23.24",
  "CSS Utilities": "clsx, tailwind-merge"
}
```

### Optional Backend
```json
{
  "Server": "express ^4.21.2",
  "Database": "better-sqlite3 ^12.4.1"
}
```

## 🔧 Environment Variables

Create `.env.local`:
```env
# Required: Google Gemini API Key
# Get from: https://aistudio.google.com/app/apikey
VITE_GEMINI_API_KEY=sk_...your_key_here...
```

**🔐 Security:**
- Never commit `.env.local` to version control
- Use environment variables in production
- API key is only used client-side
- No data stored on external servers

## 📖 Usage Examples

### 1️⃣ Translate a Research Paper
```
1. Click "Translate" tab
2. Upload your PDF (max 50MB)
3. Select source & target languages
4. Click "Translate Document"
5. Download or copy result
```

### 2️⃣ Ask Questions About Content
```
1. Click "Q&A" tab
2. Upload your PDF
3. Type your question
4. Get context-aware answers
5. View relevant excerpts
6. Continue conversation
```

### 3️⃣ Generate Summary
```
1. Click "Summarize" tab
2. Upload your PDF
3. Choose summary length
4. Get instant summary + key points
5. Download or copy results
```

## ⚙️ Available Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build to dist/ |
| `npm run preview` | Preview production build |
| `npm run lint` | Type checking with TypeScript |
| `npm run clean` | Remove dist folder |

## 📊 Specifications

### File Limits
- **PDF Upload**: Maximum 50MB
- **Text Processing**: No limit on local processing
- **API Service**: Subject to Gemini API limits

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with viewport support

### Performance
- Optimized chunk splitting
- Lazy component loading
- PDF worker optimization
- CSS/JS minification
- Tree-shaking enabled

## 🔒 Security & Privacy

✅ **Local Processing**: PDFs processed client-side  
✅ **Secure Storage**: API key in localStorage (encrypted recommended)  
✅ **No Tracking**: Zero analytics or telemetry  
✅ **HTTPS Only**: Recommended for production  
✅ **Open Source**: Full code transparency  

## 🐛 Troubleshooting

### "Cannot read VITE_GEMINI_API_KEY"
```
→ Check .env.local exists and is in root directory
→ Verify VITE_ prefix is used
→ Restart dev server after changing .env.local
```

### "Failed to extract text from PDF"
```
→ Ensure PDF is valid and not corrupted
→ Check file size is under 50MB
→ Try re-uploading the file
```

### "Generation timeout"
```
→ Try with shorter text/documents
→ Check internet connection
→ Verify Gemini API is accessible
```

### Build size too large
```
→ This is expected (PDF.js is large)
→ Use dynamic imports for code splitting
→ Consider compression for deployment
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel link
vercel env add VITE_GEMINI_API_KEY
vercel deploy
```

### Netlify
```bash
# Configure environment variable in UI
# VITE_GEMINI_API_KEY=your_key_here
netlify deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📚 API Reference

### GeminiService

#### `.translateDocument(text, source, target): Promise<string>`
Translates academic text while preserving terminology.

#### `.answerQuestion(document, question): Promise<{answer, excerpts}>`
Answers questions based on document context.

#### `.summarizeDocument(text, length): Promise<{summary, keyPoints}>`
Generates summaries with key points. Lengths: `brief` | `medium` | `comprehensive`

#### `.validateApiKey(): Promise<boolean>`
Checks if Gemini API key is valid.

### PDFService

#### `.extractTextFromPDF(file): Promise<{content, pageCount, metadata}>`
Extracts text and metadata from PDF files.

#### `.validatePDFFile(file): Promise<{valid, error}>`
Validates PDF file before processing.

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

MIT License - See [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- Built with [Google Gemini AI](https://deepmind.google/technologies/gemini/)
- Powered by [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)

## 📞 Support & Contact

- 📧 **Email**: support@example.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/Bonitohd1/Academic-AI-Translator/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Bonitohd1/Academic-AI-Translator/discussions)
- 📖 **Full Docs**: [QUICKSTART.md](QUICKSTART.md)

---

<div align="center">

**Made with ❤️ for Academic Researchers, by Developers** 🚀

⭐ If this project helped you, please consider giving it a star!

</div>
