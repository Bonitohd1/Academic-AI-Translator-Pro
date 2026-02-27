import React, { useState } from 'react';
import { Loader2, Copy, Download } from 'lucide-react';
import { DocumentUpload } from '../components/DocumentUpload';
import { geminiService } from '../lib/gemini';

type SupportedLanguage = 'English' | 'Vietnamese' | 'French' | 'Spanish' | 'German' | 'Chinese' | 'Japanese';

const LANGUAGES: SupportedLanguage[] = [
  'English',
  'Vietnamese',
  'French',
  'Spanish',
  'German',
  'Chinese',
  'Japanese',
];

export const TranslationPage: React.FC = () => {
  const [sourceLanguage, setSourceLanguage] = useState<SupportedLanguage>('English');
  const [targetLanguage, setTargetLanguage] = useState<SupportedLanguage>('Vietnamese');
  const [originalText, setOriginalText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleDocumentUpload = (file: File, content: string) => {
    setOriginalText(content);
    setTranslatedText('');
  };

  const handleTranslate = async () => {
    if (!originalText.trim()) {
      alert('Please upload a document or paste text first');
      return;
    }

    setIsTranslating(true);
    try {
      const result = await geminiService.translateDocument(
        originalText,
        sourceLanguage,
        targetLanguage
      );
      setTranslatedText(result);
    } catch (error) {
      alert(
        'Translation failed: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadTranslation = () => {
    const element = document.createElement('a');
    const file = new Blob([translatedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'translated-document.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Academic Document Translator
        </h1>

        {/* Upload Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Step 1: Upload PDF
          </h2>
          <DocumentUpload onUpload={handleDocumentUpload} />
        </div>

        {/* Language Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Step 2: Select Languages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Language
              </label>
              <select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value as SupportedLanguage)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Language
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value as SupportedLanguage)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Translate Button */}
        <button
          onClick={handleTranslate}
          disabled={!originalText.trim() || isTranslating}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mb-8"
        >
          {isTranslating && <Loader2 className="w-5 h-5 animate-spin" />}
          {isTranslating ? 'Translating...' : 'Translate Document'}
        </button>

        {/* Translation Comparison Result */}
        <div className="space-y-4 border-t border-gray-200 pt-8 mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              {translatedText ? 'Translation Comparison' : 'Provide Text Below'}
            </h2>
            {translatedText && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(translatedText, 0)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                  title="Copy translation"
                >
                  <Copy className="w-4 h-4" />
                  {copiedIndex === 0 ? 'Copied!' : 'Copy Translated'}
                </button>
                <button
                  onClick={handleDownloadTranslation}
                  className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                  title="Download translation"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            )}
          </div>

          <div className={`grid grid-cols-1 ${translatedText ? 'lg:grid-cols-2' : ''} gap-6`}>
            {/* Original Text */}
            <div className="flex flex-col">
              <div className="bg-gray-100 border border-gray-200 rounded-t-lg px-4 py-2 flex justify-between items-center text-sm">
                <span className="font-medium text-gray-700">Original ({sourceLanguage})</span>
                {originalText && !translatedText && (
                  <button 
                    onClick={() => setOriginalText('')}
                    className="text-gray-500 hover:text-red-500 text-xs font-semibold"
                  >
                    Clear Text
                  </button>
                )}
              </div>
              <div className="bg-white border-x border-b border-gray-200 rounded-b-lg p-4 h-[600px] overflow-y-auto custom-scrollbar">
                {!translatedText ? (
                  <textarea
                    value={originalText}
                    onChange={(e) => setOriginalText(e.target.value)}
                    placeholder="Paste your text here or upload a PDF above..."
                    className="w-full h-full resize-none outline-none font-mono text-sm text-gray-800"
                  />
                ) : (
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-sm font-mono">
                    {originalText}
                  </p>
                )}
              </div>
            </div>

            {/* Translated Text */}
            {translatedText && (
              <div className="flex flex-col">
                <div className="bg-blue-50 border border-blue-200 rounded-t-lg px-4 py-2 font-medium text-blue-800 text-sm flex justify-between items-center">
                  <span>Translation ({targetLanguage})</span>
                  <button 
                    onClick={() => setTranslatedText('')}
                    className="text-blue-500 hover:text-blue-700 text-xs font-semibold"
                  >
                    Clear Translation
                  </button>
                </div>
                <div className="bg-white border-x border-b border-blue-200 rounded-b-lg p-4 h-[600px] overflow-y-auto custom-scrollbar">
                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed text-sm">
                    {translatedText}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
