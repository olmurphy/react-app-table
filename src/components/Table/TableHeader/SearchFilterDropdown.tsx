import ClickAwayListener from "@mui/material/ClickAwayListener";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import { useTableContext } from "../contexts/TableContext";

interface SearchFilterDropdownProps<T> {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onFilterSelect: (column: keyof T) => void;
  searchTerm: string;
}

export function SearchFilterDropdown<T>({
  anchorEl,
  onClose,
  onFilterSelect,
  searchTerm,
}: SearchFilterDropdownProps<T>) {
  const { state } = useTableContext<T>();

  const filteredColumns = state.columns.filter((column) => {
    if (!searchTerm) return true;
    return column.label.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (!anchorEl) {
    return null;
  }

  return (
    <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom-start" style={{ zIndex: 1300 }}>
      <ClickAwayListener onClickAway={onClose}>
        <Paper sx={{ width: 300, maxHeight: 400, overflow: "auto" }}>
          <List>
            {filteredColumns.map((column) => (
              <ListItem key={String(column.id)} disablePadding>
                <ListItemButton
                  sx={{ padding: 0 }}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default to maintain focus
                    onFilterSelect(column.id as keyof T);
                  }}
                >
                  <span style={{ fontSize: "16px", paddingLeft: ".5rem" }}>{column.label}</span>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
}
