import React from 'react';
import { ChevronFirst, ChevronLast } from 'lucide-react';
import { SidebarProps } from './types';
import { SidebarProvider } from './SidebarContext';
import { SidebarItem } from './SidebarItem';
import styles from './Sidebar.module.css';

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