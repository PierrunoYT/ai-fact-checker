import React, { useState, useEffect } from 'react';
import { factCheckApi, type FactCheckResponse, type PerplexityModel } from '../api/perplexityApi';
import { exaApi } from '../api/exaApi';
import { linkupApi } from '../api/linkupApi';
import { sessionsApi, type Session } from '../api/sessionsApi';
import { validateStatement, validateDomainFilter } from '../utils/validation';
import type { ExaSearchResponse, ExaSearchType, ExaCategory, LinkupSearchResponse, LinkupDepth, LinkupOutputType } from '../types';

import { Header } from './fact-checker/Header';
import { FactCheckForm } from './fact-checker/FactCheckForm';
import { WebSearchForm } from './fact-checker/WebSearchForm';
import { FactCheckResults } from './fact-checker/FactCheckResults';
import { ExaSearchResults } from './fact-checker/ExaSearchResults';
import { LinkupSearchResults } from './fact-checker/LinkupSearchResults';
import { EmptyState } from './fact-checker/EmptyState';
import { ErrorDisplay } from './fact-checker/ErrorDisplay';

type TabType = 'fact-check' | 'web-search';
type SearchProvider = 'exa' | 'linkup';

export const FactChecker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('fact-check');
  const [searchProvider, setSearchProvider] = useState<SearchProvider>('exa');
  
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

  // Linkup Search state
  const [linkupQuery, setLinkupQuery] = useState('');
  const [linkupLoading, setLinkupLoading] = useState(false);
  const [linkupResult, setLinkupResult] = useState<LinkupSearchResponse | null>(null);
  const [linkupError, setLinkupError] = useState<string | null>(null);
  const [showLinkupOptions, setShowLinkupOptions] = useState(false);
  const [linkupDepth, setLinkupDepth] = useState<LinkupDepth>('standard');
  const [linkupOutputType, setLinkupOutputType] = useState<LinkupOutputType>('sourcedAnswer');
  const [linkupIncludeDomains, setLinkupIncludeDomains] = useState('');
  const [linkupExcludeDomains, setLinkupExcludeDomains] = useState('');
  const [linkupFromDate, setLinkupFromDate] = useState('');
  const [linkupToDate, setLinkupToDate] = useState('');
  const [linkupIncludeImages, setLinkupIncludeImages] = useState(false);
  const [linkupIncludeInlineCitations, setLinkupIncludeInlineCitations] = useState(false);
  const [linkupIncludeSources, setLinkupIncludeSources] = useState(true);

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
      validateStatement(statement);
      const domainsArray = searchDomains ? validateDomainFilter(searchDomains) : undefined;

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
      if (!exaQuery.trim()) {
        throw new Error('Please enter a search query');
      }

      const includeDomainsArray = exaIncludeDomains.trim()
        ? exaIncludeDomains.split(',').map(d => d.trim()).filter(d => d && !d.startsWith('-'))
        : undefined;
      
      const excludeDomainsArray = exaExcludeDomains.trim()
        ? exaExcludeDomains.split(',').map(d => d.trim().replace(/^-/, '')).filter(d => d)
        : undefined;

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

  const handleLinkupSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLinkupLoading(true);
    setLinkupError(null);
    setLinkupResult(null);

    try {
      if (!linkupQuery.trim()) {
        throw new Error('Please enter a search query');
      }

      const includeDomainsArray = linkupIncludeDomains.trim()
        ? linkupIncludeDomains.split(',').map(d => d.trim()).filter(d => d && !d.startsWith('-'))
        : undefined;
      
      const excludeDomainsArray = linkupExcludeDomains.trim()
        ? linkupExcludeDomains.split(',').map(d => d.trim().replace(/^-/, '')).filter(d => d)
        : undefined;

      const options: any = {
        depth: linkupDepth,
        outputType: linkupOutputType,
        includeImages: linkupIncludeImages,
        includeInlineCitations: linkupIncludeInlineCitations,
        includeSources: linkupIncludeSources,
      };

      if (includeDomainsArray && includeDomainsArray.length > 0) {
        options.includeDomains = includeDomainsArray;
      }
      if (excludeDomainsArray && excludeDomainsArray.length > 0) {
        options.excludeDomains = excludeDomainsArray;
      }
      if (linkupFromDate) {
        options.fromDate = linkupFromDate;
      }
      if (linkupToDate) {
        options.toDate = linkupToDate;
      }

      const response = await linkupApi.search(linkupQuery, options);
      setLinkupResult(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      setLinkupError(message);
      console.error('Error performing Linkup search:', error);
    } finally {
      setLinkupLoading(false);
    }
  };

  const scrollToSource = (e: React.MouseEvent, sourceId: string) => {
    e.preventDefault();
    const element = document.getElementById(sourceId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSession = async (session: Session) => {
    try {
      const sessionData = await sessionsApi.getById(session.id);
      
      if (session.type === 'fact-check') {
        setActiveTab('fact-check');
        setStatement(session.query);
        if (sessionData.result) {
          const factCheckResult: FactCheckResponse = {
            isFactual: sessionData.result.isFactual,
            confidence: sessionData.result.confidence,
            explanation: sessionData.result.explanation,
            thinking: sessionData.result.thinking,
            sources: sessionData.result.citations?.map((c: any) => c.url) || [],
            citations: sessionData.result.citations?.map((c: any) => ({
              id: c.citationId,
              url: c.url,
              title: c.title,
              domain: c.domain,
              snippet: c.snippet
            })),
            usage: sessionData.result.usage
          };
          setResult(factCheckResult);
          if (sessionData.result.thinking) {
            setThinking(sessionData.result.thinking);
          }
        }
      } else if (session.type === 'exa-search') {
        setActiveTab('web-search');
        setSearchProvider('exa');
        setExaQuery(session.query);
        if (sessionData.result) {
          const exaSearchResult: ExaSearchResponse = {
            success: true,
            query: session.query,
            results: sessionData.result.items.map((item: any) => ({
              title: item.title,
              url: item.url,
              publishedDate: item.publishedDate,
              author: item.author,
              snippet: item.snippet,
              text: item.text,
              summary: item.summary,
              highlights: item.highlights,
              relevanceScore: item.relevanceScore
            })),
            searchType: sessionData.result.searchType,
            costDollars: sessionData.result.costDollars,
            requestId: sessionData.result.requestId,
            totalResults: sessionData.result.totalResults
          };
          setExaResult(exaSearchResult);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load session';
      if (session.type === 'fact-check') {
        setError(message);
      } else {
        setExaError(message);
      }
    }
  };

  const handleTabChange = () => {
    setError(null);
    setExaError(null);
    setLinkupError(null);
  };

  const handleProviderChange = () => {
    setExaError(null);
    setLinkupError(null);
  };

  return (
    <div className={`h-screen flex ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Left Panel - Input */}
      <div className={`w-1/2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg flex flex-col overflow-y-auto`}>
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onTabChange={handleTabChange}
        />

        {activeTab === 'fact-check' ? (
          <FactCheckForm
            statement={statement}
            setStatement={setStatement}
            model={model}
            setModel={setModel}
            loading={loading}
            showAdvancedOptions={showAdvancedOptions}
            setShowAdvancedOptions={setShowAdvancedOptions}
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
            onSubmit={handleFactCheckSubmit}
            onSelectSession={handleSelectSession}
          />
        ) : (
          <WebSearchForm
            searchProvider={searchProvider}
            setSearchProvider={setSearchProvider}
            isDarkMode={isDarkMode}
            onSelectSession={handleSelectSession}
            exaQuery={exaQuery}
            setExaQuery={setExaQuery}
            exaLoading={exaLoading}
            showExaOptions={showExaOptions}
            setShowExaOptions={setShowExaOptions}
            exaSearchType={exaSearchType}
            setExaSearchType={setExaSearchType}
            exaNumResults={exaNumResults}
            setExaNumResults={setExaNumResults}
            exaIncludeDomains={exaIncludeDomains}
            setExaIncludeDomains={setExaIncludeDomains}
            exaExcludeDomains={exaExcludeDomains}
            setExaExcludeDomains={setExaExcludeDomains}
            exaStartPublishedDate={exaStartPublishedDate}
            setExaStartPublishedDate={setExaStartPublishedDate}
            exaEndPublishedDate={exaEndPublishedDate}
            setExaEndPublishedDate={setExaEndPublishedDate}
            exaCategory={exaCategory}
            setExaCategory={setExaCategory}
            exaGetText={exaGetText}
            setExaGetText={setExaGetText}
            exaGetSummary={exaGetSummary}
            setExaGetSummary={setExaGetSummary}
            exaGetHighlights={exaGetHighlights}
            setExaGetHighlights={setExaGetHighlights}
            exaGetContext={exaGetContext}
            setExaGetContext={setExaGetContext}
            exaContextMaxCharacters={exaContextMaxCharacters}
            setExaContextMaxCharacters={setExaContextMaxCharacters}
            onExaSubmit={handleExaSearchSubmit}
            linkupQuery={linkupQuery}
            setLinkupQuery={setLinkupQuery}
            linkupLoading={linkupLoading}
            showLinkupOptions={showLinkupOptions}
            setShowLinkupOptions={setShowLinkupOptions}
            linkupDepth={linkupDepth}
            setLinkupDepth={setLinkupDepth}
            linkupOutputType={linkupOutputType}
            setLinkupOutputType={setLinkupOutputType}
            linkupIncludeDomains={linkupIncludeDomains}
            setLinkupIncludeDomains={setLinkupIncludeDomains}
            linkupExcludeDomains={linkupExcludeDomains}
            setLinkupExcludeDomains={setLinkupExcludeDomains}
            linkupFromDate={linkupFromDate}
            setLinkupFromDate={setLinkupFromDate}
            linkupToDate={linkupToDate}
            setLinkupToDate={setLinkupToDate}
            linkupIncludeImages={linkupIncludeImages}
            setLinkupIncludeImages={setLinkupIncludeImages}
            linkupIncludeInlineCitations={linkupIncludeInlineCitations}
            setLinkupIncludeInlineCitations={setLinkupIncludeInlineCitations}
            linkupIncludeSources={linkupIncludeSources}
            setLinkupIncludeSources={setLinkupIncludeSources}
            onLinkupSubmit={handleLinkupSearchSubmit}
            onProviderChange={handleProviderChange}
          />
        )}
      </div>

      {/* Right Panel - Results */}
      <div className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-y-auto`}>
        <div className="p-8">
          <ErrorDisplay error={error || exaError || linkupError || null} isDarkMode={isDarkMode} />

          {activeTab === 'fact-check' && result && (
            <FactCheckResults
              result={result}
              thinking={thinking}
              isDarkMode={isDarkMode}
              onScrollToSource={scrollToSource}
            />
          )}

          {activeTab === 'web-search' && searchProvider === 'exa' && exaResult && (
            <ExaSearchResults result={exaResult} isDarkMode={isDarkMode} />
          )}

          {activeTab === 'web-search' && searchProvider === 'linkup' && linkupResult && (
            <LinkupSearchResults result={linkupResult} isDarkMode={isDarkMode} />
          )}

          {activeTab === 'fact-check' && !result && !error && !loading && (
            <EmptyState type="fact-check" isDarkMode={isDarkMode} />
          )}

          {activeTab === 'web-search' && !exaResult && !linkupResult && !exaError && !linkupError && !exaLoading && !linkupLoading && (
            <EmptyState type="web-search" isDarkMode={isDarkMode} />
          )}
        </div>
      </div>
    </div>
  );
};
