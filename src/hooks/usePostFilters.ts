import { useState, useEffect, useCallback, useMemo } from 'react';
import { SocialPost, PlatformFilter, StatusFilter, PostFilterState, SocialPlatform, PostStatus } from '../types/post';

const VALID_PLATFORMS: SocialPlatform[] = ['facebook', 'instagram', 'x', 'tiktok'];
const VALID_STATUSES: PostStatus[] = ['scheduled', 'published', 'failed'];

/**
 * Parses URL query parameters into strongly typed filter state.
 */
function parseUrlFilters(): PostFilterState {
  if (typeof window === 'undefined') {
    return { platform: 'all', status: 'all', search: '' };
  }

  const params = new URLSearchParams(window.location.search);
  const platformParam = params.get('platform');
  const statusParam = params.get('status');
  const searchParam = params.get('search') || '';

  const platform: PlatformFilter =
    platformParam && VALID_PLATFORMS.includes(platformParam as SocialPlatform)
      ? (platformParam as SocialPlatform)
      : 'all';

  const status: StatusFilter =
    statusParam && VALID_STATUSES.includes(statusParam as PostStatus)
      ? (statusParam as PostStatus)
      : 'all';

  return {
    platform,
    status,
    search: searchParam,
  };
}

/**
 * Updates URL search params without page reload, keeping history clean.
 */
function syncUrlWithFilters(filters: PostFilterState, isSearchTyping: boolean = false): void {
  if (typeof window === 'undefined') return;

  const currentParams = new URLSearchParams(window.location.search);

  // Platform
  if (filters.platform !== 'all') {
    currentParams.set('platform', filters.platform);
  } else {
    currentParams.delete('platform');
  }

  // Status
  if (filters.status !== 'all') {
    currentParams.set('status', filters.status);
  } else {
    currentParams.delete('status');
  }

  // Search
  if (filters.search.trim()) {
    currentParams.set('search', filters.search.trim());
  } else {
    currentParams.delete('search');
  }

  const queryString = currentParams.toString();
  const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

  // Use replaceState during search typing or when updating to prevent polluting back button history
  if (isSearchTyping || newUrl === `${window.location.pathname}${window.location.search}`) {
    window.history.replaceState(null, '', newUrl);
  } else {
    window.history.pushState(null, '', newUrl);
  }
}

export function usePostFilters(posts: SocialPost[]) {
  const [filters, setFilters] = useState<PostFilterState>(parseUrlFilters);

  // Synchronize from browser popstate (back / forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      setFilters(parseUrlFilters());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setPlatform = useCallback((platform: PlatformFilter) => {
    setFilters((prev) => {
      const next = { ...prev, platform };
      syncUrlWithFilters(next, false);
      return next;
    });
  }, []);

  const setStatus = useCallback((status: StatusFilter) => {
    setFilters((prev) => {
      const next = { ...prev, status };
      syncUrlWithFilters(next, false);
      return next;
    });
  }, []);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => {
      const next = { ...prev, search };
      syncUrlWithFilters(next, true);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    const reset: PostFilterState = {
      platform: 'all',
      status: 'all',
      search: '',
    };
    setFilters(reset);
    syncUrlWithFilters(reset, false);
  }, []);

  // Filter posts based on active filters
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // 1. Platform filter: matches if post's platforms array includes selected platform
      if (filters.platform !== 'all' && !post.platforms.includes(filters.platform)) {
        return false;
      }

      // 2. Status filter: matches if status equals selected status
      if (filters.status !== 'all' && post.status !== filters.status) {
        return false;
      }

      // 3. Search filter: case-insensitive search across post content
      if (filters.search.trim()) {
        const query = filters.search.trim().toLowerCase();
        const contentMatch = post.content.toLowerCase().includes(query);
        const errorMatch = post.errorMessage?.toLowerCase().includes(query) ?? false;
        if (!contentMatch && !errorMatch) {
          return false;
        }
      }

      return true;
    });
  }, [posts, filters]);

  const isFiltered = filters.platform !== 'all' || filters.status !== 'all' || Boolean(filters.search.trim());

  const activeFilterCount =
    (filters.platform !== 'all' ? 1 : 0) +
    (filters.status !== 'all' ? 1 : 0) +
    (filters.search.trim() ? 1 : 0);

  return {
    filters,
    setPlatform,
    setStatus,
    setSearch,
    clearFilters,
    filteredPosts,
    isFiltered,
    activeFilterCount,
  };
}
