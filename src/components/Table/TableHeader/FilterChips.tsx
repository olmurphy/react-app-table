import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useTableContext } from "../contexts/TableContext";
import { useEffect } from "react";

export function FilterChips<T>() {
  const { state, dispatch } = useTableContext<T>();

  function handleClearFilters() {
    dispatch({
      type: "CLEAR_ALL_FILTERS",
    });
  }

  function handleRemoveFilter(column: keyof T) {
    dispatch({
      type: "CLEAR_FILTER",
      payload: { column },
    });
  }

  if (state.filters.length === 0) {
    return null;
  }


  useEffect(() => {
    console.log(state.filters)
  }, [state.filters])


  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {state.filters.map((filter) => (
        <Chip
          key={String(filter.column)}
          label={`${state.columns.find((c) => c.id === filter.column)?.label || String(filter.column)} = ${
            filter.value
          }`}
          onDelete={() => handleRemoveFilter(filter.column)}
          color="primary"
          variant="outlined"
        />
      ))}
      <Chip label="Clear filters" onClick={handleClearFilters} color="default" variant="outlined" />
    </Box>
  );
}
