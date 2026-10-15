import React from 'react';
import { RotateCw } from 'lucide-react';

interface RetryButtonProps {
  postId: string;
  isRetrying: boolean;
  onRetry: (postId: string) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export const RetryButton: React.FC<RetryButtonProps> = ({
  postId,
  isRetrying,
  onRetry,
  className = '',
  size = 'md',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isRetrying) {
      onRetry(postId);
    }
  };

  const sizeClasses =
    size === 'sm'
      ? 'px-2.5 py-1 text-xs gap-1.5'
      : 'px-3 py-1.5 text-xs font-semibold gap-2';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isRetrying}
      aria-label={isRetrying ? 'Retrying post publication' : 'Retry publishing post'}
      className={`inline-flex items-center rounded-xl bg-rose-600 text-white font-medium hover:bg-rose-700 active:scale-95 disabled:opacity-60 disabled:pointer-events-none transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1 ${sizeClasses} ${className}`}
    >
      <RotateCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
      <span>{isRetrying ? 'Retrying...' : 'Retry'}</span>
    </button>
  );
};
