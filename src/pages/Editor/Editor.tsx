import { BreadCrumbs } from "@src/components/BreadCrumbs/BreadCrumbs";
import styles from "@src/pages/Editor/Editor.module.css";

export function EditorPage() {
  return (
    <div className={`${styles.container}`}>
      <BreadCrumbs />
      Editor Page
    </div>
  );
}
