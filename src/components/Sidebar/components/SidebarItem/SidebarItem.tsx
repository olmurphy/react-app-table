import { ChevronDown, ChevronRight } from "lucide-react";
import React, { memo } from "react";
import { useSidebar } from "../../contexts/SidebarContexts";
import { SidebarItemData } from "../../types/SidebarTypes";
import styles from "./SidebarItem.module.css";

export interface SidebarItemProps {
  item: SidebarItemData;
  level?: number;
  onClick?: (item: SidebarItemData) => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = memo(({ item, level = 0, onClick }) => {
  const { expanded, activeItemId, setActiveItemId, expandedItems, toggleItemExpanded } = useSidebar();

  const hasChildren = item.children && item.children?.length > 0;
  const isExpanded = expandedItems.has(item.id);
  const isActive = activeItemId === item.id;

  const handleClick = () => {
    if (hasChildren) {
      toggleItemExpanded(item.id);
    } else {
      setActiveItemId(item.id);
      onClick?.(item);
    }
  };

  const paddingLeft = `${level * 1.5}rem`;

  return (
    <div className={styles.sidebarItemContainer}>
      <div
        className={`${styles.sidebarItem} ${isActive ? styles.sidebarItemActive : ""}`}
        style={{ paddingLeft }}
        onClick={handleClick}
      >
        <div className={styles.sidebarItemContent}>
          {item.icon && <span className={styles.sidebarItemIcon}>{item.icon}</span>}
          {hasChildren && (
            <span className={styles.sidebarItemIcon}>
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
          {expanded && <span className={styles.sidebarItemLabel}>{item.label}</span>}
          {!expanded && <span className={styles.sidebarItemTooltip}>{item.label}</span>}
        </div>
      </div>
      {hasChildren && isExpanded && expanded && (
        <div className={styles.sidebarItemChildren}>
          {item.children?.map((child) => (
            <SidebarItem key={child.id} item={child} level={level + 1} onClick={onClick} />
          ))}
        </div>
      )}
    </div>
  );
});

SidebarItem.displayName = "SidebarItem";
