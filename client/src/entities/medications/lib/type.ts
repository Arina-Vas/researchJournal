import { Location } from '../../location/lib/type';

export interface Process {
  current: number;
  total: number;
}

export interface Participants {
  tested: number;
  nonTested: number;
  total: number;
}

export interface Medication {
  _id: string;
  code: string;
  name: string;
  description: string;
  type: 'medicine' | 'vaccine';
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled';
  subStatus: 'awaiting_results' | 'on_hold' | 'out_of_stock' | 'active';
  phase: 'preclinical' | 'clinical_trials' | 'regulatory_approval';
  endDate: string;
  startDate: string;
  successReaction: boolean;
  approvalRate: number;
  location: string;
  process: Process;
  participants: Participants;
}

export interface MedicationFilters {
  name?: string;
  sortBy?: 'name' | 'location' | 'startDate' | 'endDate' | 'successReaction';
  sortDirection?: 'asc' | 'desc';
  location?: string;
  startDate?: string;
  endDate?: string;
  successReaction?: boolean;
  pageSize?: number;
  page?: number;
}

export type MedicationItem = Omit<Medication, 'location'> & { location: Location };

export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  totalFilteredItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AllMedications {
  data: MedicationItem[];
  pagination: Pagination;
}
