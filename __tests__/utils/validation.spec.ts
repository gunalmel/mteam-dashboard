import {areAllNullOrEmpty, isAnyNotNullOrEmpty} from '@/app/utils/validation';

describe('Validation Utils', () => {
  describe('areAllNullOrEmpty', () => {
    it('should return true when all arguments are null, undefined, or empty strings', () => {
      expect(areAllNullOrEmpty(null, undefined, '')).toBe(true);
      expect(areAllNullOrEmpty('', '', '')).toBe(true);
      expect(areAllNullOrEmpty(null, null, null)).toBe(true);
      expect(areAllNullOrEmpty(undefined, undefined, undefined)).toBe(true);
    });

    it('should return false when at least one argument is not null, undefined, or an empty string', () => {
      expect(areAllNullOrEmpty('not empty', null, undefined)).toBe(false);
      expect(areAllNullOrEmpty('', 'not empty', '')).toBe(false);
      expect(areAllNullOrEmpty(null, undefined, 'not empty')).toBe(false);
    });
  });

  describe('isAnyNotNullOrEmpty', () => {
    it('should return true when at least one argument is not null, undefined, or an empty string', () => {
      expect(isAnyNotNullOrEmpty('not empty', null, undefined)).toBe(true);
      expect(isAnyNotNullOrEmpty('', 'not empty', '')).toBe(true);
      expect(isAnyNotNullOrEmpty(null, undefined, 'not empty')).toBe(true);
    });

    it('should return false when all arguments are null, undefined, or empty strings', () => {
      expect(isAnyNotNullOrEmpty(null, undefined, '')).toBe(false);
      expect(isAnyNotNullOrEmpty('', '', '')).toBe(false);
      expect(isAnyNotNullOrEmpty(null, null, null)).toBe(false);
      expect(isAnyNotNullOrEmpty(undefined, undefined, undefined)).toBe(false);
    });
  });
});
