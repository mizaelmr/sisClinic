import { MouseEvent, RefObject, useCallback } from 'react';
import { Box, Button, Stack } from '@mui/material';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import FilterMenu from './FilterMenu';

interface FilterSectionProps {
  apiRef: RefObject<GridApiCommunity | null>;
  handleToggleFilterPanel: (e: MouseEvent<HTMLButtonElement>) => void;
}

const statuses = ['active', 'inactive', 'pending'];

const FilterSection = ({ apiRef, handleToggleFilterPanel }: FilterSectionProps) => {
  const { up } = useBreakpoints();
  const upSm = up('sm');

  const handleFilter = useCallback(
    (field?: 'status', value?: string | number) => {
      if (!field) {
        apiRef.current?.setFilterModel({ items: [] });
      } else {
        apiRef.current?.setFilterModel({
          items: [{ field, operator: 'equals', value: value?.toString() }],
        });
      }
    },
    [apiRef],
  );

  return (
    <Stack spacing={1} sx={{ overflowX: { xs: 'auto', md: 'initial' }, scrollbarWidth: 'thin' }}>
      <FilterMenu
        label="Status"
        field="status"
        handleFilter={handleFilter}
        menuItems={statuses}
      />
    </Stack>
  );
};

export default FilterSection;
