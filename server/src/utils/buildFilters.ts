import type { MedicationsDTO } from '../types/medication.js';

export const buildFilters = (filters: MedicationsDTO = {}) => {
  const { name, startDate, endDate, successReaction, pageSize = 6, sortBy, sortDirection = 'asc', location } = filters;

  const readyFilters: Record<string, any> = {};

  if (name && name.trim().length >= 3) {
    readyFilters.name = { $regex: name.trim(), $options: 'i' };
  }

  if (successReaction !== undefined) {
    readyFilters.successReaction = String(successReaction) === 'true';
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
    [sortBy as string]: sortOrder,
  };

  return { readyFilters, sortOptions };
};
