import React from 'react';
import { ParallelSearchOptions } from '../ParallelSearchOptions';

interface ParallelSearchFormProps {
  objective: string;
  setObjective: (value: string) => void;
  loading: boolean;
  showOptions: boolean;
  setShowOptions: (show: boolean) => void;
  maxResults: number;
  setMaxResults: (num: number) => void;
  maxCharsPerResult: number;
  setMaxCharsPerResult: (num: number) => void;
  searchQueries: string;
  setSearchQueries: (queries: string) => void;
  isDarkMode: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const ParallelSearchForm: React.FC<ParallelSearchFormProps> = ({
  objective,
  setObjective,
  loading,
  showOptions,
  setShowOptions,
  maxResults,
  setMaxResults,
  maxCharsPerResult,
  setMaxCharsPerResult,
  searchQueries,
  setSearchQueries,
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
          aria-label="Toggle Parallel search options"
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
        <ParallelSearchOptions
          maxResults={maxResults}
          setMaxResults={setMaxResults}
          maxCharsPerResult={maxCharsPerResult}
          setMaxCharsPerResult={setMaxCharsPerResult}
          searchQueries={searchQueries}
          setSearchQueries={setSearchQueries}
          isDarkMode={isDarkMode}
        />
      )}

      <div className="relative flex-1 mb-4">
        <textarea
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          placeholder="Enter a search objective (natural language query)..."
          className={`w-full h-32 p-4 text-lg rounded-lg border resize-none ${
            isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          required
          aria-label="Search objective"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !objective.trim()}
        className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 ${
          loading || !objective.trim()
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

