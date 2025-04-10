import { ChevronFirst, ChevronLast } from "lucide-react";
import React from "react";
import { Button } from "./components/Button/Button";
import { SidebarItem } from "./components/SidebarItem/SidebarItem";
import { SidebarProvider, useSidebar } from "./contexts/SidebarContexts";
import styles from "./Sidebar.module.css"; // Import the CSS module
import { SidebarProps } from "./types/SidebarTypes";

const SidebarContent: React.FC<Omit<SidebarProps, 'defaultExpanded'>> = ({ items, onItemClick, className }) => {
  const { expanded, toggleExpanded } = useSidebar();
  
  return (
    <aside className={`${styles.sidebar} ${expanded ? styles.expanded : styles.collapsed} ${className || ""}`}>
      <nav className={`${styles.sidebarNav} ${styles.container}`}>
        <div className={styles.sidebarHeader}>
          <Button onClick={toggleExpanded}>{expanded ? <ChevronFirst /> : <ChevronLast />}</Button>
        </div>
        <div className={styles.sidebarContent}>
          {items.map((item) => (
            <SidebarItem key={item.id} item={item} onClick={() => onItemClick?.(item)} />
          ))}
        </div>

        <div className={styles.sidebarFooter}>
          {/* <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt=""
            className={styles.sidebarUserAvatar}
          /> */}
          {/* <div
            className={`${styles.sidebarUserInfo} ${
              expanded ? styles.sidebarUserInfoExpanded : styles.sidebarUserInfoCollapsed
            }`}
          >
            <div className={styles.sidebarUserDetails}>
              <h4 className={styles.sidebarUserName}>John Doe</h4>
              <span className={styles.sidebarUserEmail}>[john@example.com]</span>
            </div>
          </div> */}
        </div>
      </nav>
    </aside>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ items, defaultExpanded = true, onItemClick, className }) => {
  return (
    <SidebarProvider defaultExpanded={defaultExpanded}>
      <SidebarContent items={items} onItemClick={onItemClick} className={className} />
    </SidebarProvider>
  );
};
