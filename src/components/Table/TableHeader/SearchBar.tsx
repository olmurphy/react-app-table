import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { alpha } from '@mui/material/styles';
import { Column } from '../Table.types';
import { useTableSearch } from '../hooks/useTableSearch';
import { SearchFilterDropdown } from './SearchFilterDropdown';

interface SearchBarProps<T> {
  columns: Column<T>[];
}

export function SearchBar<T>({ columns }: SearchBarProps<T>) {
  const {
    searchTerm,
    searchAnchorEl,
    searchInputRef,
    handleSearchChange,
    handleSearchFocus,
    handleFilterSelect,
    handleSearchKeyDown,
    setSearchAnchorEl,
  } = useTableSearch<T>();

  return (
    <div style={{ display: 'flex', alignItems: 'center', maxWidth: '500px', width: '100%', position: 'relative' }}>
      <SearchIcon
        sx={{
          position: 'absolute',
          left: '8px',
          color: 'text.secondary',
        }}
      />
      <InputBase
        inputRef={searchInputRef}
        placeholder="Search…"
        value={searchTerm}
        onChange={handleSearchChange}
        onClick={handleSearchFocus}
        onKeyDown={handleSearchKeyDown}
        sx={(theme) => ({
          width: '100%',
          padding: '4px 8px 4px 36px',
          borderRadius: 1,
          backgroundColor:
            theme.palette.mode === 'light'
              ? alpha(theme.palette.common.black, 0.05)
              : alpha(theme.palette.common.white, 0.05),
          '&:hover': {
            backgroundColor:
              theme.palette.mode === 'light'
                ? alpha(theme.palette.common.black, 0.07)
                : alpha(theme.palette.common.white, 0.07),
          },
        })}
      />
      <SearchFilterDropdown
        anchorEl={searchAnchorEl}
        onClose={() => setSearchAnchorEl(null)}
        columns={columns}
        onFilterSelect={handleFilterSelect}
        searchTerm={searchTerm}
      />
    </div>
  );
} 