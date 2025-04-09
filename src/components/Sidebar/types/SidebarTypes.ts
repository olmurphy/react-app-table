import { LucideIcon } from 'lucide-react';

export interface SidebarItemData {
  id: string;
  label: string;
  link: string;
  icon?: any;
  path?: string;
  children?: SidebarItemData[];
  isExpanded?: boolean;
  isActive?: boolean;
  metadata?: Record<string, unknown>;
}

export interface SidebarContextType {
  expanded: boolean;
  toggleExpanded: () => void;
  activeItemId: string | null;
  setActiveItemId: (id: string | null) => void;
  expandedItems: Set<string>;
  toggleItemExpanded: (id: string) => void;
}



export interface SidebarGroupProps {
  items: SidebarItemData[];
  level?: number;
}

export interface SidebarProps {
  items: SidebarItemData[];
  defaultExpanded?: boolean;
  onItemClick?: (item: SidebarItemData) => void;
  className?: string;
} 