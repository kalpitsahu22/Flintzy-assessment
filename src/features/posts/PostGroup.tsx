import React from 'react';
import { PostDayGroup, SocialPost } from '../../types/post';
import { PostCard } from './PostCard';

interface PostGroupProps {
  group: PostDayGroup;
  isRetrying: (postId: string) => boolean;
  onRetry: (postId: string) => void;
  onDelete: (postId: string) => void;
  onEdit: (post: SocialPost) => void;
}

export const PostGroup: React.FC<PostGroupProps> = ({
  group,
  isRetrying,
  onRetry,
  onDelete,
  onEdit,
}) => {
  const isTodayGroup = group.label === 'Today';
  const isTomorrowGroup = group.label === 'Tomorrow';

  return (
    <section className="relative pl-6 sm:pl-8 space-y-4" aria-label={`Posts for ${group.label}`}>
      {/* Timeline vertical connector line */}
      <div className="absolute left-2.5 sm:left-3 top-3 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500/40 via-slate-200 to-slate-200" />

      {/* Timeline group node marker & Heading */}
      <div className="flex items-center gap-3 relative -left-6 sm:-left-8">
        <div
          className={`w-5 sm:w-6 h-5 sm:h-6 rounded-full flex items-center justify-center border-2 bg-white shadow-xs z-10 ${
            isTodayGroup
              ? 'border-indigo-600 text-indigo-600 ring-4 ring-indigo-50'
              : isTomorrowGroup
              ? 'border-blue-500 text-blue-500'
              : 'border-slate-400 text-slate-500'
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isTodayGroup
                ? 'bg-indigo-600'
                : isTomorrowGroup
                ? 'bg-blue-500'
                : 'bg-slate-400'
            }`}
          />
        </div>

        <div className="flex items-center gap-2.5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{group.label}</span>
            {isTodayGroup && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-700">
                Current Day
              </span>
            )}
          </h2>
          <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200/80 px-2.5 py-0.5 rounded-full shadow-xs">
            {group.posts.length} {group.posts.length === 1 ? 'post' : 'posts'}
          </span>
        </div>
      </div>

      {/* Group Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-1">
        {group.posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            isRetrying={isRetrying(post.id)}
            onRetry={onRetry}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </section>
  );
};
