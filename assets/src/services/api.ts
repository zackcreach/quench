import type { Plant } from '../types/plant';
import { Platform } from 'react-native';

const getApiUrl = (): string => {
  if (__DEV__) {
    return Platform.OS === 'web'
      ? 'http://localhost:4000/api'
      : 'http://localhost:4000/api';
  }
  return '/api';
};

const API_URL = getApiUrl();

interface ServerPlant {
  id: string;
  name: string;
  watering_interval_days: number;
  last_watered_at: string | null;
  order: number;
  inserted_at: string;
  updated_at: string;
}

const toClientPlant = (serverPlant: ServerPlant): Plant => ({
  id: serverPlant.id,
  name: serverPlant.name,
  intervalDays: serverPlant.watering_interval_days,
  lastWatered: serverPlant.last_watered_at
    ? new Date(serverPlant.last_watered_at).getTime()
    : Date.now(),
  order: serverPlant.order,
});

const toServerPlant = (plant: Partial<Plant>): Record<string, unknown> => {
  const serverPlant: Record<string, unknown> = {};

  if (plant.name !== undefined) {
    serverPlant.name = plant.name;
  }
  if (plant.intervalDays !== undefined) {
    serverPlant.watering_interval_days = plant.intervalDays;
  }
  if (plant.lastWatered !== undefined) {
    serverPlant.last_watered_at = new Date(plant.lastWatered).toISOString();
  }
  if (plant.order !== undefined) {
    serverPlant.order = plant.order;
  }

  return serverPlant;
};

export const plantsApi = {
  async list(): Promise<Plant[]> {
    const response = await fetch(`${API_URL}/plants`);
    if (!response.ok) throw new Error('Failed to fetch plants');
    const json = await response.json();
    return json.data.map(toClientPlant);
  },

  async create(plant: { name: string; intervalDays: number; order: number }): Promise<Plant> {
    const response = await fetch(`${API_URL}/plants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plant: toServerPlant(plant) }),
    });
    if (!response.ok) throw new Error('Failed to create plant');
    const json = await response.json();
    return toClientPlant(json.data);
  },

  async update(id: string, updates: Partial<Plant>): Promise<Plant> {
    const response = await fetch(`${API_URL}/plants/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plant: toServerPlant(updates) }),
    });
    if (!response.ok) throw new Error('Failed to update plant');
    const json = await response.json();
    return toClientPlant(json.data);
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/plants/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete plant');
  },

  async water(id: string): Promise<Plant> {
    const response = await fetch(`${API_URL}/plants/${id}/water`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to water plant');
    const json = await response.json();
    return toClientPlant(json.data);
  },
};
