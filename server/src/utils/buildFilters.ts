import type { MedicationsDTO } from '../types/medication.js';
import { Types, type QueryFilter } from 'mongoose';
import type { Medication } from '../models/Medication.js';

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

  const readyFilters: QueryFilter<Medication> = {};

  if (excludeId && Types.ObjectId.isValid(excludeId)) {
    readyFilters._id = { $ne: new Types.ObjectId(excludeId) };
  }

  if (name && name.trim().length >= 3) {
    const escapedName = name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    readyFilters.name = { $regex: escapedName, $options: 'i' };
  }

  if (successReaction !== undefined) {
    readyFilters.successReaction = successReaction === 'true';
  }

  if (location) {
    readyFilters.location = location;
  }

  if (startDate) {
    readyFilters.startDate = { $gte: new Date(startDate).toISOString() };
  }

  if (endDate) {
    readyFilters.endDate = { $lte: new Date(endDate).toISOString() };
  }

  const sortOrder = sortDirection === 'asc' ? 1 : -1;
  const sortOptions: Record<string, 1 | -1> = {
    [sortBy]: sortOrder,
  };

  return { readyFilters, sortOptions };
};
