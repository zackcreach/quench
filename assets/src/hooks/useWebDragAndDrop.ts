import { useState, useCallback, useRef } from 'react';

interface DragState {
  isDragging: boolean;
  dragIndex: number | null;
  dropIndex: number | null;
}

interface UseWebDragAndDropProps {
  onReorder: (data: { from: number; to: number }) => void;
  itemCount: number;
}

interface DragHandlers {
  handleDragStart: (index: number) => (event: React.DragEvent) => void;
  handleDragEnd: () => void;
  handleDragOver: (index: number) => (event: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (index: number) => (event: React.DragEvent) => void;
}

interface TouchHandlers {
  handleTouchStart: (index: number) => (event: React.TouchEvent) => void;
  handleTouchMove: (event: React.TouchEvent) => void;
  handleTouchEnd: () => void;
}

interface UseWebDragAndDropResult {
  dragState: DragState;
  handlers: DragHandlers;
  touchHandlers: TouchHandlers;
  registerCardRef: (index: number, element: HTMLDivElement | null) => void;
}

export function useWebDragAndDrop({ onReorder, itemCount }: UseWebDragAndDropProps): UseWebDragAndDropResult {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragIndex: null,
    dropIndex: null,
  });

  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const touchDragIndex = useRef<number | null>(null);

  const registerCardRef = useCallback((index: number, element: HTMLDivElement | null) => {
    if (element) {
      cardRefs.current.set(index, element);
    } else {
      cardRefs.current.delete(index);
    }
  }, []);

  const findDropIndex = useCallback((touchY: number): number | null => {
    for (let i = 0; i < itemCount; i++) {
      const element = cardRefs.current.get(i);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (touchY >= rect.top && touchY <= rect.bottom) {
          return i;
        }
      }
    }
    return null;
  }, [itemCount]);

  // Mouse drag handlers (HTML5 Drag and Drop)
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

  // Touch handlers for mobile
  const handleTouchStart = useCallback((index: number) => (event: React.TouchEvent) => {
    touchDragIndex.current = index;
    setDragState({
      isDragging: true,
      dragIndex: index,
      dropIndex: null,
    });
  }, []);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    if (touchDragIndex.current === null) return;

    const touch = event.touches[0];
    const dropIndex = findDropIndex(touch.clientY);

    setDragState((previous) => ({
      ...previous,
      dropIndex: dropIndex !== touchDragIndex.current ? dropIndex : null,
    }));
  }, [findDropIndex]);

  const handleTouchEnd = useCallback(() => {
    const fromIndex = touchDragIndex.current;
    const toIndex = dragState.dropIndex;

    if (fromIndex !== null && toIndex !== null && fromIndex !== toIndex) {
      onReorder({ from: fromIndex, to: toIndex });
    }

    touchDragIndex.current = null;
    setDragState({
      isDragging: false,
      dragIndex: null,
      dropIndex: null,
    });
  }, [dragState.dropIndex, onReorder]);

  return {
    dragState,
    handlers: {
      handleDragStart,
      handleDragEnd,
      handleDragOver,
      handleDragLeave,
      handleDrop,
    },
    touchHandlers: {
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
    },
    registerCardRef,
  };
}
