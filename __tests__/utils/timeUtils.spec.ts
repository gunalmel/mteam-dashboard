import { Today } from '@/app/utils/TodayDateTimeConverter';

describe('Today Utils', () => {
  const now = new Date();
  const todayDateString = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0)).toISOString().split('T')[0];

  describe('timeStampStringToSeconds', () => {
    it('should convert timestamp string to seconds', () => {
      expect(Today.timeStampStringToSeconds('12:34:56')).toBe(45296);
      expect(Today.timeStampStringToSeconds('00:00:00')).toBe(0);
      expect(Today.timeStampStringToSeconds('23:59:59')).toBe(86399);
    });

    it('should return 0 for undefined or empty string', () => {
      expect(Today.timeStampStringToSeconds(undefined)).toBe(0);
      expect(Today.timeStampStringToSeconds('')).toBe(0);
    });
  });

  describe('parseSeconds', () => {
    it('should parse seconds to dateTimeString and timeStampString', () => {
      const result = Today.parseSeconds(45296);
      expect(result.dateTimeString).toMatch(/^\d{4}-\d{2}-\d{2} 12:34:56$/);
      expect(result.dateTimeString).toBe(`${todayDateString} 12:34:56`);
      expect(result.timeStampString).toBe('12:34:56');
      expect(result.seconds).toBe(45296);
    });

    it('should handle 0 seconds correctly', () => {
      const result = Today.parseSeconds(0);
      expect(result.dateTimeString).toMatch(/^\d{4}-\d{2}-\d{2} 00:00:00$/);
      expect(result.dateTimeString).toBe(`${todayDateString} 00:00:00`);
      expect(result.timeStampString).toBe('00:00:00');
      expect(result.seconds).toBe(0);
    });
  });

  describe('parseTime', () => {
    it('should parse time string to seconds and dateTimeString', () => {
      const result = Today.parseTime('12:34:56');
      expect(result.dateTimeString).toMatch(/^\d{4}-\d{2}-\d{2} 12:34:56$/);
      expect(result.timeStampString).toBe('12:34:56');
      expect(result.seconds).toBe(45296);
    });

    it('should return default value for invalid time string', () => {
      const result = Today.parseTime('invalid');
      expect(result.dateTimeString).toMatch(/^\d{4}-\d{2}-\d{2} 00:00:00$/);
      expect(result.timeStampString).toBe('00:00:00');
      expect(result.seconds).toBe(0);
    });
  });

  describe('getBeginningOfDayString', () => {
    it('should return the beginning of the day in UTC', () => {
      const result = Today.getBeginningOfDayString();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} 00:00:00$/);
      expect(result).toBe(`${todayDateString} 00:00:00`);
    });
  });
});
