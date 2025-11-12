import React from 'react';
import { SessionsHistory } from '../SessionsHistory';
import { ExaSearchForm } from './ExaSearchForm';
import { LinkupSearchForm } from './LinkupSearchForm';
import type { ExaSearchType, ExaCategory, LinkupDepth, LinkupOutputType } from '../../types';
import type { Session } from '../../api/sessionsApi';

type SearchProvider = 'exa' | 'linkup';

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
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Search Provider
        </label>
        <div className="flex gap-4">
          <label className="inline-flex items-center">
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
            <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Exa AI
            </span>
          </label>
          <label className="inline-flex items-center">
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
            <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Linkup
            </span>
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
      ) : (
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
      )}
    </div>
  );
};

