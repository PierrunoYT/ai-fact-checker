import React, { useState, useEffect } from 'react';
import { sessionsApi, type Session } from '../api/sessionsApi';

interface SessionsHistoryProps {
  isDarkMode: boolean;
  onSelectSession: (session: Session) => void;
  activeTab: 'fact-check' | 'exa-search' | 'linkup-search';
}

export const SessionsHistory: React.FC<SessionsHistoryProps> = ({
  isDarkMode,
  onSelectSession,
  activeTab
}) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (showHistory) {
      loadSessions();
    }
  }, [showHistory, activeTab]);

  const loadSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await sessionsApi.getAll(activeTab, 20, 0);
      setSessions(response.sessions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this session?')) {
      return;
    }

    try {
      await sessionsApi.delete(sessionId);
      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete session');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setShowHistory(!showHistory)}
        className={`flex items-center text-sm font-medium ${
          isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
        } transition-colors duration-200`}
        aria-label="Toggle history"
      >
        <svg 
          className={`w-4 h-4 mr-2 transform transition-transform duration-200 ${
            showHistory ? 'rotate-90' : ''
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
        History ({sessions.length})
      </button>

      {showHistory && (
        <div className={`mt-2 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} animate-fade-in max-h-96 overflow-y-auto`}>
          {loading && (
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Loading...
            </div>
          )}

          {error && (
            <div className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'} mb-2`}>
              {error}
            </div>
          )}

          {!loading && !error && sessions.length === 0 && (
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No previous sessions found
            </div>
          )}

          {!loading && !error && sessions.length > 0 && (
            <ul className="space-y-2">
              {sessions.map((session) => (
                <li
                  key={session.id}
                  onClick={() => onSelectSession(session)}
                  className={`p-3 rounded cursor-pointer transition-colors duration-200 ${
                    isDarkMode
                      ? 'bg-gray-600 hover:bg-gray-500'
                      : 'bg-white hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {session.query.length > 60 
                          ? `${session.query.substring(0, 60)}...` 
                          : session.query}
                      </p>
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatDate(session.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, session.id)}
                      className={`ml-2 p-1 rounded hover:bg-opacity-20 ${
                        isDarkMode
                          ? 'text-gray-400 hover:text-red-400 hover:bg-red-500'
                          : 'text-gray-500 hover:text-red-600 hover:bg-red-100'
                      } transition-colors duration-200`}
                      aria-label="Delete session"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

