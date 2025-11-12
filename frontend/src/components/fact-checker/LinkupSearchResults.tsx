import React from 'react';
import type { LinkupSearchResponse, LinkupSearchResult } from '../../types';

interface LinkupSearchResultsProps {
  result: LinkupSearchResponse;
  isDarkMode: boolean;
}

export const LinkupSearchResults: React.FC<LinkupSearchResultsProps> = ({
  result,
  isDarkMode
}) => {
  return (
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
              Found {result.totalResults} result{result.totalResults !== 1 ? 's' : ''} (Linkup)
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {result.answer && (
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Answer
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {result.answer}
            </p>
          </div>
        )}

        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Results for: "{result.query}"
          </h3>
          <ul className="space-y-4">
            {result.results.map((result: LinkupSearchResult, index: number) => (
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
                    {result.snippet && (
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mt-2`}>
                        {result.snippet}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {result.sources && result.sources.length > 0 && (
          <div className="mt-6">
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Sources
            </h3>
            <ul className="space-y-3">
              {result.sources.map((source, index: number) => (
                <li key={index} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm font-medium ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} hover:underline transition-colors duration-200`}
                  >
                    {source.name}
                  </a>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                    {source.url}
                  </p>
                  {source.snippet && (
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mt-2`}>
                      {source.snippet}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

