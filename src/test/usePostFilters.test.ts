import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePostFilters } from '../hooks/usePostFilters';
import { SocialPost } from '../types/post';

const SAMPLE_POSTS: SocialPost[] = [
  {
    id: '1',
    content: 'Discover the new product launch and features',
    platforms: ['instagram', 'facebook'],
    scheduledAt: '2027-01-15T10:00:00.000Z',
    status: 'scheduled',
    createdAt: '2027-01-10T08:00:00.000Z',
  },
  {
    id: '2',
    content: 'Quick tweet on X about coding tips',
    platforms: ['x'],
    scheduledAt: '2027-01-15T14:00:00.000Z',
    status: 'published',
    createdAt: '2027-01-10T09:00:00.000Z',
  },
  {
    id: '3',
    content: 'Behind the scenes TikTok video tutorial',
    platforms: ['tiktok'],
    scheduledAt: '2027-01-16T12:00:00.000Z',
    status: 'failed',
    errorMessage: 'Upload rate limit exceeded',
    createdAt: '2027-01-10T10:00:00.000Z',
  },
];

describe('usePostFilters Hook', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('initializes with all posts when no filters are set', () => {
    const { result } = renderHook(() => usePostFilters(SAMPLE_POSTS));
    expect(result.current.filteredPosts.length).toBe(3);
    expect(result.current.isFiltered).toBe(false);
  });

  it('filters posts by platform', () => {
    const { result } = renderHook(() => usePostFilters(SAMPLE_POSTS));

    act(() => {
      result.current.setPlatform('x');
    });

    expect(result.current.filteredPosts.length).toBe(1);
    expect(result.current.filteredPosts[0].id).toBe('2');
    expect(result.current.isFiltered).toBe(true);
  });

  it('filters posts by status', () => {
    const { result } = renderHook(() => usePostFilters(SAMPLE_POSTS));

    act(() => {
      result.current.setStatus('failed');
    });

    expect(result.current.filteredPosts.length).toBe(1);
    expect(result.current.filteredPosts[0].id).toBe('3');
    expect(result.current.isFiltered).toBe(true);
  });

  it('performs case-insensitive search across post content and error messages', () => {
    const { result } = renderHook(() => usePostFilters(SAMPLE_POSTS));

    act(() => {
      result.current.setSearch('LAUNCH');
    });

    expect(result.current.filteredPosts.length).toBe(1);
    expect(result.current.filteredPosts[0].id).toBe('1');

    // Search by error message
    act(() => {
      result.current.setSearch('rate limit');
    });

    expect(result.current.filteredPosts.length).toBe(1);
    expect(result.current.filteredPosts[0].id).toBe('3');
  });

  it('combines platform, status, and search filters together', () => {
    const { result } = renderHook(() => usePostFilters(SAMPLE_POSTS));

    act(() => {
      result.current.setPlatform('instagram');
      result.current.setStatus('scheduled');
      result.current.setSearch('discover');
    });

    expect(result.current.filteredPosts.length).toBe(1);
    expect(result.current.filteredPosts[0].id).toBe('1');

    // Change status to published -> should yield 0 results
    act(() => {
      result.current.setStatus('published');
    });

    expect(result.current.filteredPosts.length).toBe(0);
  });

  it('clears all filters back to default state', () => {
    const { result } = renderHook(() => usePostFilters(SAMPLE_POSTS));

    act(() => {
      result.current.setPlatform('x');
      result.current.setStatus('published');
      result.current.setSearch('tweet');
    });

    expect(result.current.isFiltered).toBe(true);

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters.platform).toBe('all');
    expect(result.current.filters.status).toBe('all');
    expect(result.current.filters.search).toBe('');
    expect(result.current.filteredPosts.length).toBe(3);
    expect(result.current.isFiltered).toBe(false);
  });
});
