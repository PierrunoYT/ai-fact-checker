import React from 'react';
import { ModelSelector } from '../ModelSelector';
import { AdvancedOptions } from '../AdvancedOptions';
import { SessionsHistory } from '../SessionsHistory';
import type { PerplexityModel, SearchRecency, SearchContextSize } from '../../types';
import type { Session } from '../../api/sessionsApi';

interface FactCheckFormProps {
  statement: string;
  setStatement: (value: string) => void;
  model: PerplexityModel;
  setModel: (model: PerplexityModel) => void;
  loading: boolean;
  showAdvancedOptions: boolean;
  setShowAdvancedOptions: (show: boolean) => void;
  searchContextSize: SearchContextSize;
  setSearchContextSize: (size: SearchContextSize) => void;
  searchAfterDate: string;
  setSearchAfterDate: (date: string) => void;
  searchBeforeDate: string;
  setSearchBeforeDate: (date: string) => void;
  searchDomains: string;
  setSearchDomains: (domains: string) => void;
  searchRecency: SearchRecency | undefined;
  setSearchRecency: (recency: SearchRecency | undefined) => void;
  isDarkMode: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onSelectSession: (session: Session) => void;
}

export const FactCheckForm: React.FC<FactCheckFormProps> = ({
  statement,
  setStatement,
  model,
  setModel,
  loading,
  showAdvancedOptions,
  setShowAdvancedOptions,
  searchContextSize,
  setSearchContextSize,
  searchAfterDate,
  setSearchAfterDate,
  searchBeforeDate,
  setSearchBeforeDate,
  searchDomains,
  setSearchDomains,
  searchRecency,
  setSearchRecency,
  isDarkMode,
  onSubmit,
  onSelectSession
}) => {
  return (
    <form onSubmit={onSubmit} className="flex-1 flex flex-col p-8 pt-0">
      <SessionsHistory
        isDarkMode={isDarkMode}
        onSelectSession={onSelectSession}
        activeTab="fact-check"
      />

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
  );
};

