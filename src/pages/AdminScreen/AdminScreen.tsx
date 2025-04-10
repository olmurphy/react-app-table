import { BreadCrumbs } from "@src/components/BreadCrumbs/BreadCrumbs";
import { Sidebar } from "@src/components/Sidebar/Sidebar";
import { Column } from "@src/components/Table/Table.types";
import { useTheme } from "@src/contexts/themeContext";
import styles from "@src/pages/AdminScreen/AdminScreen.module.css";
import { useState } from "react";
import { data } from "../CompanyDomain/data";
import { sideBarItems } from "./AdminScreenConfig";

export type DataRow = {
  id: number;
  firstName: string;
  lastName: string;
  birthday: string;
};

export const columns: Column<DataRow>[] = [
  { id: "id", label: "ID" },
  { id: "firstName", label: "First Name" },
  { id: "lastName", label: "Last Name" },
  { id: "birthday", label: "Birthday" },
];

export function AdminScreenPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(data.length);
  const { state } = useTheme();

  const handlePageChange = (newPage: number) => {
    setPage(newPage + 1); // Adjust for 0-based index
  };

  const handleRowsPerChange = (pageSize: number) => {
    setPageSize(pageSize);
    setPage(1); // Reset to first page when page size changes
  };
  return (
    <div className={`${styles.container} ${styles.variables}`}>
      <div
        className={`${styles.sidebarContainer}`}
        style={{
          display: "flex",
        }}
      >
        <Sidebar
          items={sideBarItems}
          onItemClick={(item) => {
            if (item.path) {
              // window.location.href = item.path;
            }
          }}
        />
      </div>
      <div>
        <BreadCrumbs />
        Admin Screen Page
      </div>
    </div>
  );
}
