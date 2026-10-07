import { Types, type QueryFilter } from 'mongoose';
import type { MedicationDoc } from '../models/Medication.js';
import { type MedicationsDTO } from '@research/shared';

export const buildFilters = (filters: MedicationsDTO = {}) => {
  const {
    name,
    startDate,
    endDate,
    successReaction,
    excludeId,
    sortBy = '_id',
    sortDirection = 'asc',
    location,
  } = filters;

  const readyFilters: QueryFilter<MedicationDoc> = {};
  const isSortByLocation = sortBy === 'location';

  if (excludeId) {
    readyFilters._id = { $ne: new Types.ObjectId(excludeId) };
  }

  if (name) {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    readyFilters.name = { $regex: escapedName, $options: 'i' };
  }

  if (successReaction !== undefined) {
    readyFilters.successReaction = successReaction;
  }

  if (location) {
    readyFilters.location = location;
  }

  if (startDate) {
    readyFilters.startDate = { $gte: `${startDate}T00:00:00Z` };
  }

  if (endDate) {
    readyFilters.endDate = { $lte: `${endDate}T23:59:59Z` };
  }

  const sortField = isSortByLocation ? 'location.clinicName' : sortBy;
  const sortOrder = sortDirection === 'asc' ? 1 : -1;
  const sortOptions: Record<string, 1 | -1> = {
    [sortField]: sortOrder,
    _id: sortOrder,
  };

  return { readyFilters, sortOptions, isSortByLocation };
};
