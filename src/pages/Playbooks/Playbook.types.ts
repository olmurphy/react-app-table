import { Column } from "@src/components/Table/Table.types";
import { Playbook } from "@src/services/playbook/playbookService";



export const playbookColumns: Column<Playbook>[] = [
  { id: "title", label: "Title" },
  { id: "description", label: "Description" },
  { id: "owners", label: "Owners" },
  { id: "schema", label: "Schema" },
  { id: "githubRepo", label: "GitHub Repo" },
  { id: "createdAt", label: "Created At" },
  { id: "updatedAt", label: "Updated At" },
]