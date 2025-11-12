import React from 'react';

interface ErrorDisplayProps {
  error: string | null;
  isDarkMode: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, isDarkMode }) => {
  if (!error) return null;

  return (
    <div className={`${isDarkMode ? 'bg-red-900/50' : 'bg-red-50'} border-l-4 border-red-500 rounded p-4 mb-6 animate-fade-in`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
        </div>
      </div>
    </div>
  );
};

