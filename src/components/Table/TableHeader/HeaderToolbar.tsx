import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { RefreshIndicator } from "@src/components/Table/RefreshIndicator";
import React, { useCallback, useState } from "react";

type TableToolbarProps = {
  tableName: string;
  // onRefresh: () => void;
  onActionSelect: (action: string) => void;
  // lastRefreshTime: number;
};
export function TableToolbar(props: Readonly<TableToolbarProps>) {
  const { tableName, onActionSelect } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(Date.now());

  const handleRefresh = useCallback(() => {
    setLastRefreshTime(Date.now());
    // Implement refresh logic here
    console.log("Refresh clicked");
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (action: string) => {
    onActionSelect(action);
    handleMenuClose();
  };

  return (
    <Toolbar
      sx={{
        display: "flex",
        justifyContent: "space-between",
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
        {tableName}
      </Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <RefreshIndicator lastRefreshTime={lastRefreshTime} onRefresh={handleRefresh} />
        <Button aria-controls="actions-menu" aria-haspopup="true" onClick={handleMenuOpen}>
          Actions
        </Button>
        <Menu id="actions-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleActionClick("Edit")}>Edit</MenuItem>
          <MenuItem onClick={() => handleActionClick("Delete")}>Delete</MenuItem>
          <MenuItem onClick={() => handleActionClick("Add")}>Add</MenuItem>
          <MenuItem onClick={() => handleActionClick("Export to Excel")}>Export to Excel</MenuItem>
          <MenuItem onClick={() => handleActionClick("Export to CSV")}>Export to CSV</MenuItem>
        </Menu>
      </div>
    </Toolbar>
  );
}
