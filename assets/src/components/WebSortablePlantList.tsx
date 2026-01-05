import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Plant } from '../types/plant';
import { PlantCard } from './PlantCard';

interface SortablePlantCardProps {
  plant: Plant;
  onWater: (plantId: string) => void;
  onEdit: (plant: Plant) => void;
  onDelete: (plant: Plant) => void;
}

function SortablePlantCard({ plant, onWater, onEdit, onDelete }: SortablePlantCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: plant.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    touchAction: 'none',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
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

interface WebSortablePlantListProps {
  plants: Plant[];
  onWater: (plantId: string) => void;
  onEdit: (plant: Plant) => void;
  onDelete: (plant: Plant) => void;
  onReorder: (data: { from: number; to: number }) => void;
}

export function WebSortablePlantList({
  plants,
  onWater,
  onEdit,
  onDelete,
  onReorder,
}: WebSortablePlantListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = plants.findIndex((plant) => plant.id === active.id);
      const newIndex = plants.findIndex((plant) => plant.id === over.id);
      onReorder({ from: oldIndex, to: newIndex });
    }
  };

  const activePlant = activeId ? plants.find((plant) => plant.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={plants.map((p) => p.id)} strategy={verticalListSortingStrategy}>
        <div style={{ paddingTop: 8, paddingBottom: 8 }}>
          {plants.map((plant) => (
            <SortablePlantCard
              key={plant.id}
              plant={plant}
              onWater={onWater}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activePlant ? (
          <PlantCard
            plant={activePlant}
            onWater={onWater}
            onEdit={onEdit}
            onDelete={onDelete}
            isActive
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
