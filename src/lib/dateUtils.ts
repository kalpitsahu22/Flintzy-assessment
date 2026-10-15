import {
  format,
  isToday,
  isTomorrow,
  isYesterday,
  startOfDay,
  parseISO,
  isValid,
} from 'date-fns';
import { SocialPost, PostDayGroup } from '../types/post';

/**
 * Gets the user's local IANA timezone name.
 */
export function getLocalTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

/**
 * Parses a UTC ISO string safely into a Date object.
 */
export function parseUtcDate(isoString: string): Date {
  const parsed = parseISO(isoString);
  return isValid(parsed) ? parsed : new Date(NaN);
}

/**
 * Converts a local datetime-local input string (YYYY-MM-DDTHH:mm) or Date to UTC ISO 8601 string ending in Z.
 */
export function localToUtcIso(localInput: string | Date): string {
  const date = typeof localInput === 'string' ? new Date(localInput) : localInput;
  if (!isValid(date)) {
    throw new Error('Invalid date input provided');
  }
  return date.toISOString();
}

/**
 * Converts a Date object or ISO string to local input value (YYYY-MM-DDTHH:mm) for datetime-local picker.
 */
export function toDatetimeLocalValue(date: Date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Formats a UTC ISO string into the user's local time (e.g., "10:30 AM").
 */
export function formatLocalTime(isoString: string): string {
  const date = parseUtcDate(isoString);
  if (!isValid(date)) return 'Invalid time';
  return format(date, 'h:mm a');
}

/**
 * Formats a UTC ISO string into readable local date (e.g., "Thursday, October 22, 2026").
 */
export function formatLocalDate(isoString: string): string {
  const date = parseUtcDate(isoString);
  if (!isValid(date)) return 'Invalid date';
  return format(date, 'EEEE, MMMM d, yyyy');
}

/**
 * Formats a UTC ISO string with both date and time plus timezone label.
 */
export function formatLocalDateTime(isoString: string): string {
  const date = parseUtcDate(isoString);
  if (!isValid(date)) return 'Invalid date';
  return `${format(date, 'MMM d, yyyy · h:mm a')}`;
}

/**
 * Determines the group label for a post in the user's local calendar day.
 * Returns "Today", "Tomorrow", "Yesterday" (for past posts), or formatted "EEEE, MMMM d".
 */
export function getDayGroupInfo(date: Date): { key: string; label: string; dateStart: number } {
  const start = startOfDay(date).getTime();
  const key = format(date, 'yyyy-MM-dd');

  if (isToday(date)) {
    return { key, label: 'Today', dateStart: start };
  }
  if (isTomorrow(date)) {
    return { key, label: 'Tomorrow', dateStart: start };
  }
  if (isYesterday(date)) {
    return { key, label: 'Yesterday', dateStart: start };
  }

  // Future or past dates: "Thursday, October 22" (add year if not current year)
  const isCurrentYear = date.getFullYear() === new Date().getFullYear();
  const label = format(date, isCurrentYear ? 'EEEE, MMMM d' : 'EEEE, MMMM d, yyyy');
  return { key, label, dateStart: start };
}

/**
 * Groups an array of posts by local calendar day and sorts:
 * 1. Groups chronologically by day
 * 2. Posts within each day chronologically by scheduledAt
 */
export function groupPostsByDay(posts: SocialPost[]): PostDayGroup[] {
  const groupsMap = new Map<string, { label: string; dateStr: string; timestamp: number; posts: SocialPost[] }>();

  posts.forEach((post) => {
    const postDate = parseUtcDate(post.scheduledAt);
    if (!isValid(postDate)) return;

    const { key, label, dateStart } = getDayGroupInfo(postDate);

    if (!groupsMap.has(key)) {
      groupsMap.set(key, {
        label,
        dateStr: key,
        timestamp: dateStart,
        posts: [],
      });
    }

    groupsMap.get(key)!.posts.push(post);
  });

  // Convert to array and sort groups chronologically
  const sortedGroups = Array.from(groupsMap.entries())
    .map(([id, group]) => {
      // Sort posts chronologically within the group
      const sortedPosts = [...group.posts].sort(
        (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
      );
      return {
        id,
        label: group.label,
        dateStr: group.dateStr,
        timestamp: group.timestamp,
        posts: sortedPosts,
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(({ id, label, dateStr, posts }) => ({
      id,
      label,
      dateStr,
      posts,
    }));

  return sortedGroups;
}
