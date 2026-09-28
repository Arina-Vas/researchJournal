export interface LocationAddress {
  country: string;
  city: string;
  street: string;
  building: string;
}

export interface Location {
  _id: string;
  id: string;
  clinicName: string;
  address: LocationAddress;
  coordinate: { lat: string; lng: string };
}
