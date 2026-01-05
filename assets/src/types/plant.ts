export interface Plant {
  id: string;
  name: string;
  intervalDays: number;
  lastWatered: number;
  order: number;
}

export type PlantStatus = 'healthy' | 'due-soon' | 'overdue';

export interface PlantStatusInfo {
  type: PlantStatus;
  statusLabel: string;
  countdownLabel: string;
}
