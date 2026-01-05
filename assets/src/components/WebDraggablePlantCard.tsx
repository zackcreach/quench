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
}: WebDraggablePlantCardProps) {
  const wrapperStyle: React.CSSProperties = {
    cursor: 'grab',
    ...(isDropTarget && {
      borderTopWidth: 3,
      borderTopStyle: 'solid',
      borderTopColor: '#52796f',
    }),
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
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
