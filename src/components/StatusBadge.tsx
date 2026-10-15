import React from 'react';
import { PostStatus } from '../types/post';
import { Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface StatusBadgeProps {
  status: PostStatus;
  isRetrying?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  isRetrying = false,
  className = '',
  size = 'md',
}) => {
  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs gap-1 font-medium'
      : 'px-2.5 py-1 text-xs gap-1.5 font-semibold';

  if (isRetrying) {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 animate-pulse ${sizeClasses} ${className}`}
      >
        <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
        Retrying...
      </span>
    );
  }

  switch (status) {
    case 'scheduled':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 ${sizeClasses} ${className}`}
        >
          <Clock className="w-3 h-3 text-blue-500" />
          Scheduled
        </span>
      );
    case 'published':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClasses} ${className}`}
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Published
        </span>
      );
    case 'failed':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 ${sizeClasses} ${className}`}
        >
          <AlertCircle className="w-3 h-3 text-rose-600" />
          Failed
        </span>
      );
  }
};
