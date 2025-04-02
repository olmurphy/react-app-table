import { BreadCrumbs } from "@src/components/BreadCrumbs/BreadCrumbs";
import { Column, CustomTable } from "@src/components/Table/Table";
import styles from "@src/pages/CompanyDomain/CompanyDomain.module.css";
import { data } from "./data";
import { useState } from "react";
import { useTheme } from "@src/contexts/themeContext";

export type DataRow = {
  id: number;
  firstName: string;
  lastName: string;
  birthday: string;
}

const columns: Column<DataRow>[] = [
  { id: "id", label: "ID"},
  { id: "firstName", label: "First Name"},
  { id: "lastName", label: "Last Name"},
  { id: "birthday", label: "Birthday"},
];

export function CompanyDomainPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(data.length);
  const { state } = useTheme();
  

  const handlePageChange = (newPage: number) => {
    setPage(newPage + 1); // Adjust for 0-based index
  }

  const handleRowsPerChange = (pageSize: number) => {
    setPageSize(pageSize);
    setPage(1); // Reset to first page when page size changes
  }
  return (
    <div className={`${styles.container} ${styles.variables}`}>
      <BreadCrumbs />
      Company Domain Page

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
  );
}
