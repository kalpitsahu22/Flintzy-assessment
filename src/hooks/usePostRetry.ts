import { useState, useCallback } from 'react';
import { SocialPost, RetryStatus } from '../types/post';
import { postService } from '../services/postService';
import toast from 'react-hot-toast';

interface UsePostRetryOptions {
  posts: SocialPost[];
  updatePostOptimistically: (postId: string, updater: (post: SocialPost) => SocialPost) => void;
  setPostDirectly: (postId: string, post: SocialPost) => void;
}

export function usePostRetry({
  posts,
  updatePostOptimistically,
  setPostDirectly,
}: UsePostRetryOptions) {
  // Map of post ID to retry status ('idle' | 'retrying' | 'success' | 'error')
  const [retryStates, setRetryStates] = useState<Record<string, RetryStatus>>({});

  const isRetrying = useCallback(
    (postId: string) => retryStates[postId] === 'retrying',
    [retryStates]
  );

  const retryPost = useCallback(
    async (postId: string, forceOutcome?: 'success' | 'failure') => {
      // Prevent concurrent retries on the same post
      if (retryStates[postId] === 'retrying') {
        return;
      }

      // Capture snapshot of previous post state for rollback
      const previousPost = posts.find((p) => p.id === postId);
      if (!previousPost) {
        toast.error('Post not found in queue');
        return;
      }

      // 1. Mark as retrying
      setRetryStates((prev) => ({ ...prev, [postId]: 'retrying' }));

      // 2 & 3. Optimistic update: temporarily show as scheduled and clear error message
      updatePostOptimistically(postId, (current) => ({
        ...current,
        status: 'scheduled',
        errorMessage: undefined,
      }));

      try {
        // 5 & 6. Execute service call (1000ms delay, 80/20 outcome)
        const result = await postService.retryPost(postId, forceOutcome);

        if (result.success) {
          // 7. On success: update post state
          setPostDirectly(postId, result.post);
          setRetryStates((prev) => ({ ...prev, [postId]: 'success' }));
          toast.success('Post successfully rescheduled!');
        } else {
          // 8 & 9. On failure: roll back optimistic update and restore failed status with error message
          setPostDirectly(postId, result.post);
          setRetryStates((prev) => ({ ...prev, [postId]: 'error' }));
          toast.error(result.error || 'Retry failed. Upstream service rejected publication.');
        }
      } catch (err) {
        // Fallback rollback in case of unexpected exception
        const fallbackErrorMsg = err instanceof Error ? err.message : 'Unknown retry error';
        const rolledBackPost: SocialPost = {
          ...previousPost,
          status: 'failed',
          errorMessage: fallbackErrorMsg,
        };
        setPostDirectly(postId, rolledBackPost);
        setRetryStates((prev) => ({ ...prev, [postId]: 'error' }));
        toast.error(`Retry attempt failed: ${fallbackErrorMsg}`);
      } finally {
        // Clear retrying state after a brief visual confirmation delay
        setTimeout(() => {
          setRetryStates((prev) => {
            const next = { ...prev };
            delete next[postId];
            return next;
          });
        }, 1200);
      }
    },
    [posts, retryStates, updatePostOptimistically, setPostDirectly]
  );

  return {
    retryPost,
    isRetrying,
    retryStates,
  };
}
