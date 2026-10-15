import { describe, it, expect, beforeEach } from 'vitest';
import { postService } from '../services/postService';
import { loadStoredPosts, saveStoredPosts } from '../lib/storage';
import { SocialPost } from '../types/post';

describe('Post Service & Storage Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Storage Initialization & Fallback', () => {
    it('initializes with at least 30 seed posts when storage is empty', () => {
      const posts = loadStoredPosts();
      expect(posts.length).toBeGreaterThanOrEqual(30);
    });

    it('gracefully recovers and returns seed posts if localStorage contains malformed JSON', () => {
      localStorage.setItem('flintzy_scheduled_posts_v1', '{ invalid json [');
      const posts = loadStoredPosts();
      expect(Array.isArray(posts)).toBe(true);
      expect(posts.length).toBeGreaterThanOrEqual(30);
    });
  });

  describe('CRUD Operations', () => {
    it('fetches posts using postService.getPosts()', async () => {
      const posts = await postService.getPosts();
      expect(Array.isArray(posts)).toBe(true);
      expect(posts.length).toBeGreaterThanOrEqual(30);
    });

    it('creates a new post, assigns scheduled status, and persists it', async () => {
      const newPost = await postService.createPost({
        content: 'Brand new scheduled post test',
        platforms: ['x', 'instagram'],
        scheduledAt: new Date(Date.now() + 5 * 3600 * 1000).toISOString(),
      });

      expect(newPost.id).toBeDefined();
      expect(newPost.content).toBe('Brand new scheduled post test');
      expect(newPost.status).toBe('scheduled');
      expect(newPost.platforms).toEqual(['x', 'instagram']);

      // Verify persistence
      const stored = loadStoredPosts();
      expect(stored[0].id).toBe(newPost.id);
    });

    it('updates an existing scheduled post and persists the changes', async () => {
      const posts = await postService.getPosts();
      const target = posts[0];
      const newFutureDate = new Date(Date.now() + 10 * 3600 * 1000).toISOString();

      const updated = await postService.updatePost(target.id, {
        content: 'Edited content for post',
        platforms: ['tiktok', 'x'],
        mediaUrl: 'https://images.unsplash.com/new-photo',
        scheduledAt: newFutureDate,
      });

      expect(updated.id).toBe(target.id);
      expect(updated.content).toBe('Edited content for post');
      expect(updated.platforms).toEqual(['tiktok', 'x']);
      expect(updated.mediaUrl).toBe('https://images.unsplash.com/new-photo');
      expect(updated.scheduledAt).toBe(newFutureDate);
      expect(updated.status).toBe('scheduled');

      // Check persistence
      const stored = loadStoredPosts();
      const found = stored.find((p) => p.id === target.id);
      expect(found?.content).toBe('Edited content for post');
      expect(found?.platforms).toEqual(['tiktok', 'x']);
    });

    it('updates a failed post, reschedules it, clears error message, and persists', async () => {
      // Seed a failed post
      const failedId = 'failed-edit-test';
      const initialFailed: SocialPost = {
        id: failedId,
        content: 'Initial failed text',
        platforms: ['facebook'],
        scheduledAt: new Date(Date.now() - 3600 * 1000).toISOString(),
        status: 'failed',
        errorMessage: 'Initial publishing failure',
        createdAt: new Date().toISOString(),
      };
      saveStoredPosts([initialFailed]);

      const newFutureTime = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
      const result = await postService.updatePost(failedId, {
        content: 'Corrected text ready for retry',
        platforms: ['facebook', 'instagram'],
        scheduledAt: newFutureTime,
      });

      expect(result.status).toBe('scheduled');
      expect(result.errorMessage).toBeUndefined();
      expect(result.content).toBe('Corrected text ready for retry');
      expect(result.platforms).toEqual(['facebook', 'instagram']);

      // Check persistence
      const stored = loadStoredPosts();
      expect(stored[0].status).toBe('scheduled');
      expect(stored[0].errorMessage).toBeUndefined();
    });

    it('deletes a post by ID and persists the removal', async () => {
      const posts = await postService.getPosts();
      const targetId = posts[0].id;

      await postService.deletePost(targetId);

      const afterDelete = await postService.getPosts();
      expect(afterDelete.some((p) => p.id === targetId)).toBe(false);
    });
  });

  describe('Deterministic Retry Behavior', () => {
    const failedPost: SocialPost = {
      id: 'test-failed-post',
      content: 'Failed post for retry test',
      platforms: ['facebook'],
      scheduledAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      status: 'failed',
      errorMessage: 'Initial publishing failure',
      createdAt: new Date().toISOString(),
    };

    beforeEach(() => {
      saveStoredPosts([failedPost]);
    });

    it('successfully reschedules post on successful retry outcome', async () => {
      const result = await postService.retryPost('test-failed-post', 'success');

      expect(result.success).toBe(true);
      expect(result.post.status).toBe('scheduled');
      expect(result.post.errorMessage).toBeUndefined();

      // Verify persisted state in localStorage
      const stored = loadStoredPosts();
      const updated = stored.find((p) => p.id === 'test-failed-post');
      expect(updated?.status).toBe('scheduled');
      expect(updated?.errorMessage).toBeUndefined();
    });

    it('rolls back and sets meaningful error message on failed retry outcome', async () => {
      const result = await postService.retryPost('test-failed-post', 'failure');

      expect(result.success).toBe(false);
      expect(result.post.status).toBe('failed');
      expect(result.post.errorMessage).toBeDefined();
      expect(result.error).toBeDefined();

      // Verify persisted state in localStorage
      const stored = loadStoredPosts();
      const updated = stored.find((p) => p.id === 'test-failed-post');
      expect(updated?.status).toBe('failed');
      expect(updated?.errorMessage).toBeDefined();
    });
  });
});
