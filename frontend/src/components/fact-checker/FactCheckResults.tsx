import React from 'react';
import type { FactCheckResponse, Citation } from '../../api/perplexityApi';

interface FactCheckResultsProps {
  result: FactCheckResponse;
  thinking: string;
  isDarkMode: boolean;
  onScrollToSource: (e: React.MouseEvent, sourceId: string) => void;
}

export const FactCheckResults: React.FC<FactCheckResultsProps> = ({
  result,
  thinking,
  isDarkMode,
  onScrollToSource
}) => {
  return (
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
                  onClick={citationUrl ? undefined : (e) => onScrollToSource(e, `source-${sourceIndex}`)}
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
  );
};

