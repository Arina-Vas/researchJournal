import type { Participants, Process } from '../models/Medication.js';
import type { Location } from '../models/Location.js';
import { type Document, type PopulatedDoc, Types } from 'mongoose';

export interface MedicationsDTO {
  name?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'name' | 'location' | 'startDate' | 'endDate' | 'successReaction';
  sortDirection?: 'asc' | 'desc';
  successReaction?: boolean;
}

export interface MedicationResponseDTO {
  _id: Types.ObjectId;
  code: string;
  name: string;
  description: string;
  type: 'medicine' | 'vaccine';
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled';
  subStatus: 'awaiting_results' | 'on_hold' | 'out_of_stock' | 'active';
  phase: 'preclinical' | 'clinical_trials' | 'regulatory_approval';
  endDate: string | Date;
  startDate: string | Date;
  successReaction: boolean;
  approvalRate: number;
  location: PopulatedDoc<Location & Document>;
  process: Process;
  participants: Participants;
}

export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  totalFilteredItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetMedicationsResponse {
  data: MedicationResponseDTO[];
  pagination: Pagination;
}

export interface ErrorResponse {
  message: string;
}
