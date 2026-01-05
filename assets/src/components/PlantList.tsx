import { StyleSheet, Platform, ScrollView } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import type { Plant } from '../types/plant';
import { PlantCard } from './PlantCard';
import { WebDraggablePlantCard } from './WebDraggablePlantCard';
import { EmptyState } from './EmptyState';
import { useWebDragAndDrop } from '../hooks/useWebDragAndDrop';

interface PlantListProps {
  plants: Plant[];
  onWater: (plantId: string) => void;
  onEdit: (plant: Plant) => void;
  onDelete: (plant: Plant) => void;
  onReorder: (data: { from: number; to: number }) => void;
}

export function PlantList({ plants, onWater, onEdit, onDelete, onReorder }: PlantListProps) {
  const { dragState, handlers } = useWebDragAndDrop({ onReorder });

  if (plants.length === 0) {
    return <EmptyState />;
  }

  if (Platform.OS === 'web') {
    return (
      <ScrollView contentContainerStyle={styles.list}>
        {plants.map((plant, index) => (
          <WebDraggablePlantCard
            key={`${plant.id}-${plant.lastWatered}`}
            plant={plant}
            index={index}
            onWater={onWater}
            onEdit={onEdit}
            onDelete={onDelete}
            isDragging={dragState.dragIndex === index}
            isDropTarget={dragState.dropIndex === index && dragState.dragIndex !== index}
            onDragStart={handlers.handleDragStart(index)}
            onDragEnd={handlers.handleDragEnd}
            onDragOver={handlers.handleDragOver(index)}
            onDragLeave={handlers.handleDragLeave}
            onDrop={handlers.handleDrop(index)}
          />
        ))}
      </ScrollView>
    );
  }

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Plant>) => (
    <ScaleDecorator>
      <PlantCard
        plant={item}
        onWater={onWater}
        onEdit={onEdit}
        onDelete={onDelete}
        drag={drag}
        isActive={isActive}
      />
    </ScaleDecorator>
  );

  return (
    <DraggableFlatList
      data={plants}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      onDragEnd={onReorder}
      contentContainerStyle={styles.list}
      extraData={plants}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
  },
});
