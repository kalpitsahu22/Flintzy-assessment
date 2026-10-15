import { describe, it, expect } from 'vitest';
import {
  countCodePoints,
  validateCharacterLimits,
  isContentValidForPlatforms,
  isFutureDate,
  isValidUrl,
} from '../lib/validation';
import { PLATFORM_CONFIG } from '../lib/platformConfig';

describe('Validation Utilities', () => {
  describe('Unicode Code Point Counting', () => {
    it('accurately counts standard ASCII characters', () => {
      expect(countCodePoints('Hello World')).toBe(11);
      expect(countCodePoints('')).toBe(0);
    });

    it('accurately counts emojis without double counting surrogate pairs', () => {
      // "🚀" is 2 bytes in UTF-16 surrogate pairs, but 1 Unicode code point
      expect(countCodePoints('🚀')).toBe(1);
      expect(countCodePoints('Launch 🚀 now!')).toBe(13);
      expect(countCodePoints('🔥✨🎉')).toBe(3);
    });

    it('handles accented and non-Latin unicode characters', () => {
      expect(countCodePoints('café')).toBe(4);
      expect(countCodePoints('こんにちは')).toBe(5);
    });
  });

  describe('Platform Character Limits', () => {
    it('validates X (Twitter) 280 character limit', () => {
      const underLimit = 'a'.repeat(280);
      const overLimit = 'a'.repeat(281);

      const validResult = validateCharacterLimits(underLimit, ['x']);
      expect(validResult.x.isValid).toBe(true);
      expect(validResult.x.remaining).toBe(0);

      const invalidResult = validateCharacterLimits(overLimit, ['x']);
      expect(invalidResult.x.isValid).toBe(false);
      expect(invalidResult.x.remaining).toBe(-1);
    });

    it('validates Instagram and TikTok 2200 character limit', () => {
      const content = 'a'.repeat(2200);
      const result = validateCharacterLimits(content, ['instagram', 'tiktok']);
      expect(result.instagram.isValid).toBe(true);
      expect(result.tiktok.isValid).toBe(true);
      expect(result.instagram.remaining).toBe(0);

      const overLimit = 'a'.repeat(2201);
      const overResult = validateCharacterLimits(overLimit, ['instagram', 'tiktok']);
      expect(overResult.instagram.isValid).toBe(false);
      expect(overResult.tiktok.isValid).toBe(false);
    });

    it('validates Facebook 5000 character limit', () => {
      const content = 'a'.repeat(5000);
      const result = validateCharacterLimits(content, ['facebook']);
      expect(result.facebook.isValid).toBe(true);
      expect(result.facebook.limit).toBe(PLATFORM_CONFIG.facebook.characterLimit);

      const overLimit = 'a'.repeat(5001);
      const overResult = validateCharacterLimits(overLimit, ['facebook']);
      expect(overResult.facebook.isValid).toBe(false);
    });

    it('validates multiple platforms simultaneously and flags the exceeded one', () => {
      // 300 characters is valid for Instagram, TikTok, and Facebook, but invalid for X
      const text300 = 'a'.repeat(300);
      const platforms = ['x', 'instagram', 'facebook'] as const;
      const result = validateCharacterLimits(text300, [...platforms]);

      expect(result.x.isValid).toBe(false);
      expect(result.instagram.isValid).toBe(true);
      expect(result.facebook.isValid).toBe(true);

      expect(isContentValidForPlatforms(text300, [...platforms])).toBe(false);
    });

    it('returns false for isContentValidForPlatforms if no platforms are selected', () => {
      expect(isContentValidForPlatforms('Valid text', [])).toBe(false);
    });
  });

  describe('Future Date Validation', () => {
    it('accepts dates in the future', () => {
      const futureDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour ahead
      expect(isFutureDate(futureDate)).toBe(true);
      expect(isFutureDate(futureDate.toISOString())).toBe(true);
    });

    it('rejects past dates', () => {
      const pastDate = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
      expect(isFutureDate(pastDate)).toBe(false);
      expect(isFutureDate(pastDate.toISOString())).toBe(false);
    });

    it('rejects invalid date strings', () => {
      expect(isFutureDate('invalid-date-string')).toBe(false);
    });
  });

  describe('URL Validation', () => {
    it('accepts valid http and https URLs', () => {
      expect(isValidUrl('https://images.unsplash.com/photo-1')).toBe(true);
      expect(isValidUrl('http://example.com/image.png')).toBe(true);
    });

    it('accepts empty or whitespace string as optional URL', () => {
      expect(isValidUrl('')).toBe(true);
      expect(isValidUrl('   ')).toBe(true);
    });

    it('rejects invalid or non-http URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('ftp://example.com/file')).toBe(false);
      expect(isValidUrl('javascript:alert(1)')).toBe(false);
    });
  });
});
