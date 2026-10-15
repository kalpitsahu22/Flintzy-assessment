import React from 'react';
import { Plus, Sparkles, Globe, RotateCcw } from 'lucide-react';
import { getLocalTimeZone } from '../../lib/dateUtils';

interface DashboardHeaderProps {
  onCreatePost: () => void;
  onResetData: () => void;
  totalPosts: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onCreatePost,
  onResetData,
  totalPosts,
}) => {
  const localTz = getLocalTimeZone();

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & title */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Flintzy</h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  Scheduler
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>Local Timezone:</span>
                <span className="font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                  {localTz}
                </span>
                <span className="text-slate-300">•</span>
                <span>{totalPosts} total queue items</span>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 sm:self-auto self-stretch">
            <button
              type="button"
              onClick={onResetData}
              title="Reset queue to 30+ default sample posts"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Reset Sample Data</span>
              <span className="sm:hidden">Reset</span>
            </button>

            <button
              type="button"
              onClick={onCreatePost}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-600/30 hover:shadow hover:shadow-indigo-600/40 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Post</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
