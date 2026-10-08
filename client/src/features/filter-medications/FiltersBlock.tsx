import { useEffect, useState } from 'react';
import s from './FiltersBlock.module.css';
import { useFetchLocations } from '../../entities/location/lib/hooks';
import { useDebounce } from '../../shared/hooks/useDebounce';
import { Input } from '../../shared/ui/input/Input';
import { Button } from '../../shared/ui/button/Button';
import { Dropdown } from '../../shared/ui/dropdown/Dropdown';
import { isValidDateRange, type MedicationsFilters, MIN_SEARCH_LENGTH } from '@research/shared';

type Props = {
  onChange: (update: Partial<MedicationsFilters> | null) => void;
};
export const FiltersBlock = ({ onChange }: Props) => {
  const { data: locations } = useFetchLocations();
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [successReaction, setSuccessReaction] = useState<boolean | undefined>(undefined);
  const [searchName, setSearchName] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchName || '', 500);

  const trimmedValue = debouncedSearch.trim();

  const isSearchTooShort = trimmedValue.length > 0 && trimmedValue.length < MIN_SEARCH_LENGTH;

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (searchName === undefined) return;

    onChange({ name: trimmedValue.length >= MIN_SEARCH_LENGTH ? trimmedValue : undefined });
    //eslint-disable-next-line
  }, [debouncedSearch]);

  const applyFilters = () => {
    if (!isValidDateRange(startDate, endDate)) {
      setError('Start date must be before end date');
      return;
    }

    setError(null);
    setShowFilters(false);
    onChange({ location, successReaction, startDate, endDate });
  };

  const onReset = () => {
    onChange(null);
    setError(null);
    setLocation(undefined);
    setSuccessReaction(undefined);
    setSearchName(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
    setShowFilters(false);
  };

  return (
    <div className={s.filtersContainer}>
      <div>
        <div className={s.searchRow}>
          <Input
            value={searchName || ''}
            onChange={setSearchName}
            placeholder={'Search by name...'}
            type="search"
            aria-describedby={isSearchTooShort ? 'search-hint' : undefined}
          />
          <Button
            variant={'outline'}
            onClick={() => setShowFilters(p => !p)}
            className={s.filterTriggerBtn}
          >
            Filters
          </Button>
        </div>
        {isSearchTooShort && (
          <span id={'search-hint'} className={s.hint}>
            Enter at least {MIN_SEARCH_LENGTH} characters
          </span>
        )}

        {showFilters && (
          <div className={s.filterPopup}>
            <div className={s.filterGroup}>
              <span className={s.filterTitle}>Location</span>
              <Dropdown
                label={'Choose location'}
                options={locations ?? []}
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
                  onClick={() =>
                    successReaction ? setSuccessReaction(undefined) : setSuccessReaction(true)
                  }
                >
                  Successful
                </Button>
                <Button
                  variant={'outline'}
                  isActive={successReaction === false}
                  onClick={() =>
                    successReaction === false
                      ? setSuccessReaction(undefined)
                      : setSuccessReaction(false)
                  }
                >
                  Unsuccessful
                </Button>
              </div>
            </div>
            <div className={s.filterGroup}>
              <span className={s.filterTitle}>Dates</span>
              <Input
                label={'Start Date'}
                id={'start-date'}
                type={'date'}
                value={startDate || ''}
                onChange={value => setStartDate(value || undefined)}
              />
              <Input
                label={'End Date'}
                id={'end-date'}
                type={'date'}
                value={endDate || ''}
                onChange={value => setEndDate(value || undefined)}
              />
            </div>
            <span className={s.hint}>{error}</span>
            <div className={s.actions}>
              <Button variant={'primary'} className={s.applyBtn} onClick={applyFilters}>
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
