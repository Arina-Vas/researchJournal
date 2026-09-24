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
  locationId: string;
  process: Process;
  participants: Participants;
}

export interface MedicationFilters {
  name?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  locationId?: string;
  startDate?: string;
  endDate?: string;
  successReaction?: boolean;
  pageSize?: number;
  // cursorDoc?: QueryDocumentSnapshot | null;
}

export type MedicationItem = Medication & { location: Location };

export interface AllMedications {
  items: MedicationItem[];
  // firstVisibleDoc: QueryDocumentSnapshot;
  // lastVisibleDoc: QueryDocumentSnapshot;
}
