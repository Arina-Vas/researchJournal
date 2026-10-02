import { AdvancedMarker, Map, Pin } from '@vis.gl/react-google-maps';
import s from './Map.module.css';
import { memo } from 'react';
import { useTheme } from '../../../app/providers/theme-provider/useTheme';
import type { Location } from '../../../entities/location/lib/type';

type Props = {
  coordinate: Location['coordinate'] | null;
  mapId: string;
};
export const MapLocation = memo(({ coordinate, mapId }: Props) => {
  const { theme } = useTheme();

  if (!coordinate) return null;

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
      defaultCenter={coordinate}
    >
      <AdvancedMarker clickable={false} position={coordinate}>
        <Pin background={'#3874ff'} glyphColor={'#000'} borderColor={'#000'} />
      </AdvancedMarker>
    </Map>
  );
});
