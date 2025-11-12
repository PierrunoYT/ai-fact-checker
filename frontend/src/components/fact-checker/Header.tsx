import React from 'react';

type TabType = 'fact-check' | 'web-search';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  onTabChange: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  onTabChange
}) => {
  return (
    <div className="p-8 pb-0">
      <div className="flex items-center justify-between mb-6">
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          AI Fact Checker
        </h1>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-lg ${
            isDarkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          } transition-colors duration-200`}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>
      <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
        {activeTab === 'fact-check' 
          ? 'Enter any statement and our AI will verify its accuracy using multiple reliable sources'
          : 'Search the web using Exa AI or Linkup to find relevant sources and content'}
      </p>

      {/* Tab Switcher */}
      <div className="flex mb-4 border-b border-gray-300 dark:border-gray-600">
        <button
          type="button"
          onClick={() => {
            setActiveTab('fact-check');
            onTabChange();
          }}
          className={`px-4 py-2 font-medium text-sm transition-colors duration-200 ${
            activeTab === 'fact-check'
              ? isDarkMode
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-blue-600 border-b-2 border-blue-600'
              : isDarkMode
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Fact Check
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('web-search');
            onTabChange();
          }}
          className={`px-4 py-2 font-medium text-sm transition-colors duration-200 ${
            activeTab === 'web-search'
              ? isDarkMode
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-blue-600 border-b-2 border-blue-600'
              : isDarkMode
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Web Search
        </button>
      </div>
    </div>
  );
};

