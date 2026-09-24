import { APIProvider } from '@vis.gl/react-google-maps';
import type { ReactNode } from 'react';

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  return <APIProvider apiKey={API_KEY}>{children}</APIProvider>;
};
