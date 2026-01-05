import { useState, useCallback } from 'react';

interface DragState {
  isDragging: boolean;
  dragIndex: number | null;
  dropIndex: number | null;
}

interface UseWebDragAndDropProps {
  onReorder: (data: { from: number; to: number }) => void;
}

interface DragHandlers {
  handleDragStart: (index: number) => (event: React.DragEvent) => void;
  handleDragEnd: () => void;
  handleDragOver: (index: number) => (event: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (index: number) => (event: React.DragEvent) => void;
}

interface UseWebDragAndDropResult {
  dragState: DragState;
  handlers: DragHandlers;
}

export function useWebDragAndDrop({ onReorder }: UseWebDragAndDropProps): UseWebDragAndDropResult {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragIndex: null,
    dropIndex: null,
  });

  const handleDragStart = useCallback((index: number) => (event: React.DragEvent) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(index));
    setDragState({
      isDragging: true,
      dragIndex: index,
      dropIndex: null,
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      dragIndex: null,
      dropIndex: null,
    });
  }, []);

  const handleDragOver = useCallback((index: number) => (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setDragState((previous) => ({
      ...previous,
      dropIndex: index,
    }));
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragState((previous) => ({
      ...previous,
      dropIndex: null,
    }));
  }, []);

  const handleDrop = useCallback((index: number) => (event: React.DragEvent) => {
    event.preventDefault();
    const fromIndex = parseInt(event.dataTransfer.getData('text/plain'), 10);

    if (!isNaN(fromIndex) && fromIndex !== index) {
      onReorder({ from: fromIndex, to: index });
    }

    setDragState({
      isDragging: false,
      dragIndex: null,
      dropIndex: null,
    });
  }, [onReorder]);

  return {
    dragState,
    handlers: {
      handleDragStart,
      handleDragEnd,
      handleDragOver,
      handleDragLeave,
      handleDrop,
    },
  };
}
