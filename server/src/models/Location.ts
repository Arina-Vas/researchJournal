import {model, Schema} from "mongoose";

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
    coordinates: { lat: string; lng: string };
}

const locationSchema = new Schema<Location>({
    id: String,
    clinicName: {type: String, required: true},
    address: {
        country: {type: String, required: true},
        city: {type: String, required: true},
        street: {type: String, required: true},
        building: {type: String, required: true},
    },
    coordinates: {
        lat: {type: String, required: true},
        lng: {type: String, required: true},
    },
});

export const Location = model("Location", locationSchema);