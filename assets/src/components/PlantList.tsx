import { StyleSheet, Platform, ScrollView } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import type { Plant } from '../types/plant';
import { PlantCard } from './PlantCard';
import { EmptyState } from './EmptyState';

interface PlantListProps {
  plants: Plant[];
  onWater: (plantId: string) => void;
  onEdit: (plant: Plant) => void;
  onDelete: (plant: Plant) => void;
  onReorder: (data: { from: number; to: number }) => void;
}

export function PlantList({ plants, onWater, onEdit, onDelete, onReorder }: PlantListProps) {
  if (plants.length === 0) {
    return <EmptyState />;
  }

  if (Platform.OS === 'web') {
    return (
      <ScrollView contentContainerStyle={styles.list}>
        {plants.map((plant) => (
          <PlantCard
            key={`${plant.id}-${plant.lastWatered}`}
            plant={plant}
            onWater={onWater}
            onEdit={onEdit}
            onDelete={onDelete}
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
