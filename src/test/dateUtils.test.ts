import { describe, it, expect } from 'vitest';
import {
  localToUtcIso,
  parseUtcDate,
  formatLocalTime,
  formatLocalDate,
  getDayGroupInfo,
  groupPostsByDay,
} from '../lib/dateUtils';
import { SocialPost } from '../types/post';

describe('Date & Timezone Utilities', () => {
  describe('localToUtcIso', () => {
    it('converts a valid date to an ISO 8601 UTC string ending in Z', () => {
      const d = new Date('2027-05-15T14:30:00Z');
      const iso = localToUtcIso(d);
      expect(iso).toBe('2027-05-15T14:30:00.000Z');
      expect(iso.endsWith('Z')).toBe(true);
    });

    it('throws error for invalid date input', () => {
      expect(() => localToUtcIso('invalid-datetime')).toThrow();
    });
  });

  describe('parseUtcDate & Formatters', () => {
    it('parses valid ISO string to Date', () => {
      const date = parseUtcDate('2027-01-15T10:30:00.000Z');
      expect(date.getUTCFullYear()).toBe(2027);
      expect(date.getUTCMonth()).toBe(0); // January
      expect(date.getUTCDate()).toBe(15);
    });

    it('formats local time without crashing', () => {
      const formatted = formatLocalTime('2027-01-15T10:30:00.000Z');
      expect(typeof formatted).toBe('string');
      expect(formatted).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/i);
    });

    it('formats local date without crashing', () => {
      const formatted = formatLocalDate('2027-01-15T10:30:00.000Z');
      expect(typeof formatted).toBe('string');
      expect(formatted).toContain('2027');
    });
  });

  describe('getDayGroupInfo', () => {
    it('returns "Today" for current day', () => {
      const now = new Date();
      const info = getDayGroupInfo(now);
      expect(info.label).toBe('Today');
    });

    it('returns "Tomorrow" for the next day', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const info = getDayGroupInfo(tomorrow);
      expect(info.label).toBe('Tomorrow');
    });

    it('returns formatted date string for distant future dates', () => {
      const future = new Date('2028-10-22T10:00:00Z');
      const info = getDayGroupInfo(future);
      expect(info.label).toContain('October 22');
    });
  });

  describe('groupPostsByDay', () => {
    it('groups posts by day and sorts groups and posts chronologically', () => {
      const now = new Date();
      const todayPost1: SocialPost = {
        id: '1',
        content: 'Today afternoon',
        platforms: ['x'],
        scheduledAt: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
        status: 'scheduled',
        createdAt: now.toISOString(),
      };
      const todayPost2: SocialPost = {
        id: '2',
        content: 'Today morning',
        platforms: ['instagram'],
        scheduledAt: new Date(now.getTime() + 1 * 60 * 60 * 1000).toISOString(),
        status: 'scheduled',
        createdAt: now.toISOString(),
      };
      const tomorrowPost: SocialPost = {
        id: '3',
        content: 'Tomorrow post',
        platforms: ['facebook'],
        scheduledAt: new Date(now.getTime() + 26 * 60 * 60 * 1000).toISOString(),
        status: 'scheduled',
        createdAt: now.toISOString(),
      };

      const groups = groupPostsByDay([todayPost1, tomorrowPost, todayPost2]);

      expect(groups.length).toBe(2);
      expect(groups[0].label).toBe('Today');
      expect(groups[1].label).toBe('Tomorrow');

      // Check chronological sorting within the Today group
      expect(groups[0].posts[0].id).toBe('2'); // earlier post first
      expect(groups[0].posts[1].id).toBe('1'); // later post second
    });
  });
});
