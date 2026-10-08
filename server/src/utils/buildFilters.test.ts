import { describe, expect, it } from 'vitest';
import { Types } from 'mongoose';
import { buildFilters } from './buildFilters.js';

describe('buildFilters', () => {
  it('sorts by _id by default', () => {
    const { readyFilters, sortOptions, isSortByLocation } = buildFilters();

    expect(readyFilters).toEqual({});
    expect(sortOptions).toEqual({ _id: 1 });
    expect(isSortByLocation).toBe(false);
  });

  it('adds _id as a tiebreaker so pagination is stable', () => {
    const { sortOptions } = buildFilters({ sortBy: 'successReaction', sortDirection: 'desc' });

    expect(sortOptions).toEqual({ successReaction: -1, _id: -1 });
  });

  it('sorts by clinic name when sorting by location', () => {
    const { sortOptions, isSortByLocation } = buildFilters({ sortBy: 'location' });

    expect(isSortByLocation).toBe(true);
    expect(sortOptions).toEqual({ 'location.clinicName': 1, _id: 1 });
  });

  it('includes the whole end day in the date filter', () => {
    const { readyFilters } = buildFilters({ startDate: '2020-01-01', endDate: '2020-12-20' });

    expect(readyFilters.startDate).toEqual({ $gte: '2020-01-01T00:00:00Z' });
    expect(readyFilters.endDate).toEqual({ $lte: '2020-12-20T23:59:59Z' });
  });

  it('escapes regex characters in the search', () => {
    const { readyFilters } = buildFilters({ name: 'a.b(c)' });

    expect(readyFilters.name).toEqual({ $regex: 'a\\.b\\(c\\)', $options: 'i' });
  });

  it('keeps successReaction=false as a filter', () => {
    const { readyFilters } = buildFilters({ successReaction: false });

    expect(readyFilters.successReaction).toBe(false);
  });

  it('filters by location and excludes a medication by id', () => {
    const location = '6ab65372e8499f1052de44aa';
    const excludeId = '6ab65372e8499f1052de44dc';
    const { readyFilters } = buildFilters({ location, excludeId });

    expect(readyFilters.location).toBe(location);
    expect(readyFilters._id).toEqual({ $ne: new Types.ObjectId(excludeId) });
  });
});
