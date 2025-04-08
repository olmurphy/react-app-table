import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useTableContext } from "../contexts/TableContext";

export function FilterChips<T>() {
  const { state, dispatch } = useTableContext<T>();

  function handleClearFilters() {
    dispatch({
      type: "CLEAR_ALL_ACTIVE_FILTERS",
    });
    
    dispatch({
      type: "CLEAR_ALL_FILTERS",
    });
  }

  function handleRemoveFilter(column: keyof T) {
    dispatch({
      type: "CLEAR_ACTIVE_FILTER",
      payload: { column },
    });
    
    dispatch({
      type: "SET_FILTERS",
      payload: { field: column, value: "" },
    });
  }

  if (state.activeFilters.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {state.activeFilters.map((filter) => (
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
