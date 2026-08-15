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
let csrfToken = '';

export interface Garden {
  id: string;
  name: string;
}

export interface Session {
  authenticated: boolean;
  csrf_token: string;
  user?: { id: string; email: string };
  gardens?: Garden[];
}

const request = async (path: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response;
};

export const authApi = {
  async session(): Promise<Session> {
    const response = await request('/session');
    const session = await response.json();
    csrfToken = session.csrf_token;
    return session;
  },

  async register(email: string, password: string, turnstileToken: string): Promise<Session> {
    const response = await request('/register', {
      method: 'POST',
      body: JSON.stringify({ user: { email, password, password_confirmation: password }, turnstile_token: turnstileToken }),
    });
    const session = await response.json();
    csrfToken = session.csrf_token;
    return session;
  },

  async logout(): Promise<void> {
    await request('/session', { method: 'DELETE' });
    csrfToken = '';
  },

  async login(email: string, password: string): Promise<Session> {
    const response = await request('/login', { method: 'POST', body: JSON.stringify({ user: { email, password } }) });
    const session = await response.json();
    csrfToken = session.csrf_token;
    return session;
  },
};

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
  async list(gardenId: string): Promise<Plant[]> {
    const response = await request(`/gardens/${gardenId}/plants`);
    const json = await response.json();
    return json.data.map(toClientPlant);
  },

  async create(gardenId: string, plant: { name: string; intervalDays: number; order: number }): Promise<Plant> {
    const response = await request(`/gardens/${gardenId}/plants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plant: toServerPlant(plant) }),
    });
    const json = await response.json();
    return toClientPlant(json.data);
  },

  async update(gardenId: string, id: string, updates: Partial<Plant>): Promise<Plant> {
    const response = await request(`/gardens/${gardenId}/plants/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plant: toServerPlant(updates) }),
    });
    const json = await response.json();
    return toClientPlant(json.data);
  },

  async delete(gardenId: string, id: string): Promise<void> {
    await request(`/gardens/${gardenId}/plants/${id}`, {
      method: 'DELETE',
    });
  },

  async water(gardenId: string, id: string): Promise<Plant> {
    const response = await request(`/gardens/${gardenId}/plants/${id}/water`, {
      method: 'POST',
    });
    const json = await response.json();
    return toClientPlant(json.data);
  },
};
