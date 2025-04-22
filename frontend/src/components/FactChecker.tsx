import React, { useState, useEffect } from 'react';
import { factCheckApi, type FactCheckResponse, type PerplexityModel } from '../api/perplexityApi';

export const FactChecker: React.FC = () => {
  const [statement, setStatement] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FactCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<PerplexityModel>('sonar');
  const [thinking, setThinking] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statement.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setThinking('');
    
    try {
      const response = await factCheckApi.checkFact(statement, { model });
      setResult(response);
      if (response.thinking) {
        setThinking(response.thinking);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(message);
      console.error('Error checking fact:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`h-full w-full flex ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      {/* Theme Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed top-4 right-4 p-2 rounded-full transition-all duration-200
                   ${isDarkMode 
                     ? 'bg-gray-800 hover:bg-gray-700' 
                     : 'bg-gray-100 hover:bg-gray-200 shadow-md'}`}
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {/* Left Panel */}
      <div className={`w-[500px] ${isDarkMode ? 'bg-gray-800' : 'bg-white'} h-full flex flex-col`}>
        <div className="p-8">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            AI Fact Checker
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Enter any statement and our AI will verify its accuracy using multiple reliable sources
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-8 pt-0">
          {/* Model Selection */}
          <div className="mb-4">
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
              Model
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-500"
                  name="model"
                  value="sonar"
                  checked={model === 'sonar'}
                  onChange={(e) => setModel(e.target.value as PerplexityModel)}
                />
                <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sonar</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-500"
                  name="model"
                  value="sonar-pro"
                  checked={model === 'sonar-pro'}
                  onChange={(e) => setModel(e.target.value as PerplexityModel)}
                />
                <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sonar Pro</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-500"
                  name="model"
                  value="sonar-reasoning"
                  checked={model === 'sonar-reasoning'}
                  onChange={(e) => setModel(e.target.value as PerplexityModel)}
                />
                <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sonar Reasoning</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-500"
                  name="model"
                  value="sonar-reasoning-pro"
                  checked={model === 'sonar-reasoning-pro'}
                  onChange={(e) => setModel(e.target.value as PerplexityModel)}
                />
                <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sonar Reasoning Pro</span>
              </label>
            </div>
            <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {model.includes('pro') ? 
                'Pro models have a larger context window (200k tokens) and higher output limit (8k tokens)' :
                'Standard models with 127k token context window'
              }
              {model.includes('reasoning') && ' - Includes detailed reasoning and citations'}
            </p>
          </div>

          <div className="relative flex-1 mb-4">
            <textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              className={`w-full h-full p-4 border rounded-lg text-base
                       ${isDarkMode ? 
                         'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 
                         'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                       } 
                       focus:ring-2 focus:ring-blue-400 focus:border-transparent
                       transition-all duration-200 resize-none scrollbar`}
              placeholder="Enter a statement to fact check..."
              disabled={loading}
            />
            {loading && (
              <div className={`absolute inset-0 ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} rounded-lg flex items-center justify-center backdrop-blur-sm`}>
                <div className="flex flex-col items-center space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-500 border-t-transparent"></div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>Analyzing...</span>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !statement.trim()}
            className={`w-full py-3 rounded-lg text-base font-medium
                     transition-all duration-200
                     ${loading || !statement.trim() 
                       ? 'opacity-50 cursor-not-allowed bg-gray-400 dark:bg-gray-600' 
                       : isDarkMode
                         ? 'bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50'
                         : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50'
                     }`}
          >
            {loading ? 'Analyzing...' : 'Check Fact'}
          </button>
        </form>
      </div>

      {/* Right Panel */}
      <div className={`flex-1 h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-y-auto`}>
        <div className="p-8">
          {error && (
            <div className={`${isDarkMode ? 'bg-red-900/50' : 'bg-red-50'} border-l-4 border-red-500 rounded p-4 mb-6 animate-fade-in`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
                </div>
              </div>
            </div>
          )}

          {(thinking || result) && (
            <div className="animate-fade-in">
              {/* Thinking Process */}
              {thinking && (
                <div className="mb-6">
                  <h3 className={`text-base font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'} mb-3`}>
                    Thinking Process
                  </h3>
                  <div className={`text-sm leading-relaxed ${
                    isDarkMode ? 
                      'bg-gray-800 text-gray-300 border-gray-700' : 
                      'bg-white text-gray-700 border-gray-100'
                  } p-4 rounded-lg border`}>
                    <div className="whitespace-pre-wrap font-mono">{thinking}</div>
                    {loading && (
                      <div className="mt-2 flex items-center">
                        <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full mx-1"></div>
                        <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Result */}
              {result && (
                <>
                  {/* Result Header */}
                  <div className="flex items-center space-x-3 mb-6">
                    {result.isFactual ? (
                      <div className={`${isDarkMode ? 'bg-green-900/50' : 'bg-green-100'} p-2 rounded-full`}>
                        <svg className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className={`${isDarkMode ? 'bg-red-900/50' : 'bg-red-100'} p-2 rounded-full`}>
                        <svg className={`w-6 h-6 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <h2 className={`text-xl font-bold ${
                        result.isFactual ? 
                          (isDarkMode ? 'text-green-400' : 'text-green-700') : 
                          (isDarkMode ? 'text-red-400' : 'text-red-700')
                      }`}>
                        {result.isFactual ? 'Factual Statement' : 'Not Factual'}
                      </h2>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Confidence: <span className="font-medium">
                          {result.confidence !== undefined ? `${result.confidence.toFixed(1)}%` : 'N/A'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Analysis */}
                  <div className="mb-8">
                    <h3 className={`text-base font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'} mb-3`}>Analysis</h3>
                    <p className={`text-sm leading-relaxed ${
                      isDarkMode ? 
                        'bg-gray-800 text-gray-300 border-gray-700' : 
                        'bg-white text-gray-700 border-gray-100'
                    } p-4 rounded-lg border`}>
                      {result.explanation}
                    </p>
                  </div>

                  {/* Sources */}
                  <div>
                    <h3 className={`text-base font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'} mb-3`}>Sources</h3>
                    <ul className="space-y-2">
                      {result.sources && result.sources.length > 0 ? (
                        result.sources.map((source, index) => (
                          <li key={index}>
                            <a
                              href={source}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-start p-3 rounded-lg border transition-colors duration-200 group ${
                                isDarkMode ?
                                  'bg-gray-800 border-gray-700 hover:bg-gray-700' :
                                  'bg-white border-gray-100 hover:bg-gray-50'
                              }`}
                            >
                              <span className="mr-2 text-blue-500 flex-shrink-0">[{index + 1}]</span>
                              <div className="flex flex-col flex-1 min-w-0">
                                <span className={`text-sm truncate transition-colors duration-200 ${
                                  isDarkMode ?
                                    'text-gray-300 group-hover:text-blue-400' :
                                    'text-gray-600 group-hover:text-blue-600'
                                }`}>
                                  {(() => {
                                    try {
                                      return new URL(source).hostname;
                                    } catch {
                                      // If URL parsing fails, show the full source
                                      return source;
                                    }
                                  })()}
                                </span>
                                <span className={`text-xs mt-1 break-all ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  {source}
                                </span>
                              </div>
                              <svg className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ml-2 ${
                                isDarkMode ?
                                  'text-gray-500 group-hover:text-blue-400' :
                                  'text-gray-400 group-hover:text-blue-500'
                              }`} 
                                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </li>
                        ))
                      ) : (
                        <li className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          No sources available for this fact check.
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Usage Stats */}
                  {result.usage && (
                    <div className="mt-6">
                      <h3 className={`text-base font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'} mb-3`}>Usage Statistics</h3>
                      <div className={`text-sm ${
                        isDarkMode ? 
                          'bg-gray-800 text-gray-300 border-gray-700' : 
                          'bg-white text-gray-700 border-gray-100'
                      } p-4 rounded-lg border`}>
                        <ul className="space-y-1">
                          <li>Prompt Tokens: {result.usage.prompt_tokens}</li>
                          <li>Completion Tokens: {result.usage.completion_tokens}</li>
                          <li>Total Tokens: {result.usage.total_tokens}</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};