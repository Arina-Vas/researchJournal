import { Schema, model } from 'mongoose';
import {
  MedicationPhaseSchema,
  type MedicationDTO,
  MedicationStatusSchema,
  MedicationSubStatusSchema,
  MedicationTypeSchema,
} from '@research/shared';

export type MedicationDoc = Omit<MedicationDTO, '_id'>;

const medicationSchema = new Schema<MedicationDoc>({
  id: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: MedicationTypeSchema.options, required: true },
  status: { type: String, enum: MedicationStatusSchema.options, default: 'draft' },
  subStatus: { type: String, enum: MedicationSubStatusSchema.options, required: true },
  phase: { type: String, enum: MedicationPhaseSchema.options, required: true },
  endDate: { type: String, required: true },
  startDate: { type: String, required: true },
  successReaction: { type: Boolean, required: true },
  approvalRate: { type: Number, required: true },
  location: { type: String, ref: 'Location', required: true },
  process: {
    current: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  participants: {
    tested: { type: Number, required: true },
    nonTested: { type: Number, required: true },
    total: { type: Number, required: true },
  },
});

export const Medication = model<MedicationDoc>('Medication', medicationSchema);
