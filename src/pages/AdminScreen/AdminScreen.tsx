import { BreadCrumbs } from "@src/components/BreadCrumbs/BreadCrumbs";
import { CustomTable } from "@src/components/Table/Table";
import { Column } from "@src/components/Table/Table.types";
import { useTheme } from "@src/contexts/themeContext";
import styles from "@src/pages/AdminScreen/AdminScreen.module.css";
import { useState } from "react";
import { data } from "../CompanyDomain/data";
import Sidebar, { SidebarItem } from "@src/components/Sidebar/Sidebar";
import { Bell, Home, Settings, User } from "lucide-react";

export type DataRow = {
  id: number;
  firstName: string;
  lastName: string;
  birthday: string;
};

const columns: Column<DataRow>[] = [
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
          height: "100vh",
        }}
      >
        <Sidebar>
          <SidebarItem icon={<Home />} text="Home" active />
          <SidebarItem icon={<Settings />} text="Settings" />
          <SidebarItem icon={<User />} text="Profile" />
          <SidebarItem icon={<Bell />} text="Notifications" alert />
        </Sidebar>
      </div>
      <div>
        <BreadCrumbs />
        Admin Screen Page
        <div
          style={{
            overflowX: "auto",
            width: "1000px",
          }}
        >
          <CustomTable<DataRow>
            tableName={"Company Domain"}
            data={data}
            columns={columns}
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={handlePageChange}
            onPageSizeChange={handleRowsPerChange}
          />
        </div>
      </div>
    </div>
  );
}
