import { useEffect, useState } from 'react';
import s from './FiltersBlock.module.css';
import { MedicationFilters } from '../../entities/medications/lib/type';
import { useFetchLocations } from '../../entities/location/lib/hooks';
import { useDebounce } from '../../shared/hooks/useDebounce';
import { Input } from '../../shared/ui/input/input';
import { Button } from '../../shared/ui/button/Button';
import { Dropdown } from '../../shared/ui/dropdown/Dropdown';

type Props = {
  onChange: (filters: MedicationFilters | null) => void;
};
export const FiltersBlock = ({ onChange }: Props) => {
  const { data: locations } = useFetchLocations();
  const [location, setLocation] = useState<string | null>(null);
  const [successReaction, setSuccessReaction] = useState<boolean | null>(null);
  const [searchName, setSearchName] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchName, 500);

  const isValidValue = debouncedSearch?.length > 2 || (debouncedSearch?.length === 0 && searchName !== null);

  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = () => {
    let nameValue: string | null = null;
    if (debouncedSearch.length > 2) {
      nameValue = debouncedSearch;
    } else if (debouncedSearch.length === 0 && searchName !== null) {
      nameValue = '';
    }

    onChange({
      name: nameValue,
      location,
      successReaction,
      startDate,
      endDate,
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
    onChange(null);
    setLocation(null);
    setSuccessReaction(null);
    setSearchName(null);
    setStartDate(null);
    setEndDate(null);
    setShowFilters(false);
  };

  return (
    <div className={s.filtersContainer}>
      <div>
        <div className={s.searchRow}>
          <Input value={searchName || ''} onChange={setSearchName} placeholder={'Search by name...'} type="search" />
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
                options={locations || []}
                onChange={setLocation}
                currentOption={location || ''}
              />
            </div>
            <div className={s.filterGroup}>
              <span className={s.filterTitle}>Reaction</span>
              <div className={s.buttonGroup}>
                <Button
                  variant={'outline'}
                  isActive={successReaction === true}
                  onClick={() => setSuccessReaction(true)}
                >
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
              <Input label={'Start Date'} type={'date'} value={startDate || ''} onChange={setStartDate} />
              <Input label={'End Date'} type={'date'} value={endDate || ''} onChange={setEndDate} />
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
