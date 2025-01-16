import '@testing-library/dom';
import { formatDateAsFile } from '@/lib/utils';

describe('formatDateAsFile', () => {
  test('should format date correctly for a regular date', () => {
    const testDate = new Date('2025-01-13T00:00:00+07:00');
    expect(formatDateAsFile(testDate)).toBe('2025-01-13');
  });

  test('should handle single digit months and days with padding', () => {
    const testDate = new Date('2025-05-05T00:00:00+07:00');
    expect(formatDateAsFile(testDate)).toBe('2025-05-05');
  });

  test('should handle month transitions correctly', () => {
    const testDate = new Date('2025-12-31T00:00:00+07:00');
    expect(formatDateAsFile(testDate)).toBe('2025-12-31');
  });

  test('should handle year transitions correctly', () => {
    const testDate = new Date('2025-01-01T00:00:00+07:00');
    expect(formatDateAsFile(testDate)).toBe('2025-01-01');
  });
});