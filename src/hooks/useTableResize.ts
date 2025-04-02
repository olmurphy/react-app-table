import { useState, useCallback, useRef, useEffect } from 'react';

export function useTableResize<T>() {
  const [columnWidths, setColumnWidths] = useState<Record<keyof T, number>>({});
  const resizingColumn = useRef<keyof T | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);

  const handleResizeStart = useCallback(
    (event: React.MouseEvent, columnId: keyof T) => {
      event.preventDefault();
      resizingColumn.current = columnId;
      startX.current = event.clientX;
      startWidth.current = columnWidths[columnId] || 100;

      document.body.style.cursor = 'col-resize';
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', handleResizeEnd);
    },
    [columnWidths]
  );

  const handleResize = useCallback((event: MouseEvent) => {
    if (!resizingColumn.current) return;

    const diff = event.clientX - startX.current;
    const newWidth = Math.max(100, startWidth.current + diff);

    setColumnWidths((prev) => ({
      ...prev,
      [resizingColumn.current!]: newWidth,
    }));
  }, []);

  const handleResizeEnd = useCallback(() => {
    resizingColumn.current = null;
    document.body.style.cursor = '';
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', handleResizeEnd);
  }, [handleResize]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [handleResize, handleResizeEnd]);

  return {
    columnWidths,
    handleResizeStart,
  };
}