import React from 'react';
import { SessionsHistory } from '../SessionsHistory';
import { ExaSearchForm } from './ExaSearchForm';
import { LinkupSearchForm } from './LinkupSearchForm';
import { ParallelSearchForm } from './ParallelSearchForm';
import { TavilySearchForm } from './TavilySearchForm';
import type { ExaSearchType, ExaCategory, LinkupDepth, LinkupOutputType, TavilySearchDepth, TavilyTopic } from '../../types';
import type { Session } from '../../api/sessionsApi';

type SearchProvider = 'exa' | 'linkup' | 'parallel' | 'tavily';

interface WebSearchFormProps {
  searchProvider: SearchProvider;
  setSearchProvider: (provider: SearchProvider) => void;
  isDarkMode: boolean;
  onSelectSession: (session: Session) => void;
  // Exa props
  exaQuery: string;
  setExaQuery: (value: string) => void;
  exaLoading: boolean;
  showExaOptions: boolean;
  setShowExaOptions: (show: boolean) => void;
  exaSearchType: ExaSearchType;
  setExaSearchType: (type: ExaSearchType) => void;
  exaNumResults: number;
  setExaNumResults: (num: number) => void;
  exaIncludeDomains: string;
  setExaIncludeDomains: (domains: string) => void;
  exaExcludeDomains: string;
  setExaExcludeDomains: (domains: string) => void;
  exaStartPublishedDate: string;
  setExaStartPublishedDate: (date: string) => void;
  exaEndPublishedDate: string;
  setExaEndPublishedDate: (date: string) => void;
  exaCategory: ExaCategory | '';
  setExaCategory: (category: ExaCategory | '') => void;
  exaGetText: boolean;
  setExaGetText: (value: boolean) => void;
  exaGetSummary: boolean;
  setExaGetSummary: (value: boolean) => void;
  exaGetHighlights: boolean;
  setExaGetHighlights: (value: boolean) => void;
  exaGetContext: boolean;
  setExaGetContext: (value: boolean) => void;
  exaContextMaxCharacters: number;
  setExaContextMaxCharacters: (value: number) => void;
  onExaSubmit: (e: React.FormEvent) => void;
  // Linkup props
  linkupQuery: string;
  setLinkupQuery: (value: string) => void;
  linkupLoading: boolean;
  showLinkupOptions: boolean;
  setShowLinkupOptions: (show: boolean) => void;
  linkupDepth: LinkupDepth;
  setLinkupDepth: (depth: LinkupDepth) => void;
  linkupOutputType: LinkupOutputType;
  setLinkupOutputType: (type: LinkupOutputType) => void;
  linkupIncludeDomains: string;
  setLinkupIncludeDomains: (domains: string) => void;
  linkupExcludeDomains: string;
  setLinkupExcludeDomains: (domains: string) => void;
  linkupFromDate: string;
  setLinkupFromDate: (date: string) => void;
  linkupToDate: string;
  setLinkupToDate: (date: string) => void;
  linkupIncludeImages: boolean;
  setLinkupIncludeImages: (value: boolean) => void;
  linkupIncludeInlineCitations: boolean;
  setLinkupIncludeInlineCitations: (value: boolean) => void;
  linkupIncludeSources: boolean;
  setLinkupIncludeSources: (value: boolean) => void;
  onLinkupSubmit: (e: React.FormEvent) => void;
  // Parallel props
  parallelObjective: string;
  setParallelObjective: (value: string) => void;
  parallelLoading: boolean;
  showParallelOptions: boolean;
  setShowParallelOptions: (show: boolean) => void;
  parallelMaxResults: number;
  setParallelMaxResults: (num: number) => void;
  parallelMaxCharsPerResult: number;
  setParallelMaxCharsPerResult: (num: number) => void;
  parallelSearchQueries: string;
  setParallelSearchQueries: (queries: string) => void;
  onParallelSubmit: (e: React.FormEvent) => void;
  // Tavily props
  tavilyQuery: string;
  setTavilyQuery: (value: string) => void;
  tavilyLoading: boolean;
  showTavilyOptions: boolean;
  setShowTavilyOptions: (show: boolean) => void;
  tavilySearchDepth: TavilySearchDepth;
  setTavilySearchDepth: (depth: TavilySearchDepth) => void;
  tavilyMaxResults: number;
  setTavilyMaxResults: (num: number) => void;
  tavilyIncludeDomains: string;
  setTavilyIncludeDomains: (domains: string) => void;
  tavilyExcludeDomains: string;
  setTavilyExcludeDomains: (domains: string) => void;
  tavilyIncludeAnswer: boolean;
  setTavilyIncludeAnswer: (value: boolean) => void;
  tavilyIncludeImages: boolean;
  setTavilyIncludeImages: (value: boolean) => void;
  tavilyIncludeRawContent: boolean;
  setTavilyIncludeRawContent: (value: boolean) => void;
  tavilyTopic: TavilyTopic;
  setTavilyTopic: (topic: TavilyTopic) => void;
  onTavilySubmit: (e: React.FormEvent) => void;
  // Error clearing
  onProviderChange: () => void;
}

