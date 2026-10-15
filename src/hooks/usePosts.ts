import { useState, useEffect, useCallback, useMemo } from 'react';
import { SocialPost, CreatePostInput, UpdatePostInput, DashboardMetrics } from '../types/post';
import { postService } from '../services/postService';
import toast from 'react-hot-toast';

export function usePosts() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await postService.getPosts();
      setPosts(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load posts';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const createPost = useCallback(async (input: CreatePostInput): Promise<SocialPost> => {
    try {
      const newPost = await postService.createPost(input);
      setPosts((prev) => [newPost, ...prev]);
      toast.success('Post successfully scheduled!');
      return newPost;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create post';
      toast.error(message);
      throw err;
    }
  }, []);

  const updatePost = useCallback(
    async (postId: string, input: UpdatePostInput): Promise<SocialPost> => {
      try {
        const updated = await postService.updatePost(postId, input);
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? updated : p))
        );
        toast.success('Post updated and rescheduled!');
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update post';
        toast.error(message);
        throw err;
      }
    },
    []
  );

  const deletePost = useCallback(async (postId: string): Promise<void> => {
    try {
      await postService.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success('Post deleted successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete post';
      toast.error(message);
      throw err;
    }
  }, []);

  const resetAllPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const fresh = await postService.resetAll();
      setPosts(fresh);
      toast.success('Reset queue to initial sample dataset');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reset posts';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Optimistically updates a post in local state
   */
  const updatePostOptimistically = useCallback(
    (postId: string, updater: (post: SocialPost) => SocialPost) => {
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? updater(p) : p))
      );
    },
    []
  );

  /**
   * Sets a post directly in local state
   */
  const setPostDirectly = useCallback((postId: string, updatedPost: SocialPost) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? updatedPost : p))
    );
  }, []);

  // Compute summary metrics derived from the total post collection
  const metrics: DashboardMetrics = useMemo(() => {
    return posts.reduce(
      (acc, post) => {
        acc.total += 1;
        if (post.status === 'scheduled') acc.scheduled += 1;
        else if (post.status === 'published') acc.published += 1;
        else if (post.status === 'failed') acc.failed += 1;
        return acc;
      },
      { total: 0, scheduled: 0, published: 0, failed: 0 }
    );
  }, [posts]);

  return {
    posts,
    isLoading,
    error,
    metrics,
    reload: fetchPosts,
    createPost,
    updatePost,
    deletePost,
    resetAllPosts,
    updatePostOptimistically,
    setPostDirectly,
  };
}
