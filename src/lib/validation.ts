import { SocialPlatform } from '../types/post';
import { PLATFORM_CONFIG } from './platformConfig';

/**
 * Counts Unicode code points in a string.
 * This properly handles UTF-16 surrogate pairs (such as emojis and supplementary symbols)
 * so that an emoji like "🚀" counts as 1 character rather than 2.
 */
export function countCodePoints(text: string): number {
  if (!text) return 0;
  return Array.from(text).length;
}

export interface PlatformValidationDetail {
  platform: SocialPlatform;
  count: number;
  limit: number;
  remaining: number;
  isValid: boolean;
  isWarning: boolean;
}

export type PlatformValidationMap = Record<SocialPlatform, PlatformValidationDetail>;

/**
 * Validates content against character limits for given platforms.
 */
export function validateCharacterLimits(
  content: string,
  platforms: SocialPlatform[]
): PlatformValidationMap {
  const count = countCodePoints(content);

  const result = {} as PlatformValidationMap;

  (Object.keys(PLATFORM_CONFIG) as SocialPlatform[]).forEach((platform) => {
    const limit = PLATFORM_CONFIG[platform].characterLimit;
    const remaining = limit - count;
    const isSelected = platforms.includes(platform);
    
    // Warning threshold: under 10% remaining or under 20 chars
    const warningThreshold = Math.min(limit * 0.1, 20);
    const isWarning = isSelected && remaining >= 0 && remaining <= warningThreshold;

    result[platform] = {
      platform,
      count,
      limit,
      remaining,
      isValid: remaining >= 0,
      isWarning,
    };
  });

  return result;
}

/**
 * Returns true if the content is valid for all selected platforms.
 */
export function isContentValidForPlatforms(
  content: string,
  platforms: SocialPlatform[]
): boolean {
  if (platforms.length === 0) return false;
  const validation = validateCharacterLimits(content, platforms);
  return platforms.every((platform) => validation[platform].isValid);
}

/**
 * Checks if a given timestamp or Date is strictly in the future.
 */
export function isFutureDate(date: Date | string | number): boolean {
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return false;
  return parsed.getTime() > Date.now();
}

/**
 * Validates a web URL format (must be http or https).
 */
export function isValidUrl(urlString: string): boolean {
  if (!urlString || !urlString.trim()) return true; // optional
  try {
    const url = new URL(urlString.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
