import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import { alpha, styled } from "@mui/material/styles";
import { useTableSearch } from "@src/hooks/useTableSearch";
import React, { useCallback, useRef, useState } from "react";
import { useTableContext } from "../contexts/TableContext";
import { SearchFilterDropdown } from "./SearchFilterDropdown";
// import { SearchFilterDropdown } from "../Table";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export function SearchBar<T>() {
  const { state, dispatch } = useTableContext<T>();
  // const { searchTerm } = useTableSearch<T>({ columns: state.columns });
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
      // if (onFilterChange) {
      //   onFilterChange({ ...filters, [property]: value });
      // }
    },
    [state.filters]
  );

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const value = searchTerm.split(" = ")[1]?.trim();
      if (value && currentFilterColumn) {
        dispatch({
          type: "SET_ACTIVE_FILTER",
          payload: { column: currentFilterColumn, value },
        });
        dispatch({
          type: "SET_SEARCH",
          payload: {
            field: currentFilterColumn,
            term: value,
          },
        });
        handleFilterChangeLocal(currentFilterColumn, value);
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
        // columns={state.columns}
        onFilterSelect={handleSearchFieldSelect}
        searchTerm={searchTerm}
      />
    </Box>
  );
}
