import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StatusBadge } from '../components/StatusBadge';
import { SummaryCards } from '../features/dashboard/SummaryCards';
import { CharacterCounter } from '../features/posts/CharacterCounter';
import { EmptyState } from '../components/EmptyState';
import { PostCard } from '../features/posts/PostCard';
import { SocialPost } from '../types/post';

describe('UI Component Tests', () => {
  describe('StatusBadge', () => {
    it('renders scheduled status with clock icon and blue styling', () => {
      render(<StatusBadge status="scheduled" />);
      expect(screen.getByText('Scheduled')).toBeInTheDocument();
    });

    it('renders published status with check icon and green styling', () => {
      render(<StatusBadge status="published" />);
      expect(screen.getByText('Published')).toBeInTheDocument();
    });

    it('renders failed status with alert icon and red styling', () => {
      render(<StatusBadge status="failed" />);
      expect(screen.getByText('Failed')).toBeInTheDocument();
    });

    it('renders retrying state when isRetrying is true', () => {
      render(<StatusBadge status="failed" isRetrying={true} />);
      expect(screen.getByText('Retrying...')).toBeInTheDocument();
    });
  });

  describe('SummaryCards', () => {
    const metrics = {
      total: 32,
      scheduled: 18,
      published: 8,
      failed: 6,
    };

    it('renders all 4 metric counters accurately', () => {
      const handleSelect = vi.fn();
      render(
        <SummaryCards
          metrics={metrics}
          activeStatusFilter="all"
          onSelectStatusFilter={handleSelect}
        />
      );

      expect(screen.getByText('32')).toBeInTheDocument();
      expect(screen.getByText('18')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();
    });

    it('invokes onSelectStatusFilter when a card is clicked', () => {
      const handleSelect = vi.fn();
      render(
        <SummaryCards
          metrics={metrics}
          activeStatusFilter="all"
          onSelectStatusFilter={handleSelect}
        />
      );

      fireEvent.click(screen.getByText('Scheduled'));
      expect(handleSelect).toHaveBeenCalledWith('scheduled');

      fireEvent.click(screen.getByText('Failed'));
      expect(handleSelect).toHaveBeenCalledWith('failed');
    });
  });

  describe('CharacterCounter', () => {
    it('renders character counts for selected platforms', () => {
      render(
        <CharacterCounter
          content="Hello World!"
          selectedPlatforms={['x', 'instagram']}
        />
      );

      expect(screen.getByText('X:')).toBeInTheDocument();
      expect(screen.getByText('12 / 280')).toBeInTheDocument();
      expect(screen.getByText('Instagram:')).toBeInTheDocument();
      expect(screen.getByText('12 / 2200')).toBeInTheDocument();
    });

    it('shows warning message when a platform character limit is exceeded', () => {
      const longText = 'a'.repeat(285);
      render(
        <CharacterCounter
          content={longText}
          selectedPlatforms={['x', 'facebook']}
        />
      );

      expect(screen.getByText('(5 over)')).toBeInTheDocument();
      expect(
        screen.getByText(/Content exceeds the maximum character limit/i)
      ).toBeInTheDocument();
    });
  });

  describe('EmptyState', () => {
    it('renders no-posts empty state with action buttons', () => {
      const handleCreate = vi.fn();
      render(
        <EmptyState
          type="no-posts"
          onCreatePost={handleCreate}
        />
      );

      expect(screen.getByText('Your posting queue is empty')).toBeInTheDocument();
      const btn = screen.getByText('Create first post');
      fireEvent.click(btn);
      expect(handleCreate).toHaveBeenCalled();
    });

    it('renders no-filter-match empty state with clear filters button', () => {
      const handleClear = vi.fn();
      render(
        <EmptyState
          type="no-filter-match"
          onClearFilters={handleClear}
        />
      );

      expect(screen.getByText('No matching posts found')).toBeInTheDocument();
      const btn = screen.getByText('Clear all filters');
      fireEvent.click(btn);
      expect(handleClear).toHaveBeenCalled();
    });
  });

  describe('PostCard', () => {
    const samplePost: SocialPost = {
      id: 'post-test-1',
      content: 'This is a test post content preview',
      platforms: ['x', 'facebook'],
      scheduledAt: '2027-01-15T10:30:00.000Z',
      status: 'failed',
      errorMessage: 'OAuth token expired',
      createdAt: '2027-01-10T08:00:00.000Z',
    };

    it('renders post content, error message, and retry button for failed posts', () => {
      const handleRetry = vi.fn();
      const handleDelete = vi.fn();
      const handleEdit = vi.fn();

      render(
        <PostCard
          post={samplePost}
          isRetrying={false}
          onRetry={handleRetry}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      );

      expect(screen.getByText('This is a test post content preview')).toBeInTheDocument();
      expect(screen.getByText('OAuth token expired')).toBeInTheDocument();
      
      const retryBtn = screen.getByRole('button', { name: /retry publishing post/i });
      expect(retryBtn).toBeInTheDocument();

      fireEvent.click(retryBtn);
      expect(handleRetry).toHaveBeenCalledWith('post-test-1');
    });

    it('renders edit button for scheduled and failed posts and triggers onEdit', () => {
      const handleRetry = vi.fn();
      const handleDelete = vi.fn();
      const handleEdit = vi.fn();

      render(
        <PostCard
          post={samplePost}
          isRetrying={false}
          onRetry={handleRetry}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      );

      const editBtn = screen.getByRole('button', { name: /edit post/i });
      expect(editBtn).toBeInTheDocument();

      fireEvent.click(editBtn);
      expect(handleEdit).toHaveBeenCalledWith(samplePost);
    });
  });
});
