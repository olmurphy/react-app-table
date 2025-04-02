import { useState, useCallback } from 'react';

interface UseTableSelectionProps<T> {
  data: T[];
  onSelectionChange?: (selectedRows: T[]) => void;
}

export function useTableSelection<T>({ data, onSelectionChange }: UseTableSelectionProps<T>) {
  const [selected, setSelected] = useState<readonly T[]>([]);

  const handleSelectAllClick = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        setSelected(data);
        onSelectionChange?.(data);
        return;
      }
      setSelected([]);
      onSelectionChange?.([]);
    },
    [data, onSelectionChange]
  );

  const handleSelectOneClick = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, row: T) => {
      const selectedIndex = selected.indexOf(row);
      let newSelected: T[] = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, row);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }

      setSelected(newSelected);
      onSelectionChange?.(newSelected);
    },
    [selected, onSelectionChange]
  );

  return {
    selected,
    handleSelectAllClick,
    handleSelectOneClick,
  };
}