import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'gray' | 'white';
  className?: string;
}

/**
 * Reusable loading spinner component
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'blue',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    gray: 'text-gray-600',
    white: 'text-white'
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
  className?: string;
}

/**
 * Loading overlay component that covers its children
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  message = 'Loading...',
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-50 rounded-lg">
          <div className="flex flex-col items-center space-y-3">
            <LoadingSpinner size="lg" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

/**
 * Skeleton loading component for content placeholders
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  rounded = false
}) => {
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${
        rounded ? 'rounded-full' : 'rounded'
      } ${className}`}
      style={style}
      aria-label="Loading content"
    />
  );
};

/**
 * Skeleton for fact check result card
 */
export const FactCheckSkeleton: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
      {/* Header */}
      <div className="p-6 bg-gray-100 dark:bg-gray-700">
        <div className="flex items-center">
          <Skeleton width={48} height={48} rounded className="flex-shrink-0" />
          <div className="ml-4 flex-1">
            <Skeleton width="60%" height={24} className="mb-2" />
            <Skeleton width="40%" height={16} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Explanation */}
        <div>
          <Skeleton width="30%" height={20} className="mb-3" />
          <div className="space-y-2">
            <Skeleton width="100%" height={16} />
            <Skeleton width="95%" height={16} />
            <Skeleton width="88%" height={16} />
            <Skeleton width="92%" height={16} />
          </div>
        </div>

        {/* Sources */}
        <div>
          <Skeleton width="25%" height={20} className="mb-3" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start">
                <Skeleton width={24} height={24} rounded className="flex-shrink-0 mt-0.5" />
                <div className="ml-3 flex-1">
                  <Skeleton width="80%" height={16} className="mb-1" />
                  <Skeleton width="40%" height={12} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage stats */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Skeleton width="35%" height={16} className="mb-2" />
          <div className="flex space-x-4">
            <Skeleton width="80px" height={14} />
            <Skeleton width="90px" height={14} />
            <Skeleton width="70px" height={14} />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton for form inputs
 */
export const FormSkeleton: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const containerClasses = `space-y-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`;

  return (
    <div className={containerClasses}>
      {/* Model selector */}
      <div>
        <Skeleton width="15%" height={16} className="mb-2" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center">
              <Skeleton width={16} height={16} rounded className="mr-2" />
              <Skeleton width="60%" height={14} />
            </div>
          ))}
        </div>
      </div>

      {/* Advanced options toggle */}
      <Skeleton width="40%" height={16} />

      {/* Text area */}
      <Skeleton width="100%" height={128} />

      {/* Submit button */}
      <Skeleton width="100%" height={48} />
    </div>
  );
};
