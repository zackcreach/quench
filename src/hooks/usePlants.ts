import { useCallback, useEffect, useState } from 'react'
import type { Plant } from '../types/plant'
import {
  cancelPlantNotifications,
  rescheduleAllNotifications,
} from '../utils/notifications'
import { loadPlants, savePlants } from '../utils/storage'

export function usePlants() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPlants().then((loadedPlants) => {
      setPlants(loadedPlants.sort((a, b) => a.order - b.order))
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!isLoading) {
      savePlants(plants)
      rescheduleAllNotifications(plants).catch(() => {})
    }
  }, [plants, isLoading])

  const addPlant = useCallback(
    (plantData: { name: string; intervalDays: number }) => {
      const newPlant: Plant = {
        ...plantData,
        id: Date.now().toString(),
        lastWatered: Date.now(),
        order: plants.length,
      }
      setPlants((currentPlants) => [...currentPlants, newPlant])
    },
    [plants.length]
  )

  const updatePlant = useCallback(
    (
      plantId: string,
      updates: Partial<Pick<Plant, 'name' | 'intervalDays'>>
    ) => {
      setPlants((currentPlants) =>
        currentPlants.map((plant) =>
          plant.id === plantId ? { ...plant, ...updates } : plant
        )
      )
    },
    []
  )

  const deletePlant = useCallback(async (plantId: string) => {
    await cancelPlantNotifications(plantId).catch(() => {})
    setPlants((currentPlants) =>
      currentPlants.filter((plant) => plant.id !== plantId)
    )
  }, [])

  const waterPlant = useCallback((plantId: string) => {
    setPlants((currentPlants) =>
      currentPlants.map((plant) =>
        plant.id === plantId ? { ...plant, lastWatered: Date.now() } : plant
      )
    )
  }, [])

  const reorderPlants = useCallback((data: { from: number; to: number }) => {
    setPlants((currentPlants) => {
      const reordered = [...currentPlants]
      const [removed] = reordered.splice(data.from, 1)
      reordered.splice(data.to, 0, removed)
      return reordered.map((plant, index) => ({ ...plant, order: index }))
    })
  }, [])

  return {
    plants,
    isLoading,
    addPlant,
    updatePlant,
    deletePlant,
    waterPlant,
    reorderPlants,
  }
}
