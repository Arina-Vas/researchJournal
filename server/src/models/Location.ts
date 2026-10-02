import { model, Schema } from 'mongoose';

export interface LocationAddress {
  country: string;
  city: string;
  street: string;
  building: string;
}

export interface Location {
  id: string;
  clinicName: string;
  address: LocationAddress;
  coordinate: { lat: number; lng: number };
}

const locationSchema = new Schema<Location>({
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

export const Location = model<Location>('Location', locationSchema);
