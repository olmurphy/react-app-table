import React from 'react';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { Column } from '../Table.types';

interface SearchFilterDropdownProps<T> {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  columns: Column<T>[];
  onFilterSelect: (column: keyof T) => void;
  searchTerm: string;
}

export function SearchFilterDropdown<T>({
  anchorEl,
  onClose,
  columns,
  onFilterSelect,
  searchTerm,
}: SearchFilterDropdownProps<T>) {
  const open = Boolean(anchorEl);
  const id = open ? 'search-filter-popper' : undefined;

  const filteredColumns = columns.filter(
    (column) => column.filterable !== false && column.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFilterClick = (column: keyof T) => {
    onFilterSelect(column);
  };

  return (
    <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" sx={{ zIndex: 2, fontSize: '8px' }}>
      <ClickAwayListener onClickAway={onClose}>
        <Paper sx={{ width: 300, maxHeight: 400, overflow: 'auto' }}>
          <List>
            {filteredColumns.map((column) => (
              <ListItem key={String(column.id)} disablePadding>
                <ListItemButton
                  sx={{ padding: 0 }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleFilterClick(column.id);
                  }}
                >
                  <span style={{ fontSize: '16px', paddingLeft: '.5rem' }}>{column.label}</span>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
} 