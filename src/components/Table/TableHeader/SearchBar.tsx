import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import { alpha } from "@mui/material/styles";
import React, { useCallback, useRef, useState } from "react";
import { useTableContext } from "../contexts/TableContext";
import { SearchFilterDropdown } from "./SearchFilterDropdown";

export function SearchBar<T>() {
  const { state, dispatch } = useTableContext<T>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentFilterColumn, setCurrentFilterColumn] = useState<keyof T | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    // handleFilterChangeLocal(currentFilterColumn, event.target.value);
  };

  const handleSearchFieldClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSearchFieldSelect = (column: keyof T) => {
    setCurrentFilterColumn(column);
    const columnLabel = state.columns.find((c) => c.id === column)?.label || String(column);
    setSearchTerm(`${columnLabel} = `);

    // Ensure focus remains on the input and move cursor to the end
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      const length = `${columnLabel} = `.length;
      requestAnimationFrame(() => {
        searchInputRef.current?.setSelectionRange(length, length);
      });
    }
    // setSearchField(field);
    setAnchorEl(null);
  };

  const handleFilterChangeLocal = useCallback(
    (property: keyof T, value: string | number | boolean | string[]) => {
      dispatch({
        type: "SET_FILTERS",
        payload: { field: property, value },
      });
    },
    [state.filters]
  );

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const value = searchTerm.split(" = ")[1]?.trim();
      if (value && currentFilterColumn) {
        // Add the filter to active filters
        dispatch({
          type: "SET_ACTIVE_FILTER",
          payload: { column: currentFilterColumn, value },
        });
        
        // Update the filters state
        handleFilterChangeLocal(currentFilterColumn, value);
        
        // Clear the search input
        setSearchTerm("");
        setCurrentFilterColumn(null);
      }
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        maxWidth: "500px",
        width: "100%",
        position: "relative",
      }}
    >
      <SearchIcon
        sx={{
          position: "absolute",
          left: "8px",
          color: "text.secondary",
        }}
      />
      <InputBase
        inputRef={searchInputRef}
        placeholder="Search…"
        value={searchTerm}
        onChange={handleSearchChange}
        onClick={handleSearchFieldClick}
        onKeyDown={handleSearchKeyDown}
        sx={(theme) => ({
          width: "100%",
          padding: "4px 8px 4px 36px",
          borderRadius: 1,
          backgroundColor:
            theme.palette.mode === "light"
              ? alpha(theme.palette.common.black, 0.05)
              : alpha(theme.palette.common.white, 0.05),
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "light"
                ? alpha(theme.palette.common.black, 0.07)
                : alpha(theme.palette.common.white, 0.07),
          },
        })}
      />
      <SearchFilterDropdown
        anchorEl={anchorEl}
        onClose={handleClose}
        onFilterSelect={handleSearchFieldSelect}
        searchTerm={searchTerm}
      />
    </Box>
  );
}
