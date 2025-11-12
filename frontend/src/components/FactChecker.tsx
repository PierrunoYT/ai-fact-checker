import React, { useState, useEffect } from 'react';
import { factCheckApi, type Citation, type FactCheckResponse, type PerplexityModel } from '../api/perplexityApi';
import { exaApi } from '../api/exaApi';
import { ModelSelector } from './ModelSelector';
import { AdvancedOptions } from './AdvancedOptions';
import { ExaSearchOptions } from './ExaSearchOptions';
import { validateStatement, validateDomainFilter } from '../utils/validation';
import type { ExaSearchResponse, ExaSearchResult, ExaSearchType, ExaCategory } from '../types';

type TabType = 'fact-check' | 'web-search';

export const FactChecker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('fact-check');
  
  // Fact Check state
  const [statement, setStatement] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FactCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<PerplexityModel>('sonar');
  const [thinking, setThinking] = useState<string>('');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const [searchContextSize, setSearchContextSize] = useState<'low' | 'medium' | 'high'>('low');
  const [searchAfterDate, setSearchAfterDate] = useState('');
  const [searchBeforeDate, setSearchBeforeDate] = useState('');
  const [searchDomains, setSearchDomains] = useState('');
  const [searchRecency, setSearchRecency] = useState<'month' | 'week' | 'day' | 'hour' | undefined>('month');

  // Exa Search state
  const [exaQuery, setExaQuery] = useState('');
  const [exaLoading, setExaLoading] = useState(false);
  const [exaResult, setExaResult] = useState<ExaSearchResponse | null>(null);
  const [exaError, setExaError] = useState<string | null>(null);
  const [showExaOptions, setShowExaOptions] = useState(false);
  
  const [exaSearchType, setExaSearchType] = useState<ExaSearchType>('auto');
  const [exaNumResults, setExaNumResults] = useState(10);
  const [exaIncludeDomains, setExaIncludeDomains] = useState('');
  const [exaExcludeDomains, setExaExcludeDomains] = useState('');
  const [exaStartPublishedDate, setExaStartPublishedDate] = useState('');
  const [exaEndPublishedDate, setExaEndPublishedDate] = useState('');
  const [exaCategory, setExaCategory] = useState<ExaCategory | ''>('');
  const [exaGetText, setExaGetText] = useState(false);
  const [exaGetSummary, setExaGetSummary] = useState(false);
  const [exaGetHighlights, setExaGetHighlights] = useState(false);
  const [exaGetContext, setExaGetContext] = useState(false);
  const [exaContextMaxCharacters, setExaContextMaxCharacters] = useState(10000);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleFactCheckSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    setResult(null);
    setThinking('');

    try {
      // Validate statement
      validateStatement(statement);
      
      // Validate and parse domains
      const domainsArray = searchDomains ? validateDomainFilter(searchDomains) : undefined;

      // Simplified date filter logic
      const options = {
        model,
        searchContextSize,
        searchDomains: domainsArray,
        searchRecency: (searchAfterDate || searchBeforeDate) ? undefined : searchRecency,
        searchAfterDate: searchAfterDate || undefined,
        searchBeforeDate: searchBeforeDate || undefined
      };

      const response = await factCheckApi.checkFact(statement, options);

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

  const handleExaSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setExaLoading(true);
    setExaError(null);
    setExaResult(null);

    try {
      // Validate query
      if (!exaQuery.trim()) {
        throw new Error('Please enter a search query');
      }

      // Parse domain filters
      const includeDomainsArray = exaIncludeDomains.trim()
        ? exaIncludeDomains.split(',').map(d => d.trim()).filter(d => d && !d.startsWith('-'))
        : undefined;
      
      const excludeDomainsArray = exaExcludeDomains.trim()
        ? exaExcludeDomains.split(',').map(d => d.trim().replace(/^-/, '')).filter(d => d)
        : undefined;

      // Build Exa search options
      const options: any = {
        type: exaSearchType,
        numResults: exaNumResults,
        getText: exaGetText,
        getSummary: exaGetSummary,
        getHighlights: exaGetHighlights || false,
        getContext: exaGetContext,
      };

      if (includeDomainsArray && includeDomainsArray.length > 0) {
        options.includeDomains = includeDomainsArray;
      }
      if (excludeDomainsArray && excludeDomainsArray.length > 0) {
        options.excludeDomains = excludeDomainsArray;
      }
      if (exaStartPublishedDate) {
        options.startPublishedDate = exaStartPublishedDate;
      }
      if (exaEndPublishedDate) {
        options.endPublishedDate = exaEndPublishedDate;
      }
      if (exaCategory) {
        options.category = exaCategory;
      }
      if (exaGetContext) {
        options.contextMaxCharacters = exaContextMaxCharacters;
      }

      const response = await exaApi.search(exaQuery, options);
      setExaResult(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      setExaError(message);
      console.error('Error performing Exa search:', error);
    } finally {
      setExaLoading(false);
    }
  };

  const scrollToSource = (e: React.MouseEvent, sourceId: string) => {
    e.preventDefault();
    const element = document.getElementById(sourceId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Left Panel - Input */}
      <div className={`w-1/2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg flex flex-col`}>
        {/* Header */}
        <div className="p-8 pb-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              AI Fact Checker
            </h1>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              } transition-colors duration-200`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            {activeTab === 'fact-check' 
              ? 'Enter any statement and our AI will verify its accuracy using multiple reliable sources'
              : 'Search the web using Exa AI to find relevant sources and content'}
          </p>

          {/* Tab Switcher */}
          <div className="flex mb-4 border-b border-gray-300 dark:border-gray-600">
            <button
              type="button"
              onClick={() => {
                setActiveTab('fact-check');
                setError(null);
                setExaError(null);
              }}
              className={`px-4 py-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'fact-check'
                  ? isDarkMode
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-blue-600 border-b-2 border-blue-600'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Fact Check
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('web-search');
                setError(null);
                setExaError(null);
              }}
              className={`px-4 py-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'web-search'
                  ? isDarkMode
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-blue-600 border-b-2 border-blue-600'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Web Search
            </button>
          </div>
        </div>

        {activeTab === 'fact-check' ? (
          <form onSubmit={handleFactCheckSubmit} className="flex-1 flex flex-col p-8 pt-0">
          <ModelSelector 
            model={model} 
            onModelChange={setModel} 
            isDarkMode={isDarkMode} 
          />

          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className={`flex items-center text-sm font-medium ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              } transition-colors duration-200`}
              aria-label="Toggle advanced options"
            >
              <svg 
                className={`w-4 h-4 mr-2 transform transition-transform duration-200 ${
                  showAdvancedOptions ? 'rotate-90' : ''
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
              Advanced Options
            </button>
          </div>

          {showAdvancedOptions && (
            <AdvancedOptions
              searchContextSize={searchContextSize}
              setSearchContextSize={setSearchContextSize}
              searchAfterDate={searchAfterDate}
              setSearchAfterDate={setSearchAfterDate}
              searchBeforeDate={searchBeforeDate}
              setSearchBeforeDate={setSearchBeforeDate}
              searchDomains={searchDomains}
              setSearchDomains={setSearchDomains}
              searchRecency={searchRecency}
              setSearchRecency={setSearchRecency}
              isDarkMode={isDarkMode}
            />
          )}

          <div className="relative flex-1 mb-4">
            <textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="Enter a statement to fact-check..."
              className={`w-full h-32 p-4 text-lg rounded-lg border resize-none ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
              required
              aria-label="Statement to fact-check"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !statement.trim()}
            className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 ${
              loading || !statement.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
            }`}
            aria-label="Check fact"
          >
            {loading ? 'Analyzing...' : 'Check Fact'}
          </button>
        </form>
        ) : (
          <form onSubmit={handleExaSearchSubmit} className="flex-1 flex flex-col p-8 pt-0">
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setShowExaOptions(!showExaOptions)}
                className={`flex items-center text-sm font-medium ${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                } transition-colors duration-200`}
                aria-label="Toggle Exa search options"
              >
                <svg 
                  className={`w-4 h-4 mr-2 transform transition-transform duration-200 ${
                    showExaOptions ? 'rotate-90' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                Search Options
              </button>
            </div>

            {showExaOptions && (
              <ExaSearchOptions
                searchType={exaSearchType}
                setSearchType={setExaSearchType}
                numResults={exaNumResults}
                setNumResults={setExaNumResults}
                includeDomains={exaIncludeDomains}
                setIncludeDomains={setExaIncludeDomains}
                excludeDomains={exaExcludeDomains}
                setExcludeDomains={setExaExcludeDomains}
                startPublishedDate={exaStartPublishedDate}
                setStartPublishedDate={setExaStartPublishedDate}
                endPublishedDate={exaEndPublishedDate}
                setEndPublishedDate={setExaEndPublishedDate}
                category={exaCategory}
                setCategory={setExaCategory}
                getText={exaGetText}
                setGetText={setExaGetText}
                getSummary={exaGetSummary}
                setGetSummary={setExaGetSummary}
                getHighlights={exaGetHighlights}
                setGetHighlights={setExaGetHighlights}
                getContext={exaGetContext}
                setGetContext={setExaGetContext}
                contextMaxCharacters={exaContextMaxCharacters}
                setContextMaxCharacters={setExaContextMaxCharacters}
                isDarkMode={isDarkMode}
              />
            )}

            <div className="relative flex-1 mb-4">
              <textarea
                value={exaQuery}
                onChange={(e) => setExaQuery(e.target.value)}
                placeholder="Enter a search query..."
                className={`w-full h-32 p-4 text-lg rounded-lg border resize-none ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                required
                aria-label="Search query"
              />
            </div>

            <button
              type="submit"
              disabled={exaLoading || !exaQuery.trim()}
              className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 ${
                exaLoading || !exaQuery.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
              }`}
              aria-label="Search"
            >
              {exaLoading ? 'Searching...' : 'Search'}
            </button>
          </form>
        )}
      </div>

      {/* Right Panel - Results */}
      <div className={`flex-1 h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-y-auto pt-16`}>
        <div className="p-8">
          {(error || exaError) && (
            <div className={`${isDarkMode ? 'bg-red-900/50' : 'bg-red-50'} border-l-4 border-red-500 rounded p-4 mb-6 animate-fade-in`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>{error || exaError}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fact-check' && result && (
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden animate-fade-in`}>
              <div className={`p-6 ${
                result.isFactual ?
                  (isDarkMode ? 'bg-green-900/30' : 'bg-green-50') :
                  (isDarkMode ? 'bg-red-900/30' : 'bg-red-50')
              }`}>
                <div className="flex items-center">
                  {result.isFactual ? (
                    <div className={`flex-shrink-0 rounded-full p-2 ${isDarkMode ? 'bg-green-900/50' : 'bg-green-100'}`}>
                      <svg className={`h-6 w-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className={`flex-shrink-0 rounded-full p-2 ${isDarkMode ? 'bg-red-900/50' : 'bg-red-100'}`}>
                      <svg className={`h-6 w-6 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                  <div className="ml-4">
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
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Explanation</h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {result.explanation.split(/\[(\d+)\]/).map((part: string, index: number) => {
                      if (index % 2 === 0) {
                        return part;
                      }

                      const citationId = Number(part);
                      if (Number.isNaN(citationId)) {
                        return part;
                      }

                      const sourceIndex = citationId - 1;
                      const citation = result.citations?.find((c) => c.id === citationId);
                      const citationUrl = citation?.url;

                      return (
                        <a
                          key={index}
                          href={citationUrl ? citationUrl : `#source-${sourceIndex}`}
                          onClick={citationUrl ? undefined : (e) => scrollToSource(e, `source-${sourceIndex}`)}
                          target={citationUrl ? '_blank' : undefined}
                          rel={citationUrl ? 'noopener noreferrer' : undefined}
                          className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline transition-colors duration-200`}
                        >
                          [{part}]
                        </a>
                      );
                    })}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Sources</h3>
                  <ul className={`list-none pl-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {result.citations && result.citations.length > 0 ? (
                      result.citations.map((citation: Citation, index: number) => (
                        <li key={index} id={`source-${index}`} className="mb-4 last:mb-0">
                          <div className="flex items-start">
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium mr-3 mt-0.5 ${
                              isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {citation.id || index + 1}
                            </span>
                            <div className="flex-1">
                              <a
                                href={citation.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} hover:underline transition-colors duration-200`}
                              >
                                {citation.title || citation.url}
                              </a>
                            </div>
                          </div>
                          {citation.domain && (
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ml-9`}>
                              {citation.domain}
                            </span>
                          )}
                          {citation.snippet && (
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} ml-9 mt-1`}>
                              {citation.snippet}
                            </p>
                          )}
                        </li>
                      ))
                    ) : (
                      result.sources?.map((source: string, index: number) => (
                        <li key={index} id={`source-${index}`} className="mb-2 last:mb-0">
                          <a
                            href={source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} hover:underline transition-colors duration-200`}
                          >
                            {source}
                          </a>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                {thinking && (
                  <div>
                    <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Analysis Process</h3>
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {thinking}
                    </div>
                  </div>
                )}

                {result.usage && (
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Usage Statistics</h3>
                    <div className="flex space-x-4">
                      <div>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Prompt Tokens:</span>
                        <span className={`ml-1 text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{result.usage.prompt_tokens}</span>
                      </div>
                      <div>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Completion Tokens:</span>
                        <span className={`ml-1 text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{result.usage.completion_tokens}</span>
                      </div>
                      <div>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Total Tokens:</span>
                        <span className={`ml-1 text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{result.usage.total_tokens}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'web-search' && exaResult && (
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden animate-fade-in`}>
              <div className={`p-6 ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-full p-2 ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                    <svg className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                      Search Results
                    </h2>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Found {exaResult.totalResults} result{exaResult.totalResults !== 1 ? 's' : ''} 
                      {exaResult.searchType && ` (${exaResult.searchType} search)`}
                      {exaResult.costDollars && ` • Cost: $${exaResult.costDollars.toFixed(4)}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Results for: "{exaResult.query}"
                  </h3>
                  <ul className="space-y-4">
                    {exaResult.results.map((result: ExaSearchResult, index: number) => (
                      <li key={index} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border-l-4 border-blue-500`}>
                        <div className="flex items-start">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium mr-3 mt-0.5 ${
                            isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <a
                              href={result.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-lg font-semibold ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} hover:underline transition-colors duration-200`}
                            >
                              {result.title}
                            </a>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                              {result.url}
                            </p>
                            {result.publishedDate && (
                              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                                Published: {new Date(result.publishedDate).toLocaleDateString()}
                              </p>
                            )}
                            {result.author && (
                              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                Author: {result.author}
                              </p>
                            )}
                            {result.relevanceScore !== undefined && (
                              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                Relevance: {(result.relevanceScore * 100).toFixed(1)}%
                              </p>
                            )}
                            {result.snippet && (
                              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mt-2`}>
                                {result.snippet}
                              </p>
                            )}
                            {result.summary && (
                              <div className="mt-3">
                                <h4 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                  Summary:
                                </h4>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {result.summary}
                                </p>
                              </div>
                            )}
                            {result.highlights && result.highlights.length > 0 && (
                              <div className="mt-3">
                                <h4 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                  Highlights:
                                </h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {result.highlights.map((highlight, idx) => (
                                    <li key={idx} className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                      {highlight}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {result.text && (
                              <details className="mt-3">
                                <summary className={`text-sm font-semibold cursor-pointer ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                  Full Text (Click to expand)
                                </summary>
                                <div className={`mt-2 p-3 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                                  <pre className={`text-xs whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {result.text.substring(0, 2000)}{result.text.length > 2000 ? '...' : ''}
                                  </pre>
                                </div>
                              </details>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fact-check' && !result && !error && !loading && (
            <div className={`flex flex-col items-center justify-center h-[80vh] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium">Ready to fact-check</p>
              <p className="text-sm mt-2">Enter a statement to get started</p>
            </div>
          )}

          {activeTab === 'web-search' && !exaResult && !exaError && !exaLoading && (
            <div className={`flex flex-col items-center justify-center h-[80vh] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-lg font-medium">Ready to search</p>
              <p className="text-sm mt-2">Enter a search query to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
