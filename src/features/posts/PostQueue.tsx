import React, { useMemo } from 'react';
import { SocialPost } from '../../types/post';
import { groupPostsByDay } from '../../lib/dateUtils';
import { PostGroup } from './PostGroup';
import { EmptyState } from '../../components/EmptyState';

interface PostQueueProps {
  posts: SocialPost[];
  isFiltered: boolean;
  isRetrying: (postId: string) => boolean;
  onRetry: (postId: string) => void;
  onDelete: (postId: string) => void;
  onEdit: (post: SocialPost) => void;
  onCreatePost: () => void;
  onClearFilters: () => void;
  onResetData: () => void;
}

export const PostQueue: React.FC<PostQueueProps> = ({
  posts,
  isFiltered,
  isRetrying,
  onRetry,
  onDelete,
  onEdit,
  onCreatePost,
  onClearFilters,
  onResetData,
}) => {
  const groups = useMemo(() => groupPostsByDay(posts), [posts]);

  if (posts.length === 0) {
    return (
      <EmptyState
        type={isFiltered ? 'no-filter-match' : 'no-posts'}
        onCreatePost={onCreatePost}
        onClearFilters={onClearFilters}
        onResetSampleData={onResetData}
      />
    );
  }

  return (
    <div className="space-y-10 py-2">
      {groups.map((group) => (
        <PostGroup
          key={group.id}
          group={group}
          isRetrying={isRetrying}
          onRetry={onRetry}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};
