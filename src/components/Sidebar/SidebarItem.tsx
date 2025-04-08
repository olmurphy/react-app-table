import React, { memo } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { SidebarItemProps } from './types';
import { useSidebar } from './SidebarContext';
import styles from './Sidebar.module.css';

export const SidebarItem: React.FC<SidebarItemProps> = memo(({ item, level = 0 }) => {
  const {
    expanded,
    activeItemId,
    setActiveItemId,
    expandedItems,
    toggleItemExpanded,
  } = useSidebar();

  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems.has(item.id);
  const isActive = activeItemId === item.id;

  const handleClick = () => {
    if (hasChildren) {
      toggleItemExpanded(item.id);
    }
    setActiveItemId(item.id);
  };

  const paddingLeft = `${level * 1.5}rem`;

  return (
    <div className={styles.sidebarItemContainer}>
      <div
        className={`${styles.sidebarItem} ${isActive ? styles.sidebarItemActive : ''}`}
        style={{ paddingLeft }}
        onClick={handleClick}
      >
        <div className={styles.sidebarItemContent}>
          {hasChildren && (
            <span className={styles.sidebarItemIcon}>
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
          {item.icon && <span className={styles.sidebarItemIcon}>{item.icon}</span>}
          {expanded && <span className={styles.sidebarItemLabel}>{item.label}</span>}
        </div>
      </div>
      {hasChildren && isExpanded && expanded && (
        <div className={styles.sidebarItemChildren}>
          {item.children.map((child) => (
            <SidebarItem key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
});

SidebarItem.displayName = 'SidebarItem'; 