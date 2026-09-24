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
