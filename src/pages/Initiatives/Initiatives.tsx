import { BreadCrumbs } from "@src/components/BreadCrumbs/BreadCrumbs";
import styles from "@src/pages/Initiatives/Initiatives.module.css";

export function InitiativesPage() {
  return (
    <div className={styles.container}>
      <BreadCrumbs />
      Initiatives Page
    </div>
  );
}
