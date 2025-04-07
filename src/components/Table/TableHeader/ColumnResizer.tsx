import React from 'react';
import { ResizeHandle } from './ResizeHandle';

interface ColumnResizerProps<T> {
  columnId: keyof T;
  onResizeStart: (event: React.MouseEvent, columnId: keyof T) => void;
}

/**
 * ColumnResizer component that provides resizing functionality for table columns
 * This component encapsulates the resize handle and its behavior
 */
export function ColumnResizer<T>({ columnId, onResizeStart }: ColumnResizerProps<T>) {
  const handleMouseDown = (event: React.MouseEvent) => {
    onResizeStart(event, columnId);
  };

  return (
    <ResizeHandle
      onMouseDown={handleMouseDown}
      columnId={columnId as string | number}
    />
  );
} 