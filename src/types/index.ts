// Document types
export interface Document {
  id: string;
  filename: string;
  content: string;
  extractedText: string;
  uploadedAt: Date;
  language: string;
  pageCount: number;
}

// Translation result
export interface TranslationResult {
  id: string;
  documentId: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: Date;
  confidence?: number;
}

// Q&A types
export interface QAMessage {
  id: string;
  documentId: string;
  question: string;
  answer: string;
  timestamp: Date;
  relevantExcerpts?: string[];
}

export interface QASession {
  id: string;
  documentId: string;
  title: string;
  messages: QAMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Summarization result
export interface SummaryResult {
  id: string;
  documentId: string;
  originalText: string;
  summary: string;
  summaryLength: 'brief' | 'medium' | 'comprehensive';
  keyPoints: string[];
  timestamp: Date;
}

// Processing status
export interface ProcessingStatus {
  stage: 'uploading' | 'extracting' | 'analyzing' | 'completed' | 'error';
  progress: number;
  message: string;
  error?: string;
}
