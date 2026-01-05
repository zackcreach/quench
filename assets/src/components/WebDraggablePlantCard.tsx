import { useCallback } from 'react';
import type { Plant } from '../types/plant';
import { PlantCard } from './PlantCard';

interface WebDraggablePlantCardProps {
  plant: Plant;
  index: number;
  onWater: (plantId: string) => void;
  onEdit: (plant: Plant) => void;
  onDelete: (plant: Plant) => void;
  isDragging: boolean;
  isDropTarget: boolean;
  onDragStart: (event: React.DragEvent) => void;
  onDragEnd: () => void;
  onDragOver: (event: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (event: React.DragEvent) => void;
  onTouchStart: (event: React.TouchEvent) => void;
  onTouchMove: (event: React.TouchEvent) => void;
  onTouchEnd: () => void;
  registerRef: (element: HTMLDivElement | null) => void;
}

export function WebDraggablePlantCard({
  plant,
  onWater,
  onEdit,
  onDelete,
  isDragging,
  isDropTarget,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  registerRef,
}: WebDraggablePlantCardProps) {
  const wrapperStyle: React.CSSProperties = {
    cursor: 'grab',
    touchAction: 'none',
    userSelect: 'none',
    ...(isDropTarget && {
      borderTopWidth: 3,
      borderTopStyle: 'solid',
      borderTopColor: '#52796f',
    }),
  };

  const handleRef = useCallback((element: HTMLDivElement | null) => {
    registerRef(element);
  }, [registerRef]);

  return (
    <div
      ref={handleRef}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={wrapperStyle}
    >
      <PlantCard
        plant={plant}
        onWater={onWater}
        onEdit={onEdit}
        onDelete={onDelete}
        isActive={isDragging}
      />
    </div>
  );
}
