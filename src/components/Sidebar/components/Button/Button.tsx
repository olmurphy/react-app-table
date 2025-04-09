import { useSidebar } from "../../contexts/SidebarContexts";
import styles from "./Button.module.css";

type Button = {
  children: React.ReactNode;
};

export function Button(props: any) {
  const { toggleExpanded } = useSidebar();

  const handleClick = () => {
    toggleExpanded();
  };
  return (
    <button onClick={() => handleClick()} className={styles.sidebarToggleButton}>
      {props.children}
    </button>
  );
}
