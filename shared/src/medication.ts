import { z } from 'zod';
import { ObjectIdSchema } from './common.js';

export const MAX_PAGE_SIZE = 100;
export const PAGE_SIZE_OPTIONS = [6, 12] as const;
export const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[0];
export const DEFAULT_PAGE = 1;

export const PaginationSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
  totalFilteredItems: z.number(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

export const MedicationTypeSchema = z.enum(['medicine', 'vaccine']);
export type MedicationType = z.infer<typeof MedicationTypeSchema>;

export const MedicationStatusSchema = z.enum(['draft', 'in_progress', 'completed', 'cancelled']);
export type MedicationStatus = z.infer<typeof MedicationStatusSchema>;

export const MedicationSubStatusSchema = z.enum(['awaiting_results', 'on_hold', 'out_of_stock', 'active']);
export type MedicationSubStatus = z.infer<typeof MedicationSubStatusSchema>;

export const MedicationPhaseSchema = z.enum(['preclinical', 'clinical_trials', 'regulatory_approval']);
export type MedicationPhase = z.infer<typeof MedicationPhaseSchema>;

export const SortBySchema = z.enum(['name', 'location', 'startDate', 'endDate', 'successReaction']);
export type SortBy = z.infer<typeof SortBySchema>;

export const SortDirectionSchema = z.enum(['asc', 'desc']);
export type SortDirection = z.infer<typeof SortDirectionSchema>;

export const ProcessSchema = z.object({
  current: z.number(),
  total: z.number(),
});

export const ParticipantsSchema = z.object({
  tested: z.number(),
  nonTested: z.number(),
  total: z.number(),
});

//Response

export const LocationSchema = z.object({
  _id: z.string(),
  id: z.string(),
  clinicName: z.string(),
  address: z.object({ country: z.string(), city: z.string(), street: z.string(), building: z.string() }),
  coordinate: z.object({ lat: z.number(), lng: z.number() }),
});
export type LocationDTO = z.infer<typeof LocationSchema>;

export const MedicationSchema = z.object({
  _id: z.string(),
  id: z.string(),
  code: z.string(),
  name: z.string(),
  description: z.string(),
  type: MedicationTypeSchema,
  status: MedicationStatusSchema,
  subStatus: MedicationSubStatusSchema,
  phase: MedicationPhaseSchema,
  endDate: z.string(),
  startDate: z.string(),
  successReaction: z.boolean(),
  approvalRate: z.number(),
  location: z.string(),
  process: ProcessSchema,
  participants: ParticipantsSchema,
});

export const MedicationWithLocationSchema = MedicationSchema.extend({ location: LocationSchema });
export type MedicationWithLocation = z.infer<typeof MedicationWithLocationSchema>;

export type MedicationDTO = z.infer<typeof MedicationSchema>;
// request
// filters
export const GetMedicationsResponseSchema = z.object({
  data: z.array(MedicationWithLocationSchema),
  pagination: PaginationSchema,
});

export type GetMedicationsResponse = z.infer<typeof GetMedicationsResponseSchema>;

export const MedicationsFiltersSchema = z.object({
  name: z.string().optional(),
  location: ObjectIdSchema.optional(),
  startDate: z.iso.date().optional(),
  endDate: z.iso.date().optional(),
  successReaction: z.stringbool({ truthy: ['true'], falsy: ['false'] }).optional(),
  excludeId: ObjectIdSchema.optional(),
});
export type MedicationsFilters = z.infer<typeof MedicationsFiltersSchema>;

export const SortAndPaginationParamsSchema = z.object({
  sortBy: SortBySchema.optional(),
  sortDirection: SortDirectionSchema.optional(),
  pageSize: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

export type SortAndPagination = z.infer<typeof SortAndPaginationParamsSchema>;
export type MedicationsDTO = MedicationsFilters & SortAndPagination;

export const MedicationsQuerySchema = MedicationsFiltersSchema.extend(SortAndPaginationParamsSchema.shape);

// common
