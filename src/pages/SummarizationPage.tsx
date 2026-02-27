import React, { useState } from 'react';
import { Copy, Download, Loader2 } from 'lucide-react';
import { DocumentUpload } from '../components/DocumentUpload';
import { geminiService } from '../lib/gemini';
import { SummaryResult } from '../types';
import { exportToWord } from '../lib/export';

type SummaryLength = 'brief' | 'medium' | 'comprehensive';

export const SummarizationPage: React.FC = () => {
  const [documentContent, setDocumentContent] = useState('');
  const [summaryLength, setSummaryLength] = useState<SummaryLength>('medium');
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleDocumentUpload = (file: File, content: string) => {
    setDocumentContent(content);
    setSummary(null);
  };

  const handleSummarize = async () => {
    if (!documentContent.trim()) {
      alert('Please upload a document first');
      return;
    }

    setIsSummarizing(true);
    try {
      const { summary: summaryText, keyPoints } =
        await geminiService.summarizeDocument(documentContent, summaryLength);

      setSummary({
        id: Date.now().toString(),
        documentId: 'current',
        originalText: documentContent,
        summary: summaryText,
        summaryLength,
        keyPoints,
        timestamp: new Date(),
      });
    } catch (error) {
      alert(
        'Summarization failed: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadTxt = (filename: string) => {
    if (!summary) return;

    const content = `SUMMARY (${summary.summaryLength})\n${'='.repeat(50)}\n\n${summary.summary}\n\n\nKEY POINTS\n${'='.repeat(50)}\n${summary.keyPoints.map((p) => `• ${p}`).join('\n')}`;

    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadWord = async (filename: string) => {
    if (!summary) return;
    const content = `SUMMARY (${summary.summaryLength})\n\n${summary.summary}\n\nKEY POINTS\n\n${summary.keyPoints.map((p) => `• ${p}`).join('\n')}`;
    try {
      await exportToWord(content, filename.replace('.txt', ''));
    } catch (error) {
      console.error('Failed to export to Word:', error);
      alert('Failed to export to Word format');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Professional Summarizer
        </h1>

        {/* Upload Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Step 1: Upload PDF
          </h2>
          <DocumentUpload onUpload={handleDocumentUpload} />
        </div>

        {/* Summary Length Selection */}
        {documentContent && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Step 2: Choose Summary Length
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  value: 'brief' as const,
                  label: 'Brief',
                  desc: '2-3 paragraphs',
                },
                {
                  value: 'medium' as const,
                  label: 'Medium',
                  desc: '4-6 paragraphs',
                },
                {
                  value: 'comprehensive' as const,
                  label: 'Comprehensive',
                  desc: '8-10 paragraphs',
                },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSummaryLength(option.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    summaryLength === option.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-gray-900">{option.label}</p>
                  <p className="text-sm text-gray-600">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Summarize Button */}
        {documentContent && (
          <button
            onClick={handleSummarize}
            disabled={isSummarizing}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mb-8"
          >
            {isSummarizing && <Loader2 className="w-5 h-5 animate-spin" />}
            {isSummarizing ? 'Generating Summary...' : 'Generate Summary'}
          </button>
        )}
      </div>

      {/* Summary Result */}
      {summary && (
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Summary Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {summary.summaryLength.charAt(0).toUpperCase() +
                    summary.summaryLength.slice(1)}{' '}
                  version
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(summary.summary, 0)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                  title="Copy summary"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={() => handleDownloadTxt('summary.txt')}
                  className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                  title="Download as TXT"
                >
                  <Download className="w-4 h-4" />
                  TXT
                </button>
                <button
                  onClick={() => handleDownloadWord('summary.docx')}
                  className="p-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                  title="Download as Word Document"
                >
                  <Download className="w-4 h-4" />
                  Word
                </button>
              </div>
            </div>

            {copiedIndex === 0 && (
              <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded w-fit">
                Copied!
              </div>
            )}

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                {summary.summary}
              </p>
            </div>
          </div>

          {/* Key Points Section */}
          {summary.keyPoints.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Key Points
                </h3>
                <button
                  onClick={() =>
                    handleCopy(
                      summary.keyPoints.map((p) => `• ${p}`).join('\n'),
                      1
                    )
                  }
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy key points"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {copiedIndex === 1 && (
                <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded w-fit">
                  Copied!
                </div>
              )}

              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 space-y-3">
                {summary.keyPoints.map((point, idx) => (
                  <div key={idx} className="flex gap-3">
                    <span className="text-blue-600 font-semibold flex-shrink-0">
                      •
                    </span>
                    <p className="text-gray-900">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {summary.summary.split(' ').length}
              </p>
              <p className="text-xs text-gray-600 mt-1">Words in summary</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {summary.keyPoints.length}
              </p>
              <p className="text-xs text-gray-600 mt-1">Key points</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(
                  (summary.summary.split(' ').length /
                    summary.originalText.split(' ').length) *
                    100
                )}
                %
              </p>
              <p className="text-xs text-gray-600 mt-1">Compression ratio</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
