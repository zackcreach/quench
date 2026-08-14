import { useCallback, useEffect, useState } from 'react';
import type { Plant } from '../types/plant';
import {
  cancelPlantNotifications,
  rescheduleAllNotifications,
} from '../utils/notifications';
import { plantsApi } from '../services/api';

export function usePlants(gardenId: string) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlants = useCallback(async () => {
    try {
      setError(null);
      const loadedPlants = await plantsApi.list(gardenId);
      setPlants(loadedPlants.sort((a, b) => a.order - b.order));
    } catch (loadError) {
      setError('Failed to load plants');
      console.error('Failed to load plants:', loadError);
    } finally {
      setIsLoading(false);
    }
  }, [gardenId]);

  useEffect(() => {
    loadPlants();
  }, [loadPlants]);

  useEffect(() => {
    if (!isLoading && plants.length > 0) {
      rescheduleAllNotifications(plants).catch(() => {});
    }
  }, [plants, isLoading]);

  const addPlant = useCallback(
    async (plantData: { name: string; intervalDays: number }) => {
      try {
        setError(null);
        const newPlant = await plantsApi.create(gardenId, {
          ...plantData,
          order: plants.length,
        });
        setPlants((currentPlants) => [...currentPlants, newPlant]);
      } catch (createError) {
        setError('Failed to add plant');
        console.error('Failed to add plant:', createError);
      }
    },
    [gardenId, plants.length]
  );

  const updatePlant = useCallback(
    async (
      plantId: string,
      updates: Partial<Pick<Plant, 'name' | 'intervalDays'>>
    ) => {
      try {
        setError(null);
        const updatedPlant = await plantsApi.update(gardenId, plantId, updates);
        setPlants((currentPlants) =>
          currentPlants.map((plant) =>
            plant.id === plantId ? updatedPlant : plant
          )
        );
      } catch (updateError) {
        setError('Failed to update plant');
        console.error('Failed to update plant:', updateError);
      }
    },
    [gardenId]
  );

  const deletePlant = useCallback(async (plantId: string) => {
    try {
      setError(null);
      await cancelPlantNotifications(plantId).catch(() => {});
      await plantsApi.delete(gardenId, plantId);
      setPlants((currentPlants) =>
        currentPlants.filter((plant) => plant.id !== plantId)
      );
    } catch (deleteError) {
      setError('Failed to delete plant');
      console.error('Failed to delete plant:', deleteError);
    }
  }, [gardenId]);

  const waterPlant = useCallback(async (plantId: string) => {
    try {
      setError(null);
      const updatedPlant = await plantsApi.water(gardenId, plantId);
      setPlants((currentPlants) =>
        currentPlants.map((plant) =>
          plant.id === plantId ? updatedPlant : plant
        )
      );
    } catch (waterError) {
      setError('Failed to water plant');
      console.error('Failed to water plant:', waterError);
    }
  }, [gardenId]);

  const reorderPlants = useCallback(async (data: { from: number; to: number }) => {
    const reordered = [...plants];
    const [removed] = reordered.splice(data.from, 1);
    reordered.splice(data.to, 0, removed);
    const updatedPlants = reordered.map((plant, index) => ({
      ...plant,
      order: index,
    }));

    setPlants(updatedPlants);

    try {
      await Promise.all(
        updatedPlants.map((plant) =>
          plantsApi.update(gardenId, plant.id, { order: plant.order })
        )
      );
    } catch (reorderError) {
      console.error('Failed to persist reorder:', reorderError);
      loadPlants();
    }
  }, [gardenId, plants, loadPlants]);

  return {
    plants,
    isLoading,
    error,
    addPlant,
    updatePlant,
    deletePlant,
    waterPlant,
    reorderPlants,
    refresh: loadPlants,
  };
}
