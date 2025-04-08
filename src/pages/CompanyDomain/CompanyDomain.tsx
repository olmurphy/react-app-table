import { BreadCrumbs } from "@src/components/BreadCrumbs/BreadCrumbs";
import { CustomTable } from "@src/components/Table/Table";
import { Column } from "@src/components/Table/Table.types";
import { useTheme } from "@src/contexts/themeContext";
import styles from "@src/pages/CompanyDomain/CompanyDomain.module.css";
import { useState } from "react";
import { data } from "./data";

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

export function CompanyDomainPage() {
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
      <BreadCrumbs />
      Company Domain Page
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
  );
}
