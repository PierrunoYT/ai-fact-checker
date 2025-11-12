import React from 'react';
import type { LinkupDepth, LinkupOutputType } from '../types';
import { formatDateForInput, formatDateForApi, validateDomainFilter } from '../utils/validation';

interface LinkupSearchOptionsProps {
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
}

export const LinkupSearchOptions: React.FC<LinkupSearchOptionsProps> = ({
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
  isDarkMode
}) => {
  const handleIncludeDomainsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIncludeDomains(value);
    try {
      if (value.trim()) {
        validateDomainFilter(value);
      }
    } catch (error) {
      console.warn('Domain validation:', error);
    }
  };

  const handleExcludeDomainsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setExcludeDomains(value);
    try {
      if (value.trim()) {
        validateDomainFilter(value);
      }
    } catch (error) {
      console.warn('Domain validation:', error);
    }
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = formatDateForApi(e.target.value);
    setFromDate(dateValue);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = formatDateForApi(e.target.value);
    setToDate(dateValue);
  };

  return (
    <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} animate-fade-in space-y-4`}>
      {/* Search Depth */}
      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
          Search Depth
        </label>
        <div className="flex flex-wrap gap-4">
          {(['standard', 'deep'] as LinkupDepth[]).map((d) => (
            <label key={d} className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-500"
                name="linkupDepth"
                value={d}
                checked={depth === d}
                onChange={() => setDepth(d)}
                aria-label={`Search depth: ${d}`}
              />
              <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} capitalize`}>
                {d}
              </span>
            </label>
          ))}
        </div>
        <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          standard: Balanced search | deep: Comprehensive search with more sources
        </p>
      </div>

      {/* Output Type */}
      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
          Output Type
        </label>
        <div className="flex flex-wrap gap-4">
          {(['sourcedAnswer', 'raw'] as LinkupOutputType[]).map((type) => (
            <label key={type} className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-500"
                name="linkupOutputType"
                value={type}
                checked={outputType === type}
                onChange={() => setOutputType(type)}
                aria-label={`Output type: ${type}`}
              />
              <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {type === 'sourcedAnswer' ? 'Sourced Answer' : 'Raw Results'}
              </span>
            </label>
          ))}
        </div>
        <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          sourcedAnswer: AI-generated answer with sources | raw: Raw search results
        </p>
      </div>

      {/* Domain Filters */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
            Include Domains
          </label>
          <input
            type="text"
            value={includeDomains}
            onChange={handleIncludeDomainsChange}
            placeholder="e.g., microsoft.com, nytimes.com"
            className={`w-full p-2 text-sm rounded-md border ${
              isDarkMode
                ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
            aria-label="Include domains"
          />
        </div>
        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
            Exclude Domains
          </label>
          <input
            type="text"
            value={excludeDomains}
            onChange={handleExcludeDomainsChange}
            placeholder="e.g., wikipedia.com, reddit.com"
            className={`w-full p-2 text-sm rounded-md border ${
              isDarkMode
                ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
            aria-label="Exclude domains"
          />
        </div>
      </div>

      {/* Date Range */}
      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
          Published Date Range
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
              From Date
            </label>
            <input
              type="date"
              value={formatDateForInput(fromDate)}
              onChange={handleFromDateChange}
              className={`w-full p-2 text-sm rounded-md border ${
                isDarkMode
                  ? 'bg-gray-600 border-gray-500 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              aria-label="From date"
            />
          </div>
          <div>
            <label className={`block text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
              To Date
            </label>
            <input
              type="date"
              value={formatDateForInput(toDate)}
              onChange={handleToDateChange}
              className={`w-full p-2 text-sm rounded-md border ${
                isDarkMode
                  ? 'bg-gray-600 border-gray-500 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              aria-label="To date"
            />
          </div>
        </div>
      </div>

      {/* Content Options */}
      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
          Content Options
        </label>
        <div className="space-y-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={includeImages}
              onChange={(e) => setIncludeImages(e.target.checked)}
              className="form-checkbox text-blue-500"
            />
            <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Include Images
            </span>
          </label>
          <br />
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={includeInlineCitations}
              onChange={(e) => setIncludeInlineCitations(e.target.checked)}
              className="form-checkbox text-blue-500"
            />
            <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Include Inline Citations
            </span>
          </label>
          <br />
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={includeSources}
              onChange={(e) => setIncludeSources(e.target.checked)}
              className="form-checkbox text-blue-500"
            />
            <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Include Sources List
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

