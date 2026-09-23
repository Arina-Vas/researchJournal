import {Schema, model, Types} from 'mongoose';

export interface Process {
    current: number;
    total: number;
}

export interface Participants {
    tested: number;
    nonTested: number;
    total: number;
}

export interface Medication extends Document {
    id: string;
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
    locationId: Types.ObjectId;
    process: Process;
    participants: Participants;
}

const medicationSchema = new Schema<Medication>({
    id:  { type: String, required: true },
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['medicine', 'vaccine'], required: true },
    description:  { type: String, required: true },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    subStatus:  { type: String, enum: ['awaiting_results', 'on_hold', 'out_of_stock', 'active'], required: true },
    phase:  { type: String,enum: ['preclinical', 'clinical_trials', 'regulatory_approval'], required: true },
    endDate:  { type: String, required: true },
    startDate:  { type: String, required: true },
    successReaction: Boolean,
    approvalRate: Number,
    locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
    process: {
        current: Number,
        total: Number,
    },
    participants: {
        tested: Number,
        nonTested: Number,
        total: Number,
    },
})

export const Medication = model('Medication', medicationSchema);