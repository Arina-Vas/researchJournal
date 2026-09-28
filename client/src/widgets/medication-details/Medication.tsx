import s from './Medication.module.css';
import { useCallback } from 'react';
import { Spinner } from '../../shared/ui/spinner/Spinner';
import { useMedicationById } from '../../entities/medications/lib/hooks';
import { useFetchLocationById } from '../../entities/location/lib/hooks';
import { Button } from '../../shared/ui/button/Button';
import { MapLocation } from '../../shared/ui/map-location/MapLocation';
import { MedicationTags } from './medication-tags/MedicationTags';
import DirectionIcon from '../../shared/assets/images/Directions.svg';

const MAP_ID = import.meta.env.VITE_MAP_ID || '';
const DIRECTION_BASE_URL = 'https://www.google.com/maps/dir/?api=1&destination=';

const description =
  'Oral suspension belonging to the class of analgesics. Prescribed for the reducing inflammation and improving general patient mobility. Consult a healthcare provider before modifying the dosage.Oral suspension belonging to the class of analgesics. Prescribed for the reducing inflammation and improving general patient mobility. Consult a healthcare provider before modifying the dosage.Oral suspension belonging to the class of analgesics. Prescribed for the reducing inflammation and improving general patient mobility. Consult a healthcare provider before modifying the dosage.Oral suspension belonging to the class of analgesics. Prescribed for the reducing inflammation and improving general patient mobility. Consult a healthcare provider before modifying the dosage.Oral suspension belonging to the class of analgesics. Prescribed for the reducing inflammation and improving general patient mobility. Consult a healthcare provider before modifying the dosage.Oral suspension belonging to the class of analgesics. Prescribed for the reducing inflammation and improving general patient mobility. Consult a healthcare provider before modifying the dosage.Oral suspension belonging to the class of analgesics. Prescribed for the reducing inflammation and improving general patient mobility. Consult a healthcare provider before modifying the dosage.Oral suspension belonging to the class of analgesics. Prescribed for the reducing inflammation and improving general patient mobility. Consult a healthcare provider before modifying the dosage.Oral suspension belonging to the class of analgesics. Prescribed for the reducing inflammation and improving general patient mobility. Consult a healthcare provider before modifying the dosage.Oral suspension belonging to the class of analgesics. Prescribed for the reducing inflammation and improving general patient mobility. Consult a healthcare provider before modifying the dosage.';

type Props = {
  id: string;
};
export const Medication = ({ id }: Props) => {
  const { data, isLoading: isMedicationLoading } = useMedicationById(id);
  const { data: location, isLoading: isLocationLoading } = useFetchLocationById(data?.locationId || '');

  const isLoading = isMedicationLoading || isLocationLoading;

  const { street, city, country, building } = location?.address || {};

  const handleGetDirection = useCallback(() => {
    if (!location) return;
    const { lat, lng } = location.coordinates;

    const link = `${DIRECTION_BASE_URL}${lat},${lng}`;

    window.open(link, '_blank', 'noopener, noreferrer');
  }, [location]);

  return (
    <div className={s.wrapper}>
      {isLoading && <Spinner />}
      <div className={s.medicine}>
        <h2 className={s.name}>{data?.name}</h2>
        <div className={s.description}>
          <span>About this medicine</span>
          <p>{description}</p>
        </div>
      </div>
      <div className={s.location}>
        <div className={s.section}>
          <span className={s.title}>Manufacturer</span>
          <span>{location?.clinicName}</span>
        </div>
        <div className={s.section}>
          <span className={s.title}>Location</span>
          <MapLocation mapId={MAP_ID} coordinates={location?.coordinates || null} />
          <span>
            {building} {street}, {city}, {country}
          </span>
          <Button variant={'outline'} iconLeft={<DirectionIcon />} fullWidth onClick={handleGetDirection}>
            Get direction
          </Button>
        </div>
        <div className={s.section}>
          <span className={s.title}>Tags</span>
          <MedicationTags location={location?._id || ''} />
        </div>
      </div>
    </div>
  );
};
