import React from 'react';

interface EmptyStateProps {
  type: 'fact-check' | 'web-search';
  isDarkMode: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, isDarkMode }) => {
  if (type === 'fact-check') {
    return (
      <div className={`flex flex-col items-center justify-center h-[80vh] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg font-medium">Ready to fact-check</p>
        <p className="text-sm mt-2">Enter a statement to get started</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center h-[80vh] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <p className="text-lg font-medium">Ready to search</p>
      <p className="text-sm mt-2">Enter a search query to get started</p>
    </div>
  );
};

