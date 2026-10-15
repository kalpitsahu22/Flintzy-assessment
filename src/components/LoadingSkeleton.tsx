import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse" aria-busy="true" aria-label="Loading posts queue">
      {/* Metric cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-20 bg-slate-200 rounded"></div>
              <div className="w-8 h-8 rounded-lg bg-slate-100"></div>
            </div>
            <div className="h-8 w-16 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* Filter toolbar skeleton */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="h-10 w-full md:w-80 bg-slate-100 rounded-lg"></div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="h-10 w-28 bg-slate-100 rounded-lg"></div>
          <div className="h-10 w-28 bg-slate-100 rounded-lg"></div>
        </div>
      </div>

      {/* Day group 1 skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-6 w-24 bg-slate-300 rounded"></div>
          <div className="h-5 w-12 bg-slate-200 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-slate-200"></div>
                  <div className="w-5 h-5 rounded-full bg-slate-200"></div>
                </div>
                <div className="h-5 w-20 bg-slate-200 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                <div className="h-3 w-28 bg-slate-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Day group 2 skeleton */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-3">
          <div className="h-6 w-32 bg-slate-300 rounded"></div>
          <div className="h-5 w-12 bg-slate-200 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[4, 5].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-5 h-5 rounded-full bg-slate-200"></div>
                <div className="h-5 w-20 bg-slate-200 rounded-full"></div>
              </div>
              <div className="h-32 bg-slate-100 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
