import React, { useState, useEffect } from 'react';
import { BookOpen, MessageCircle, FileText, Settings } from 'lucide-react';
import { TranslationPage } from './pages/TranslationPage';
import { QAPage } from './pages/QAPage';
import { SummarizationPage } from './pages/SummarizationPage';
import { geminiService } from './lib/gemini';

type Page = 'translate' | 'qa' | 'summarize' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('translate');
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiSetup, setShowApiSetup] = useState(false);

  useEffect(() => {
    // Check if API key is available
    const hasApiKey = !!import.meta.env.VITE_GEMINI_API_KEY;
    setApiKeyConfigured(hasApiKey);

    // Load API key from localStorage if available
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setApiKeyConfigured(true);
    } else if (!hasApiKey) {
      setShowApiSetup(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey);
      setApiKeyConfigured(true);
      setShowApiSetup(false);
    }
  };

  const navigationItems: Array<{ id: Page; label: string; icon: React.ReactNode }> = [
    { id: 'translate', label: 'Translate', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'qa', label: 'Q&A', icon: <MessageCircle className="w-5 h-5" /> },
    { id: 'summarize', label: 'Summarize', icon: <FileText className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Academic Translator
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              {apiKeyConfigured ? (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  API Ready
                </span>
              ) : (
                <span className="flex items-center gap-1 text-yellow-600">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  API Not Configured
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-48 bg-white border-r border-gray-200 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Info Box */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs font-semibold text-blue-900 mb-2">
                Features
              </p>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>✓ PDF Translation</li>
                <li>✓ Document Q&A</li>
                <li>✓ Smart Summarization</li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* API Setup Modal */}
            {showApiSetup && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Configure Gemini API
                  </h2>
                  <p className="text-gray-600 mb-4">
                    To use Academic Translator, you need a Google Gemini API key.
                    Get one free at{' '}
                    <a
                      href="https://aistudio.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      AI Studio
                    </a>
                  </p>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    />
                  </div>

                  <button
                    onClick={handleSaveApiKey}
                    disabled={!apiKey.trim()}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Save and Continue
                  </button>
                </div>
              </div>
            )}

            {/* Page Content */}
            {currentPage === 'translate' && <TranslationPage />}
            {currentPage === 'qa' && <QAPage />}
            {currentPage === 'summarize' && <SummarizationPage />}
            {currentPage === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  Settings
                </h1>

                <div className="space-y-6">
                  {/* API Key Settings */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      API Configuration
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-700 mb-4">
                        Status:{' '}
                        <span
                          className={
                            apiKeyConfigured
                              ? 'text-green-600 font-semibold'
                              : 'text-red-600 font-semibold'
                          }
                        >
                          {apiKeyConfigured ? 'Configured' : 'Not Configured'}
                        </span>
                      </p>
                      <button
                        onClick={() => setShowApiSetup(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        {apiKeyConfigured ? 'Update' : 'Configure'} API Key
                      </button>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      About
                    </h2>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-2">
                      <p className="text-sm text-blue-900">
                        <strong>Academic Translator v1.0</strong>
                      </p>
                      <p className="text-sm text-blue-800">
                        Powered by Google Gemini AI
                      </p>
                      <p className="text-xs text-blue-700 mt-4">
                        Features: PDF Document Translation, Intelligent Q&A, Professional
                        Summarization
                      </p>
                    </div>
                  </div>

                  {/* Help */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      Help
                    </h2>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          How to get started?
                        </p>
                        <p className="text-xs text-gray-600">
                          1. Upload your PDF document
                          <br />
                          2. Choose your desired language and feature
                          <br />
                          3. Click to process and get results
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          What formats are supported?
                        </p>
                        <p className="text-xs text-gray-600">
                          Currently supports PDF files up to 50MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
