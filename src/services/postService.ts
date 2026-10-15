import { SocialPost, CreatePostInput, UpdatePostInput } from '../types/post';
import { loadStoredPosts, saveStoredPosts, resetStoredPosts } from '../lib/storage';

const SIMULATED_DELAY_MS = 350;
const RETRY_DELAY_MS = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface RetryResult {
  success: boolean;
  post: SocialPost;
  error?: string;
}

export const postService = {
  /**
   * Fetches all posts from local storage with simulated network latency.
   */
  async getPosts(): Promise<SocialPost[]> {
    await sleep(SIMULATED_DELAY_MS);
    return loadStoredPosts();
  },

  /**
   * Creates a new scheduled post.
   */
  async createPost(input: CreatePostInput): Promise<SocialPost> {
    await sleep(SIMULATED_DELAY_MS);

    const currentPosts = loadStoredPosts();
    const newPost: SocialPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      content: input.content.trim(),
      platforms: [...input.platforms],
      mediaUrl: input.mediaUrl?.trim() || undefined,
      scheduledAt: input.scheduledAt,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };

    const updated = [newPost, ...currentPosts];
    saveStoredPosts(updated);
    return newPost;
  },

  /**
   * Updates an existing scheduled or failed post.
   * If the post was previously failed, saving updates reschedules it to 'scheduled' and clears the error message.
   */
  async updatePost(postId: string, input: UpdatePostInput): Promise<SocialPost> {
    await sleep(SIMULATED_DELAY_MS);

    const currentPosts = loadStoredPosts();
    const index = currentPosts.findIndex((p) => p.id === postId);

    if (index === -1) {
      throw new Error(`Post with id "${postId}" not found`);
    }

    const existingPost = currentPosts[index];

    const updatedPost: SocialPost = {
      ...existingPost,
      content: input.content.trim(),
      platforms: [...input.platforms],
      mediaUrl: input.mediaUrl?.trim() || undefined,
      scheduledAt: input.scheduledAt,
      status: 'scheduled',
      errorMessage: undefined,
    };

    const updatedPosts = [...currentPosts];
    updatedPosts[index] = updatedPost;
    saveStoredPosts(updatedPosts);
    return updatedPost;
  },

  /**
   * Retries publishing a failed post.
   * Simulates a 1,000 ms delay with an 80% success and 20% failure probability.
   *
   * @param postId ID of the post to retry
   * @param forceOutcome Optional flag for deterministic testing ('success' | 'failure')
   */
  async retryPost(
    postId: string,
    forceOutcome?: 'success' | 'failure'
  ): Promise<RetryResult> {
    await sleep(RETRY_DELAY_MS);

    const currentPosts = loadStoredPosts();
    const targetPost = currentPosts.find((p) => p.id === postId);

    if (!targetPost) {
      throw new Error(`Post with id "${postId}" not found`);
    }

    const isSuccess =
      forceOutcome !== undefined
        ? forceOutcome === 'success'
        : Math.random() < 0.8; // 80% success rate

    if (isSuccess) {
      const updatedPost: SocialPost = {
        ...targetPost,
        status: 'scheduled',
        errorMessage: undefined,
      };

      const updatedPosts = currentPosts.map((p) =>
        p.id === postId ? updatedPost : p
      );
      saveStoredPosts(updatedPosts);

      return {
        success: true,
        post: updatedPost,
      };
    } else {
      const retryErrorMessages = [
        'Retry rejected: Upstream social platform API is temporarily down for maintenance',
        'Retry rejected: Access token expired. Re-authorization required.',
        'Retry rejected: Platform media container transcoding failed.',
        'Retry rejected: Temporary connection reset by remote server (503 Service Unavailable)',
      ];
      const randomError =
        retryErrorMessages[Math.floor(Math.random() * retryErrorMessages.length)];

      const failedPost: SocialPost = {
        ...targetPost,
        status: 'failed',
        errorMessage: randomError,
      };

      const updatedPosts = currentPosts.map((p) =>
        p.id === postId ? failedPost : p
      );
      saveStoredPosts(updatedPosts);

      return {
        success: false,
        post: failedPost,
        error: randomError,
      };
    }
  },

  /**
   * Deletes a post by ID.
   */
  async deletePost(postId: string): Promise<void> {
    await sleep(200);
    const currentPosts = loadStoredPosts();
    const updated = currentPosts.filter((p) => p.id !== postId);
    saveStoredPosts(updated);
  },

  /**
   * Resets local storage to default fresh seed data.
   */
  async resetAll(): Promise<SocialPost[]> {
    await sleep(250);
    return resetStoredPosts();
  },
};
