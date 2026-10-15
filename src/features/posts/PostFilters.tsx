import React from 'react';
import { PlatformFilter, StatusFilter, PostFilterState } from '../../types/post';
import { PlatformIcon } from '../../components/PlatformIcon';
import { PostSearch } from './PostSearch';
import { Filter, RotateCcw } from 'lucide-react';

interface PostFiltersProps {
  filters: PostFilterState;
  onPlatformChange: (platform: PlatformFilter) => void;
  onStatusChange: (status: StatusFilter) => void;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
  isFiltered: boolean;
  totalCount: number;
  filteredCount: number;
}

const PLATFORMS: { id: PlatformFilter; label: string }[] = [
  { id: 'all', label: 'All Platforms' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'x', label: 'X' },
  { id: 'tiktok', label: 'TikTok' },
];

const STATUSES: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'All Statuses' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'published', label: 'Published' },
  { id: 'failed', label: 'Failed' },
];

export const PostFilters: React.FC<PostFiltersProps> = ({
  filters,
  onPlatformChange,
  onStatusChange,
  onSearchChange,
  onClearFilters,
  isFiltered,
  totalCount,
  filteredCount,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 space-y-4 shadow-card">
      {/* Top row: Search input and Status selector */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <PostSearch
          value={filters.search}
          onChange={onSearchChange}
          className="w-full sm:max-w-md"
        />

        <div className="flex items-center gap-2.5 self-end sm:self-auto w-full sm:w-auto">
          {/* Status select dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={filters.status}
              onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
              aria-label="Filter posts by status"
              className="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors cursor-pointer"
            >
              {STATUSES.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
              <Filter className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Clear filters button */}
          {isFiltered && (
            <button
              type="button"
              onClick={onClearFilters}
              title="Reset all filters and search"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 transition-colors whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom row: Platform Filter Chips & Results Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
        {/* Platform chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {PLATFORMS.map((platform) => {
            const isSelected = filters.platform === platform.id;
            return (
              <button
                key={platform.id}
                type="button"
                onClick={() => onPlatformChange(platform.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/70'
                }`}
              >
                {platform.id !== 'all' && (
                  <PlatformIcon platform={platform.id} size="sm" />
                )}
                <span>{platform.label}</span>
              </button>
            );
          })}
        </div>

        {/* Counter indicator */}
        <div className="text-xs text-slate-500 font-medium self-end sm:self-auto">
          Showing <span className="font-semibold text-slate-900">{filteredCount}</span> of{' '}
          <span className="font-semibold text-slate-900">{totalCount}</span> posts
          {isFiltered && <span className="text-indigo-600 ml-1 font-medium">(Filtered)</span>}
        </div>
      </div>
    </div>
  );
};
