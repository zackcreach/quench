import { useCallback, useEffect, useState } from 'react';
import type { Plant } from '../types/plant';
import {
  cancelPlantNotifications,
  rescheduleAllNotifications,
} from '../utils/notifications';
import { plantsApi } from '../services/api';

export function usePlants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlants = useCallback(async () => {
    try {
      setError(null);
      const loadedPlants = await plantsApi.list();
      setPlants(loadedPlants.sort((a, b) => a.order - b.order));
    } catch (loadError) {
      setError('Failed to load plants');
      console.error('Failed to load plants:', loadError);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
        const newPlant = await plantsApi.create({
          ...plantData,
          order: plants.length,
        });
        setPlants((currentPlants) => [...currentPlants, newPlant]);
      } catch (createError) {
        setError('Failed to add plant');
        console.error('Failed to add plant:', createError);
      }
    },
    [plants.length]
  );

  const updatePlant = useCallback(
    async (
      plantId: string,
      updates: Partial<Pick<Plant, 'name' | 'intervalDays'>>
    ) => {
      try {
        setError(null);
        const updatedPlant = await plantsApi.update(plantId, updates);
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
    []
  );

  const deletePlant = useCallback(async (plantId: string) => {
    try {
      setError(null);
      await cancelPlantNotifications(plantId).catch(() => {});
      await plantsApi.delete(plantId);
      setPlants((currentPlants) =>
        currentPlants.filter((plant) => plant.id !== plantId)
      );
    } catch (deleteError) {
      setError('Failed to delete plant');
      console.error('Failed to delete plant:', deleteError);
    }
  }, []);

  const waterPlant = useCallback(async (plantId: string) => {
    try {
      setError(null);
      const updatedPlant = await plantsApi.water(plantId);
      setPlants((currentPlants) =>
        currentPlants.map((plant) =>
          plant.id === plantId ? updatedPlant : plant
        )
      );
    } catch (waterError) {
      setError('Failed to water plant');
      console.error('Failed to water plant:', waterError);
    }
  }, []);

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
          plantsApi.update(plant.id, { order: plant.order })
        )
      );
    } catch (reorderError) {
      console.error('Failed to persist reorder:', reorderError);
      loadPlants();
    }
  }, [plants, loadPlants]);

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
