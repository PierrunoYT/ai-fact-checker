import React from 'react';
import type { ValyuSearchResponse, ValyuSearchResult } from '../../types';

interface ValyuSearchResultsProps {
  result: ValyuSearchResponse;
  isDarkMode: boolean;
}

export const ValyuSearchResults: React.FC<ValyuSearchResultsProps> = ({
  result,
  isDarkMode
}) => {
  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden animate-fade-in`}>
      <div className={`p-6 ${isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'}`}>
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-full p-2 ${isDarkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'}`}>
            <svg className={`h-6 w-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>
              Valyu Search Results
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Found {result.totalResults} result{result.totalResults !== 1 ? 's' : ''}
              {result.totalDeductionDollars !== undefined && (
                <span className="ml-2">• Cost: ${result.totalDeductionDollars.toFixed(4)}</span>
              )}
              {result.totalCharacters !== undefined && (
                <span className="ml-2">• {result.totalCharacters.toLocaleString()} chars</span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Results for: "{result.query}"
          </h3>
          <ul className="space-y-4">
            {result.results.map((item: ValyuSearchResult, index: number) => (
              <li
                key={index}
                className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border-l-4 border-indigo-500`}
              >
                <div className="flex items-start">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium mr-3 mt-0.5 ${
                    isDarkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-lg font-semibold ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'} hover:underline transition-colors duration-200`}
                    >
                      {item.title}
                    </a>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                      {item.url}
                    </p>
                    {item.publishedDate && (
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                        Published: {new Date(item.publishedDate).toLocaleDateString()}
                      </p>
                    )}
                    {item.author && (
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Author: {item.author}
                      </p>
                    )}
                    {item.relevanceScore !== undefined && (
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Relevance: {(item.relevanceScore * 100).toFixed(1)}%
                      </p>
                    )}
                    {item.snippet && (
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mt-2`}>
                        {item.snippet}
                      </p>
                    )}
                    {item.text && item.text.length > 500 && (
                      <details className="mt-2">
                        <summary className={`text-sm cursor-pointer ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'}`}>
                          Show full content
                        </summary>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mt-2 whitespace-pre-wrap`}>
                          {item.text}
                        </p>
                      </details>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {result.txId && (
          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-2`}>
            Transaction ID: {result.txId}
          </p>
        )}
      </div>
    </div>
  );
};
