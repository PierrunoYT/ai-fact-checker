import React from 'react';

interface ParallelSearchOptionsProps {
  maxResults: number;
  setMaxResults: (num: number) => void;
  maxCharsPerResult: number;
  setMaxCharsPerResult: (num: number) => void;
  searchQueries: string;
  setSearchQueries: (queries: string) => void;
  isDarkMode: boolean;
}

export const ParallelSearchOptions: React.FC<ParallelSearchOptionsProps> = ({
  maxResults,
  setMaxResults,
  maxCharsPerResult,
  setMaxCharsPerResult,
  searchQueries,
  setSearchQueries,
  isDarkMode
}) => {
  return (
    <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} animate-fade-in space-y-4`}>
      {/* Max Results */}
      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
          Maximum Results
        </label>
        <input
          type="number"
          min="1"
          max="100"
          value={maxResults}
          onChange={(e) => setMaxResults(Math.max(1, Math.min(100, parseInt(e.target.value) || 10)))}
          className={`w-full p-2 text-sm rounded-md border ${
            isDarkMode
              ? 'bg-gray-600 border-gray-500 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          aria-label="Maximum results"
        />
        <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Maximum number of search results to return (1-100)
        </p>
      </div>

      {/* Max Characters Per Result */}
      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
          Max Characters Per Result
        </label>
        <input
          type="number"
          min="100"
          max="50000"
          step="100"
          value={maxCharsPerResult}
          onChange={(e) => setMaxCharsPerResult(Math.max(100, Math.min(50000, parseInt(e.target.value) || 10000)))}
          className={`w-full p-2 text-sm rounded-md border ${
            isDarkMode
              ? 'bg-gray-600 border-gray-500 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          aria-label="Max characters per result"
        />
        <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Maximum characters per excerpt (100-50000)
        </p>
      </div>

      {/* Search Queries */}
      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
          Additional Search Queries (Optional)
        </label>
        <textarea
          value={searchQueries}
          onChange={(e) => setSearchQueries(e.target.value)}
          placeholder="Enter additional search queries, one per line (optional)"
          rows={3}
          className={`w-full p-2 text-sm rounded-md border resize-none ${
            isDarkMode
              ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
          }`}
          aria-label="Additional search queries"
        />
        <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Optional: Provide additional search queries to help refine results. One query per line.
        </p>
      </div>
    </div>
  );
};

