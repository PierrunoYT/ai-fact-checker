import React from 'react';
import { LinkupSearchOptions } from '../LinkupSearchOptions';
import type { LinkupDepth, LinkupOutputType } from '../../types';

interface LinkupSearchFormProps {
  query: string;
  setQuery: (value: string) => void;
  loading: boolean;
  showOptions: boolean;
  setShowOptions: (show: boolean) => void;
  depth: LinkupDepth;
  setDepth: (depth: LinkupDepth) => void;
  outputType: LinkupOutputType;
  setOutputType: (type: LinkupOutputType) => void;
  includeDomains: string;
  setIncludeDomains: (domains: string) => void;
  excludeDomains: string;
  setExcludeDomains: (domains: string) => void;
  fromDate: string;
  setFromDate: (date: string) => void;
  toDate: string;
  setToDate: (date: string) => void;
  includeImages: boolean;
  setIncludeImages: (value: boolean) => void;
  includeInlineCitations: boolean;
  setIncludeInlineCitations: (value: boolean) => void;
  includeSources: boolean;
  setIncludeSources: (value: boolean) => void;
  isDarkMode: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const LinkupSearchForm: React.FC<LinkupSearchFormProps> = ({
  query,
  setQuery,
  loading,
  showOptions,
  setShowOptions,
  depth,
  setDepth,
  outputType,
  setOutputType,
  includeDomains,
  setIncludeDomains,
  excludeDomains,
  setExcludeDomains,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  includeImages,
  setIncludeImages,
  includeInlineCitations,
  setIncludeInlineCitations,
  includeSources,
  setIncludeSources,
  isDarkMode,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="flex-1 flex flex-col">
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className={`flex items-center text-sm font-medium ${
            isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
          } transition-colors duration-200`}
          aria-label="Toggle Linkup search options"
        >
          <svg 
            className={`w-4 h-4 mr-2 transform transition-transform duration-200 ${
              showOptions ? 'rotate-90' : ''
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

      {showOptions && (
        <LinkupSearchOptions
          depth={depth}
          setDepth={setDepth}
          outputType={outputType}
          setOutputType={setOutputType}
          includeDomains={includeDomains}
          setIncludeDomains={setIncludeDomains}
          excludeDomains={excludeDomains}
          setExcludeDomains={setExcludeDomains}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          includeImages={includeImages}
          setIncludeImages={setIncludeImages}
          includeInlineCitations={includeInlineCitations}
          setIncludeInlineCitations={setIncludeInlineCitations}
          includeSources={includeSources}
          setIncludeSources={setIncludeSources}
          isDarkMode={isDarkMode}
        />
      )}

      <div className="relative flex-1 mb-4">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
        disabled={loading || !query.trim()}
        className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 ${
          loading || !query.trim()
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
        }`}
        aria-label="Search"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
};

