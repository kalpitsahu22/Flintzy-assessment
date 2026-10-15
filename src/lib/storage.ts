import { SocialPost } from '../types/post';
import { generateSeedPosts } from '../data/mockPosts';

const STORAGE_KEY = 'flintzy_scheduled_posts_v1';

/**
 * Loads posts from localStorage.
 * If no posts exist or the stored JSON is malformed, initializes storage
 * with dynamic seed posts and returns them.
 */
export function loadStoredPosts(): SocialPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initialSeed = generateSeedPosts();
      saveStoredPosts(initialSeed);
      return initialSeed;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initialSeed = generateSeedPosts();
      saveStoredPosts(initialSeed);
      return initialSeed;
    }

    // Basic integrity validation: ensure each post has id, content, platforms, scheduledAt, status
    const isValidPost = (p: unknown): p is SocialPost => {
      return (
        typeof p === 'object' &&
        p !== null &&
        typeof (p as SocialPost).id === 'string' &&
        typeof (p as SocialPost).content === 'string' &&
        Array.isArray((p as SocialPost).platforms) &&
        typeof (p as SocialPost).scheduledAt === 'string' &&
        typeof (p as SocialPost).status === 'string'
      );
    };

    const validPosts = parsed.filter(isValidPost);
    if (validPosts.length === 0) {
      const initialSeed = generateSeedPosts();
      saveStoredPosts(initialSeed);
      return initialSeed;
    }

    return validPosts;
  } catch (error) {
    console.warn('Failed to parse localStorage posts, falling back to seed data:', error);
    const initialSeed = generateSeedPosts();
    try {
      saveStoredPosts(initialSeed);
    } catch {
      // Ignore write error if storage is completely blocked
    }
    return initialSeed;
  }
}

/**
 * Saves posts to localStorage safely.
 */
export function saveStoredPosts(posts: SocialPost[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error('Failed to save posts to localStorage:', error);
  }
}

/**
 * Clears localStorage and resets back to freshly generated seed posts.
 */
export function resetStoredPosts(): SocialPost[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore error
  }
  const freshSeed = generateSeedPosts();
  saveStoredPosts(freshSeed);
  return freshSeed;
}
