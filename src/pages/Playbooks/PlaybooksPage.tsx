import { CustomTable } from "@src/components/Table/Table";
import { playbookColumns } from "@src/pages/Playbooks/Playbook.types";
import styles from "@src/pages/Playbooks/PlaybooksPage.module.css";
import { Playbook, usePlaybook } from "@src/services/playbook/playbookService";
import { useEffect, useState } from "react";

let nextId = 0;
let todos = [{ id: nextId++, text: 'Todo #1' }];
let listeners: any[] = [];

export const todosStore = {
  addTodo() {
    todos = [...todos, { id: nextId++, text: 'Todo #' + nextId }]
    emitChange();
  },
  subscribe(listener: any) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  getSnapshot() {
    return todos;
  }
};

function emitChange() {
  for (let listener of listeners) {
    listener();
  }
}

export function PlaybooksPage() {
  // const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { playbooks } = usePlaybook();

  const handlePageChange = (newPage: number) => {
    setPage(newPage + 1); // Adjust for 0-based index
  };

  const handleRowsPerChange = (pageSize: number) => {
    setPageSize(pageSize);
    setPage(1); // Reset to first page when page size changes
  };

  useEffect(() => {
    console.log(playbooks);
  }, [playbooks])
  return (
    <div className={styles.container}>
      <div>
        <CustomTable<Playbook>
          tableName={"Playbooks"}
          data={[]}
          columns={playbookColumns}
          page={page}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handleRowsPerChange}
        />
      </div>
    </div>
  );
}
