import { describe, expect, it } from 'vitest';
import { isValidDateRange, MedicationsQuerySchema } from './medication.js';

describe('isValidDateRange', () => {
  it('allows missing dates', () => {
    expect(isValidDateRange()).toBe(true);
    expect(isValidDateRange('2020-01-01')).toBe(true);
    expect(isValidDateRange(undefined, '2020-01-01')).toBe(true);
  });

  it('allows the same day and rejects end before start', () => {
    expect(isValidDateRange('2020-01-01', '2020-01-01')).toBe(true);
    expect(isValidDateRange('2020-02-01', '2020-01-01')).toBe(false);
  });
});

describe('MedicationsQuerySchema', () => {
  it('parses query strings into typed values', () => {
    const result = MedicationsQuerySchema.parse({
      successReaction: 'true',
      page: '2',
      pageSize: '12',
      sortBy: 'name',
    });

    expect(result).toMatchObject({ successReaction: true, page: 2, pageSize: 12, sortBy: 'name' });
  });

  it('parses successReaction=false as a boolean, not as a truthy string', () => {
    expect(MedicationsQuerySchema.parse({ successReaction: 'false' }).successReaction).toBe(false);
  });

  it('trims the search', () => {
    expect(MedicationsQuerySchema.parse({ name: '  aspirin ' }).name).toBe('aspirin');
  });

  it.each([
    ['a short search', { name: 'ab' }],
    ['an empty date', { startDate: '' }],
    ['a date with time', { startDate: '2020-01-01T00:00:00Z' }],
    ['an invalid location id', { location: 'abc' }],
    ['an unknown sort field', { sortBy: 'description' }],
    ['a non-boolean reaction', { successReaction: 'yes' }],
  ])('rejects %s', (_, query) => {
    expect(MedicationsQuerySchema.safeParse(query).success).toBe(false);
  });

  it('rejects an end date before the start date', () => {
    const result = MedicationsQuerySchema.safeParse({
      startDate: '2020-02-01',
      endDate: '2020-01-01',
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['endDate']);
  });
});