export const WebSearchForm: React.FC<WebSearchFormProps> = ({
  searchProvider,
  setSearchProvider,
  isDarkMode,
  onSelectSession,
  exaQuery,
  setExaQuery,
  exaLoading,
  showExaOptions,
  setShowExaOptions,
  exaSearchType,
  setExaSearchType,
  exaNumResults,
  setExaNumResults,
  exaIncludeDomains,
  setExaIncludeDomains,
  exaExcludeDomains,
  setExaExcludeDomains,
  exaStartPublishedDate,
  setExaStartPublishedDate,
  exaEndPublishedDate,
  setExaEndPublishedDate,
  exaCategory,
  setExaCategory,
  exaGetText,
  setExaGetText,
  exaGetSummary,
  setExaGetSummary,
  exaGetHighlights,
  setExaGetHighlights,
  exaGetContext,
  setExaGetContext,
  exaContextMaxCharacters,
  setExaContextMaxCharacters,
  onExaSubmit,
  linkupQuery,
  setLinkupQuery,
  linkupLoading,
  showLinkupOptions,
  setShowLinkupOptions,
  linkupDepth,
  setLinkupDepth,
  linkupOutputType,
  setLinkupOutputType,
  linkupIncludeDomains,
  setLinkupIncludeDomains,
  linkupExcludeDomains,
  setLinkupExcludeDomains,
  linkupFromDate,
  setLinkupFromDate,
  linkupToDate,
  setLinkupToDate,
  linkupIncludeImages,
  setLinkupIncludeImages,
  linkupIncludeInlineCitations,
  setLinkupIncludeInlineCitations,
  linkupIncludeSources,
  setLinkupIncludeSources,
  onLinkupSubmit,
  parallelObjective,
  setParallelObjective,
  parallelLoading,
  showParallelOptions,
  setShowParallelOptions,
  parallelMaxResults,
  setParallelMaxResults,
  parallelMaxCharsPerResult,
  setParallelMaxCharsPerResult,
  parallelSearchQueries,
  setParallelSearchQueries,
  onParallelSubmit,
  tavilyQuery,
  setTavilyQuery,
  tavilyLoading,
  showTavilyOptions,
  setShowTavilyOptions,
  tavilySearchDepth,
  setTavilySearchDepth,
  tavilyMaxResults,
  setTavilyMaxResults,
  tavilyIncludeDomains,
  setTavilyIncludeDomains,
  tavilyExcludeDomains,
  setTavilyExcludeDomains,
  tavilyIncludeAnswer,
  setTavilyIncludeAnswer,
  tavilyIncludeImages,
  setTavilyIncludeImages,
  tavilyIncludeRawContent,
  setTavilyIncludeRawContent,
  tavilyTopic,
  setTavilyTopic,
  onTavilySubmit,
  onProviderChange
}) => {
  return (
    <div className="flex-1 flex flex-col p-8 pt-0">
      <SessionsHistory
        isDarkMode={isDarkMode}
        onSelectSession={onSelectSession}
        activeTab="exa-search"
      />

      {/* Search Provider Selector */}
      <div className={`mb-6 p-4 rounded-lg border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
        <label className={`block text-base font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          🔍 Search Provider
        </label>
        <div className="flex gap-4">
          <label className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all ${
            searchProvider === 'exa'
              ? isDarkMode
                ? 'bg-blue-900/30 border-blue-500'
                : 'bg-blue-50 border-blue-500'
              : isDarkMode
                ? 'bg-gray-600 border-gray-500 hover:border-gray-400'
                : 'bg-white border-gray-300 hover:border-gray-400'
          }`}>
            <div className="flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-500"
                name="searchProvider"
                value="exa"
                checked={searchProvider === 'exa'}
                onChange={() => {
                  setSearchProvider('exa');
                  onProviderChange();
                }}
              />
              <span className={`ml-3 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Exa AI
              </span>
            </div>
            <p className={`text-xs mt-1 ml-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Neural & keyword search
            </p>
          </label>
          <label className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all ${
            searchProvider === 'linkup'
              ? isDarkMode
                ? 'bg-blue-900/30 border-blue-500'
                : 'bg-blue-50 border-blue-500'
              : isDarkMode
                ? 'bg-gray-600 border-gray-500 hover:border-gray-400'
                : 'bg-white border-gray-300 hover:border-gray-400'
          }`}>
            <div className="flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-500"
                name="searchProvider"
                value="linkup"
                checked={searchProvider === 'linkup'}
                onChange={() => {
                  setSearchProvider('linkup');
                  onProviderChange();
                }}
              />
              <span className={`ml-3 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Linkup
              </span>
            </div>
            <p className={`text-xs mt-1 ml-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              High factuality search
            </p>
          </label>
          <label className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all ${
            searchProvider === 'parallel'
              ? isDarkMode
                ? 'bg-blue-900/30 border-blue-500'
                : 'bg-blue-50 border-blue-500'
              : isDarkMode
                ? 'bg-gray-600 border-gray-500 hover:border-gray-400'
                : 'bg-white border-gray-300 hover:border-gray-400'
          }`}>
            <div className="flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-500"
                name="searchProvider"
                value="parallel"
                checked={searchProvider === 'parallel'}
                onChange={() => {
                  setSearchProvider('parallel');
                  onProviderChange();
                }}
              />
              <span className={`ml-3 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Parallel
              </span>
            </div>
            <p className={`text-xs mt-1 ml-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              LLM-optimized search
            </p>
          </label>
          <label className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all ${
            searchProvider === 'tavily'
              ? isDarkMode
                ? 'bg-blue-900/30 border-blue-500'
                : 'bg-blue-50 border-blue-500'
              : isDarkMode
                ? 'bg-gray-600 border-gray-500 hover:border-gray-400'
                : 'bg-white border-gray-300 hover:border-gray-400'
          }`}>
            <div className="flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-500"
                name="searchProvider"
                value="tavily"
                checked={searchProvider === 'tavily'}
                onChange={() => {
                  setSearchProvider('tavily');
                  onProviderChange();
                }}
              />
              <span className={`ml-3 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Tavily
              </span>
            </div>
            <p className={`text-xs mt-1 ml-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              AI-optimized search
            </p>
          </label>
        </div>
      </div>

      {searchProvider === 'exa' ? (
        <ExaSearchForm
          query={exaQuery}
          setQuery={setExaQuery}
          loading={exaLoading}
          showOptions={showExaOptions}
          setShowOptions={setShowExaOptions}
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
          onSubmit={onExaSubmit}
        />
      ) : searchProvider === 'linkup' ? (
        <LinkupSearchForm
          query={linkupQuery}
          setQuery={setLinkupQuery}
          loading={linkupLoading}
          showOptions={showLinkupOptions}
          setShowOptions={setShowLinkupOptions}
          depth={linkupDepth}
          setDepth={setLinkupDepth}
          outputType={linkupOutputType}
          setOutputType={setLinkupOutputType}
          includeDomains={linkupIncludeDomains}
          setIncludeDomains={setLinkupIncludeDomains}
          excludeDomains={linkupExcludeDomains}
          setExcludeDomains={setLinkupExcludeDomains}
          fromDate={linkupFromDate}
          setFromDate={setLinkupFromDate}
          toDate={linkupToDate}
          setToDate={setLinkupToDate}
          includeImages={linkupIncludeImages}
          setIncludeImages={setLinkupIncludeImages}
          includeInlineCitations={linkupIncludeInlineCitations}
          setIncludeInlineCitations={setLinkupIncludeInlineCitations}
          includeSources={linkupIncludeSources}
          setIncludeSources={setLinkupIncludeSources}
          isDarkMode={isDarkMode}
          onSubmit={onLinkupSubmit}
        />
      ) : searchProvider === 'parallel' ? (
        <ParallelSearchForm
          objective={parallelObjective}
          setObjective={setParallelObjective}
          loading={parallelLoading}
          showOptions={showParallelOptions}
          setShowOptions={setShowParallelOptions}
          maxResults={parallelMaxResults}
          setMaxResults={setParallelMaxResults}
          maxCharsPerResult={parallelMaxCharsPerResult}
          setMaxCharsPerResult={setParallelMaxCharsPerResult}
          searchQueries={parallelSearchQueries}
          setSearchQueries={setParallelSearchQueries}
          isDarkMode={isDarkMode}
          onSubmit={onParallelSubmit}
        />
      ) : (
        <TavilySearchForm
          query={tavilyQuery}
          setQuery={setTavilyQuery}
          loading={tavilyLoading}
          showOptions={showTavilyOptions}
          setShowOptions={setShowTavilyOptions}
          searchDepth={tavilySearchDepth}
          setSearchDepth={setTavilySearchDepth}
          maxResults={tavilyMaxResults}
          setMaxResults={setTavilyMaxResults}
          includeDomains={tavilyIncludeDomains}
          setIncludeDomains={setTavilyIncludeDomains}
          excludeDomains={tavilyExcludeDomains}
          setExcludeDomains={setTavilyExcludeDomains}
          includeAnswer={tavilyIncludeAnswer}
          setIncludeAnswer={setTavilyIncludeAnswer}
          includeImages={tavilyIncludeImages}
          setIncludeImages={setTavilyIncludeImages}
          includeRawContent={tavilyIncludeRawContent}
          setIncludeRawContent={setTavilyIncludeRawContent}
          topic={tavilyTopic}
          setTopic={setTavilyTopic}
          isDarkMode={isDarkMode}
          onSubmit={onTavilySubmit}
        />
      )}
    </div>
  );
};

