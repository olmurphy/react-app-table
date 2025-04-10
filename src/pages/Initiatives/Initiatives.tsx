import { BreadCrumbs } from "@src/components/BreadCrumbs/BreadCrumbs";
import { CustomTable } from "@src/components/Table/Table";
import styles from "@src/pages/Initiatives/Initiatives.module.css";
import { DataRow } from "../CompanyDomain/CompanyDomain";
import { useState } from "react";
import { useTheme } from "@src/contexts/themeContext";
import { data } from "../CompanyDomain/data";
import { columns } from "../AdminScreen/AdminScreen";

export function InitiativesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { state } = useTheme();

  const handlePageChange = (newPage: number) => {
    setPage(newPage + 1); // Adjust for 0-based index
  };

  const handleRowsPerChange = (pageSize: number) => {
    setPageSize(pageSize);
    setPage(1); // Reset to first page when page size changes
  };
  return (
    <div className={styles.container}>
      <div
        style={{
          overflowX: "auto",
        }}
      >
        <CustomTable<DataRow>
          tableName={"Initiatives"}
          data={data}
          columns={columns}
          page={page}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handleRowsPerChange}
        />
      </div>
    </div>
  );
}
