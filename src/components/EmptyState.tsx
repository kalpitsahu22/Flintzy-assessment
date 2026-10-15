import React from 'react';
import { Plus, FilterX, CalendarX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-posts' | 'no-filter-match';
  onCreatePost?: () => void;
  onClearFilters?: () => void;
  onResetSampleData?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  onCreatePost,
  onClearFilters,
  onResetSampleData,
}) => {
  if (type === 'no-filter-match') {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto my-8 shadow-sm">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FilterX className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">
          No matching posts found
        </h3>
        <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
          We couldn't find any posts matching your selected platform, status, or search query.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
        >
          <RotateCcw className="w-4 h-4" />
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto my-8 shadow-sm">
      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <CalendarX className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">
        Your posting queue is empty
      </h3>
      <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
        You don't have any scheduled or past posts. Schedule your first post or load the realistic 30+ sample dataset.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        {onCreatePost && (
          <button
            type="button"
            onClick={onCreatePost}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          >
            <Plus className="w-4 h-4" />
            Create first post
          </button>
        )}
        {onResetSampleData && (
          <button
            type="button"
            onClick={onResetSampleData}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <RotateCcw className="w-4 h-4" />
            Load sample posts (30+)
          </button>
        )}
      </div>
    </div>
  );
};
