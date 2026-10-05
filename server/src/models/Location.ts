import { model, Schema } from 'mongoose';
import type { LocationDTO } from '@research/shared';

export type LocationDoc = Omit<LocationDTO, '_id'>;

const locationSchema = new Schema<LocationDoc>({
  id: String,
  clinicName: { type: String, required: true },
  address: {
    country: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    building: { type: String, required: true },
  },
  coordinate: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
});

export const Location = model<LocationDoc>('Location', locationSchema);
