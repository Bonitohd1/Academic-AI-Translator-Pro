import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import { DocumentUpload } from '../components/DocumentUpload';
import { geminiService } from '../lib/gemini';
import { QAMessage } from '../types';

export const QAPage: React.FC = () => {
  const [documentContent, setDocumentContent] = useState('');
  const [messages, setMessages] = useState<QAMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleDocumentUpload = (file: File, content: string) => {
    setDocumentContent(content);
    setMessages([]);
    setError(null);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    if (!documentContent) {
      setError('Please upload a document first');
      return;
    }

    const userMessage: QAMessage = {
      id: Date.now().toString(),
      documentId: 'current',
      question: inputValue,
      answer: '',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const { answer, excerpts } = await geminiService.answerQuestion(
        documentContent,
        inputValue
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id
            ? { ...msg, answer, relevantExcerpts: excerpts }
            : msg
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to get answer'
      );
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Q&A Assistant
        </h1>

        {/* Document Upload */}
        {!documentContent && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Upload Document
            </h2>
            <DocumentUpload onUpload={handleDocumentUpload} />
          </div>
        )}

        {documentContent && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              ✓ Document loaded. Start asking questions!
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      {documentContent && (
        <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col h-96">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <p className="text-lg font-medium">No questions yet</p>
                  <p className="text-sm">Ask your first question below</p>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className="space-y-3">
                {/* User Question */}
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-md">
                    <p className="text-sm">{msg.question}</p>
                  </div>
                </div>

                {/* AI Answer */}
                {msg.answer && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-md space-y-3">
                      <p className="text-sm text-gray-900">{msg.answer}</p>
                      {msg.relevantExcerpts && msg.relevantExcerpts.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-300">
                          <p className="text-xs font-semibold text-gray-700 mb-2">
                            Relevant excerpts:
                          </p>
                          <div className="space-y-1">
                            {msg.relevantExcerpts.map((excerpt, idx) => (
                              <p
                                key={idx}
                                className="text-xs text-gray-600 italic line-clamp-2"
                              >
                                "{excerpt}"
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about the document..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
