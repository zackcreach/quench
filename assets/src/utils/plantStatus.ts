import type { Plant, PlantStatusInfo } from '../types/plant';

const MILLISECONDS_PER_HOUR = 1000 * 60 * 60;
const MILLISECONDS_PER_DAY = MILLISECONDS_PER_HOUR * 24;

export function formatTimeRemaining(milliseconds: number): string {
  const totalHours = milliseconds / MILLISECONDS_PER_HOUR;
  const days = Math.floor(totalHours / 24);
  const hours = Math.floor(totalHours % 24);

  if (days > 0) {
    const dayLabel = days === 1 ? 'day' : 'days';
    const hourLabel = hours === 1 ? 'hour' : 'hours';
    return `${days} ${dayLabel}, ${hours} ${hourLabel}`;
  }

  if (hours > 0) {
    const hourLabel = hours === 1 ? 'hour' : 'hours';
    return `${hours} ${hourLabel}`;
  }

  return 'Less than 1 hour';
}

export function getPlantStatus(plant: Plant): PlantStatusInfo {
  const now = Date.now();
  const nextWateringTime = plant.lastWatered + plant.intervalDays * MILLISECONDS_PER_DAY;
  const timeUntilWatering = nextWateringTime - now;

  if (timeUntilWatering < 0) {
    const overdueTime = Math.abs(timeUntilWatering);
    return {
      type: 'overdue',
      statusLabel: 'Overdue',
      countdownLabel: formatTimeRemaining(overdueTime),
    };
  }

  if (timeUntilWatering <= MILLISECONDS_PER_DAY) {
    return {
      type: 'due-soon',
      statusLabel: 'Due Soon',
      countdownLabel: formatTimeRemaining(timeUntilWatering),
    };
  }

  return {
    type: 'healthy',
    statusLabel: 'Healthy',
    countdownLabel: formatTimeRemaining(timeUntilWatering),
  };
}
