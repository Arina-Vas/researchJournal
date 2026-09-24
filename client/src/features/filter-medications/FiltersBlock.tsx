import { useEffect, useState } from 'react';
import s from './FiltersBlock.module.css';
import { MedicationFilters } from '../../entities/medications/lib/type';
import { useFetchLocations } from '../../entities/location/lib/hooks';
import { useDebounce } from '../../shared/hooks/useDebounce';
import { Input } from '../../shared/ui/input/input';
import { Button } from '../../shared/ui/button/Button';
import { Dropdown } from '../../shared/ui/dropdown/Dropdown';

type Props = {
  onChange: (filters: MedicationFilters) => void;
};
export const FiltersBlock = ({ onChange }: Props) => {
  const { data: locations } = useFetchLocations();
  const [location, setLocation] = useState<string>('');
  const [successReaction, setSuccessReaction] = useState<boolean | undefined>(undefined);
  const [searchName, setSearchName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const debouncedSearch = useDebounce(searchName.trim(), 500);

  const isValidValue = debouncedSearch.length > 2 || debouncedSearch.length === 0;

  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = () => {
    onChange({
      name: isValidValue ? debouncedSearch : '',
      locationId: location,
      successReaction: successReaction,
      startDate: startDate,
      endDate: endDate,
    });
  };

  useEffect(() => {
    if (isValidValue) applyFilters();
  }, [debouncedSearch]);

  const onApply = () => {
    setShowFilters(false);
    applyFilters();
  };

  const onReset = () => {
    onChange({});
    setLocation('');
    setSuccessReaction(undefined);
    setSearchName('');
    setShowFilters(false);
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className={s.filtersContainer}>
      <div>
        <div className={s.searchRow}>
          <Input value={searchName} onChange={setSearchName} placeholder={'Search by name...'} type="search" />
          <Button variant={'outline'} onClick={() => setShowFilters(p => !p)} className={s.filterTriggerBtn}>
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className={s.filterPopup}>
            <div className={s.filterGroup}>
              <span className={s.filterTitle}>Location</span>
              <Dropdown
                label={'Choose location'}
                options={locations?.data || []}
                onChange={setLocation}
                currentOption={location}
              />
            </div>
            <div className={s.filterGroup}>
              <span className={s.filterTitle}>Reaction</span>
              <div className={s.buttonGroup}>
                <Button variant={'outline'} isActive={successReaction} onClick={() => setSuccessReaction(true)}>
                  Successful
                </Button>
                <Button
                  variant={'outline'}
                  isActive={successReaction === false}
                  onClick={() => setSuccessReaction(false)}
                >
                  Unsuccessful
                </Button>
              </div>
            </div>
            <div className={s.filterGroup}>
              <span className={s.filterTitle}>Dates</span>
              <Input label={'Start Date'} type={'date'} value={startDate} onChange={setStartDate} />
              <Input label={'End Date'} type={'date'} value={endDate} onChange={setEndDate} />
            </div>
            <div className={s.actions}>
              <Button variant={'primary'} className={s.applyBtn} onClick={onApply}>
                Apply
              </Button>
              <Button variant={'secondary'} className={s.resetBtn} onClick={onReset}>
                Reset
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
