import type { MedicationsDTO } from '../types/medication.js';
import { Types } from 'mongoose';

interface buildFiltersProps {
  filters?: MedicationsDTO;
  forCountOnly?: boolean;
}

export const buildFilters = (filters: MedicationsDTO = {}) => {
  const { name, startDate, endDate, successReaction, pageSize = 6, sortBy, sortDirection = 'asc', location } = filters;

  console.log(filters);

  const readyFilters: Record<string, any> = {};

  if (name && name.trim().length >= 3) {
    readyFilters.name = { $regex: name.trim(), $options: 'i' };
  }

  if (successReaction !== undefined) {
    readyFilters.successReaction = successReaction;
  }

  if (location) {
    readyFilters.location = location;
  }

  if (startDate) {
    readyFilters.startDate = startDate;
  }

  if (endDate) {
    readyFilters.endDate = endDate;
  }

  const sortOrder = sortDirection === 'asc' ? 1 : -1;
  const sortOptions: Record<string, 1 | -1> = {
    [sortBy as string]: sortOrder,
  };

  return { readyFilters, sortOptions };
};
