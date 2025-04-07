import { useState, useCallback, useRef, useEffect, useMemo } from 'react';

/**
 * Custom hook for handling table column resizing
 * Follows best practices for scalable React/TypeScript applications
 * @returns Object containing column widths and resize handlers
 */
export function useTableResize<T>() {
  // Use a ref to store column widths to avoid unnecessary re-renders
  const columnWidthsRef = useRef<Record<keyof T, number>>({});
  // State for triggering re-renders when needed
  const [, setUpdateTrigger] = useState<number>(0);
  
  // Refs for tracking resize state
  const resizingColumn = useRef<keyof T | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);
  const isResizing = useRef<boolean>(false);

  // Memoized column widths to prevent unnecessary re-renders
  const columnWidths = useMemo(() => columnWidthsRef.current, []);

  // Force a re-render when needed
  const forceUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1);
  }, []);

  // Initialize default column widths if not already set
  const initializeColumnWidths = useCallback((columns: Array<{ id: keyof T }>) => {
    const newWidths: Record<keyof T, number> = {};
    let hasChanges = false;
    
    columns.forEach(column => {
      if (columnWidthsRef.current[column.id] === undefined) {
        newWidths[column.id] = 150; // Default width
        hasChanges = true;
      } else {
        newWidths[column.id] = columnWidthsRef.current[column.id];
      }
    });
    
    if (hasChanges) {
      columnWidthsRef.current = newWidths;
      forceUpdate();
    }
  }, [forceUpdate]);

  // Handle resize start - attach event listeners
  const handleResizeStart = useCallback(
    (event: React.MouseEvent, columnId: keyof T) => {
      event.preventDefault();
      event.stopPropagation();
      
      resizingColumn.current = columnId;
      startX.current = event.clientX;
      startWidth.current = columnWidthsRef.current[columnId] || 150;
      isResizing.current = true;

      // Add event listeners to document for mouse move and up events
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', handleResizeEnd);
    },
    []
  );

  // Handle resize during mouse movement
  const handleResize = useCallback((event: MouseEvent) => {
    if (!resizingColumn.current || !isResizing.current) return;

    const diff = event.clientX - startX.current;
    const newWidth = Math.max(100, startWidth.current + diff); // Minimum width of 100px
    
    // Update the width in the ref
    columnWidthsRef.current[resizingColumn.current] = newWidth;
    
    // Force a re-render to update the UI
    forceUpdate();
  }, [forceUpdate]);

  // Handle resize end - clean up event listeners
  const handleResizeEnd = useCallback(() => {
    if (!isResizing.current) return;
    
    isResizing.current = false;
    resizingColumn.current = null;
    
    // Reset cursor and user selection
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', handleResizeEnd);
  }, [handleResize]);

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [handleResize, handleResizeEnd]);

  return {
    columnWidths,
    handleResizeStart,
    initializeColumnWidths,
  };
}