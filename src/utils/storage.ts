import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Plant } from '../types/plant';

const PLANTS_KEY = '@quench:plants';

export async function loadPlants(): Promise<Plant[]> {
  const jsonValue = await AsyncStorage.getItem(PLANTS_KEY);
  return jsonValue ? JSON.parse(jsonValue) : [];
}

export async function savePlants(plants: Plant[]): Promise<void> {
  const jsonValue = JSON.stringify(plants);
  await AsyncStorage.setItem(PLANTS_KEY, jsonValue);
}
