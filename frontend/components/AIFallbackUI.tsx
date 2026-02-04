// Graceful Degradation UI Components

import React, { useState } from 'react';
import { useAIStatus, useAIAvailability } from '../contexts/AIStatusContext';
import { AlertCircle, Wifi, WifiOff, RefreshCw, Sparkles, Clock, Zap } from 'lucide-react';

// Offline Banner - Shows when AI is completely unavailable
export const AIOfflineBanner: React.FC = () => {
    const { isAIAvailable, status, error, refresh } = useAIStatus();
    const [refreshing, setRefreshing] = useState(false);

    if (isAIAvailable) return null;

    const handleRefresh = async () => {
        setRefreshing(true);
        await refresh();
        setTimeout(() => setRefreshing(false), 1000);
    };

    return (
        <div className="ai-offline-banner">
            <div className="banner-content">
                <WifiOff className="icon" size={20} />
                <div className="message">
                    <strong>AI features temporarily unavailable</strong>
                    <span>Using cached content. Some features may be limited.</span>
                </div>
                <button
                    onClick={handleRefresh}
                    className="refresh-btn"
                    disabled={refreshing}
                >
                    <RefreshCw className={`icon ${refreshing ? 'spinning' : ''}`} size={16} />
                    Retry
                </button>
            </div>

            <style>{`
        .ai-offline-banner {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
          color: white;
          padding: 12px 20px;
          position: sticky;
          top: 0;
          z-index: 1000;
          animation: slideDown 0.3s ease;
        }
        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        .banner-content {
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .message {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .message strong { font-size: 14px; }
        .message span { font-size: 12px; opacity: 0.9; }
        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .refresh-btn:hover { background: rgba(255,255,255,0.3); }
        .refresh-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .spinning { animation: spin 1s linear infinite; }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

// Quota Warning - Shows when quota is running low
export const QuotaWarning: React.FC = () => {
    const { status } = useAIStatus();

    const highUsageProvider = status?.quotas.find(q => parseFloat(q.percentUsed) >= 80);
    if (!highUsageProvider) return null;

    const percent = parseFloat(highUsageProvider.percentUsed);
    const severity = percent >= 95 ? 'critical' : percent >= 90 ? 'warning' : 'info';

    return (
        <div className={`quota-warning ${severity}`}>
            <AlertCircle size={16} />
            <span>
                AI usage at {highUsageProvider.percentUsed}% -
                {percent >= 95
                    ? ' Service may become limited soon'
                    : ' High usage detected'}
            </span>

            <style>{`
        .quota-warning {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
          margin: 8px 0;
        }
        .quota-warning.info {
          background: #e3f2fd;
          color: #1565c0;
        }
        .quota-warning.warning {
          background: #fff3e0;
          color: #e65100;
        }
        .quota-warning.critical {
          background: #ffebee;
          color: #c62828;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
        </div>
    );
};

// Fallback Topic Suggestions - When AI unavailable
interface FallbackSuggestionsProps {
    onSelectTopic: (topic: string) => void;
}

export const FallbackSuggestions: React.FC<FallbackSuggestionsProps> = ({ onSelectTopic }) => {
    const { suggestedTopics } = useAIStatus();
    const { shouldUseFallback } = useAIAvailability();

    if (!shouldUseFallback || suggestedTopics.length === 0) return null;

    return (
        <div className="fallback-suggestions">
            <div className="header">
                <Sparkles size={18} />
                <span>Popular Cached Courses (Available Offline)</span>
            </div>
            <div className="topics-grid">
                {suggestedTopics.slice(0, 8).map((topic, i) => (
                    <button
                        key={i}
                        className="topic-btn"
                        onClick={() => onSelectTopic(topic)}
                    >
                        {topic}
                    </button>
                ))}
            </div>

            <style>{`
        .fallback-suggestions {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          padding: 16px;
          color: white;
          margin: 16px 0;
        }
        .header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          margin-bottom: 12px;
        }
        .topics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 8px;
        }
        .topic-btn {
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
          text-align: left;
        }
        .topic-btn:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-2px);
        }
      `}</style>
        </div>
    );
};

// AI Status Indicator (compact, for header)
export const AIStatusIndicator: React.FC = () => {
    const { status, isAIAvailable, isLoading } = useAIStatus();

    if (isLoading) {
        return (
            <div className="ai-indicator loading">
                <Clock size={14} className="spinning" />
            </div>
        );
    }

    return (
        <div className={`ai-indicator ${isAIAvailable ? 'online' : 'offline'}`}>
            {isAIAvailable ? <Wifi size={14} /> : <WifiOff size={14} />}
            <span>{isAIAvailable ? 'AI Online' : 'Cached Mode'}</span>

            <style>{`
        .ai-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 12px;
        }
        .ai-indicator.online {
          background: #e8f5e9;
          color: #2e7d32;
        }
        .ai-indicator.offline {
          background: #fff3e0;
          color: #e65100;
        }
        .ai-indicator.loading {
          background: #e3f2fd;
          color: #1565c0;
        }
        .spinning {
          animation: spin 1s linear infinite;
        }
      `}</style>
        </div>
    );
};

// Loading state with retry for AI operations
interface AILoadingStateProps {
    message?: string;
    onRetry?: () => void;
    showFallback?: boolean;
    onUseFallback?: () => void;
}

export const AILoadingState: React.FC<AILoadingStateProps> = ({
    message = 'Connecting to AI...',
    onRetry,
    showFallback = true,
    onUseFallback
}) => {
    const { isAIAvailable } = useAIStatus();
    const [retrying, setRetrying] = useState(false);

    const handleRetry = async () => {
        setRetrying(true);
        onRetry?.();
        setTimeout(() => setRetrying(false), 2000);
    };

    return (
        <div className="ai-loading-state">
            <div className="loading-icon">
                <Zap size={32} className={retrying ? 'pulsing' : ''} />
            </div>
            <p className="message">{message}</p>

            <div className="actions">
                {onRetry && (
                    <button
                        onClick={handleRetry}
                        className="retry-btn"
                        disabled={retrying}
                    >
                        <RefreshCw size={16} className={retrying ? 'spinning' : ''} />
                        {retrying ? 'Retrying...' : 'Retry'}
                    </button>
                )}

                {showFallback && onUseFallback && (
                    <button onClick={onUseFallback} className="fallback-btn">
                        Use Cached Content
                    </button>
                )}
            </div>

            <style>{`
        .ai-loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 20px;
          text-align: center;
        }
        .loading-icon {
          color: #667eea;
          margin-bottom: 16px;
        }
        .pulsing {
          animation: pulse 1s ease-in-out infinite;
        }
        .message {
          color: #666;
          font-size: 14px;
          margin-bottom: 20px;
        }
        .actions {
          display: flex;
          gap: 12px;
        }
        .retry-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #667eea;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        }
        .retry-btn:hover { background: #5a6fd6; }
        .retry-btn:disabled { opacity: 0.6; }
        .fallback-btn {
          background: white;
          border: 2px solid #667eea;
          color: #667eea;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        }
        .fallback-btn:hover { background: #f5f5ff; }
      `}</style>
        </div>
    );
};
