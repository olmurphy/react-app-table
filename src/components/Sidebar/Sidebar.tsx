import React, { useContext, createContext, useState, useMemo } from "react";
import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import styles from "./Sidebar.module.css"; // Import the CSS module
import { SidebarProps } from './types';
import { SidebarProvider } from './SidebarContext';
import { SidebarItem } from './SidebarItem';

const SidebarContext = createContext({ expanded: true });

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  defaultExpanded = true,
  onItemClick,
  className,
}) => {
  return (
    <SidebarProvider defaultExpanded={defaultExpanded}>
      <aside className={`${styles.sidebar} ${className || ''}`}>
        <nav className={styles.sidebarNav}>
          <div className={styles.sidebarHeader}>
            <img
              src="https://img.logoipsum.com/243.svg"
              className={styles.sidebarLogo}
              alt="Logo"
            />
            <button
              onClick={() => {
                const { toggleExpanded } = useSidebar();
                toggleExpanded();
              }}
              className={styles.sidebarToggleButton}
            >
              {defaultExpanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>

          <div className={styles.sidebarContent}>
            {items.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                onClick={() => onItemClick?.(item)}
              />
            ))}
          </div>

          <div className={styles.sidebarFooter}>
            <img
              src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
              alt="User avatar"
              className={styles.sidebarUserAvatar}
            />
            <div className={styles.sidebarUserInfo}>
              <div className={styles.sidebarUserDetails}>
                <h4 className={styles.sidebarUserName}>John Doe</h4>
                <span className={styles.sidebarUserEmail}>john@example.com</span>
              </div>
            </div>
          </div>
        </nav>
      </aside>
    </SidebarProvider>
  );
};

type SideBarItemProps = {
  icon: any;
  text: string;
  active?: boolean;
  alert?: boolean;
};

export function SidebarItem({ icon, text, active, alert }: Readonly<SideBarItemProps>) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`${styles.sidebarItem} ${
        active ? styles.sidebarItemActive : styles.sidebarItemInactive
      }`}
    >
      {icon}
      <span
        className={`${styles.sidebarItemText} ${
          expanded ? styles.sidebarItemTextExpanded : styles.sidebarItemTextCollapsed
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`${styles.sidebarItemAlert} ${
            expanded ? "" : styles.sidebarItemAlertOffset
          }`}
        />
      )}

      {!expanded && <div className={styles.sidebarItemTooltip}>{text}</div>}
    </li>
  );
}