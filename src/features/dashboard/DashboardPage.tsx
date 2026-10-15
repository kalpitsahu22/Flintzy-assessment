import React, { useState } from 'react';
import { usePosts } from '../../hooks/usePosts';
import { usePostFilters } from '../../hooks/usePostFilters';
import { usePostRetry } from '../../hooks/usePostRetry';
import { DashboardHeader } from './DashboardHeader';
import { SummaryCards } from './SummaryCards';
import { PostFilters } from '../posts/PostFilters';
import { PostQueue } from '../posts/PostQueue';
import { PostComposer } from '../posts/PostComposer';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { ErrorState } from '../../components/ErrorState';

import { SocialPost } from '../../types/post';

export const DashboardPage: React.FC = () => {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);

  const {
    posts,
    isLoading,
    error,
    metrics,
    reload,
    createPost,
    updatePost,
    deletePost,
    resetAllPosts,
    updatePostOptimistically,
    setPostDirectly,
  } = usePosts();

  const {
    filters,
    setPlatform,
    setStatus,
    setSearch,
    clearFilters,
    filteredPosts,
    isFiltered,
  } = usePostFilters(posts);

  const { retryPost, isRetrying } = usePostRetry({
    posts,
    updatePostOptimistically,
    setPostDirectly,
  });

  const handleOpenCreate = () => {
    setEditingPost(null);
    setIsComposerOpen(true);
  };

  const handleEditPost = (post: SocialPost) => {
    setEditingPost(post);
    setIsComposerOpen(true);
  };

  const handleCloseComposer = () => {
    setIsComposerOpen(false);
    setEditingPost(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <DashboardHeader
        onCreatePost={handleOpenCreate}
        onResetData={resetAllPosts}
        totalPosts={posts.length}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        {/* Metric summary cards */}
        <SummaryCards
          metrics={metrics}
          activeStatusFilter={filters.status}
          onSelectStatusFilter={setStatus}
        />

        {/* Filter toolbar */}
        <PostFilters
          filters={filters}
          onPlatformChange={setPlatform}
          onStatusChange={setStatus}
          onSearchChange={setSearch}
          onClearFilters={clearFilters}
          isFiltered={isFiltered}
          totalCount={posts.length}
          filteredCount={filteredPosts.length}
        />

        {/* Dynamic content area */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : (
          <PostQueue
            posts={filteredPosts}
            isFiltered={isFiltered}
            isRetrying={isRetrying}
            onRetry={retryPost}
            onDelete={deletePost}
            onEdit={handleEditPost}
            onCreatePost={handleOpenCreate}
            onClearFilters={clearFilters}
            onResetData={resetAllPosts}
          />
        )}
      </main>

      {/* Post Composer / Editor Modal */}
      <PostComposer
        isOpen={isComposerOpen}
        onClose={handleCloseComposer}
        onSubmit={createPost}
        initialPost={editingPost}
        onUpdate={updatePost}
      />
    </div>
  );
};
