import { AdvancedMarker, Map, Pin } from '@vis.gl/react-google-maps';
import s from './Map.module.css';
import { memo } from 'react';
import { useTheme } from '../../../app/providers/theme-provider/useTheme';

type Props = {
  coordinates: { lat: string; lng: string } | null;
  mapId: string;
};
export const MapLocation = memo(({ coordinates, mapId }: Props) => {
  const { theme } = useTheme();

  if (!coordinates) return null;

  return (
    <Map
      key={theme}
      colorScheme={theme}
      className={s.map}
      fullscreenControl={false}
      rotateControl={false}
      cameraControl={false}
      scaleControl={false}
      mapTypeControl={false}
      streetViewControl={false}
      mapId={mapId}
      defaultZoom={12}
      defaultCenter={coordinates}
    >
      <AdvancedMarker clickable={false} position={coordinates}>
        <Pin background={'#3874ff'} glyphColor={'#000'} borderColor={'#000'} />
      </AdvancedMarker>
    </Map>
  );
});
