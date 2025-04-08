import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { SidebarContextType } from './types';

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  defaultExpanded = true,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const toggleItemExpanded = useCallback((id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      expanded,
      toggleExpanded,
      activeItemId,
      setActiveItemId,
      expandedItems,
      toggleItemExpanded,
    }),
    [expanded, toggleExpanded, activeItemId, expandedItems, toggleItemExpanded]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}; 