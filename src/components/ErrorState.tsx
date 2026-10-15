import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'An unexpected error occurred while loading your social posts.',
  onRetry,
}) => {
  return (
    <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-8 max-w-lg mx-auto my-8 text-center">
      <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-rose-900 mb-1">
        Failed to load social posts
      </h3>
      <p className="text-sm text-rose-700 mb-6 max-w-sm mx-auto">
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
      >
        <RefreshCw className="w-4 h-4" />
        Retry operation
      </button>
    </div>
  );
};
