import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import type { Plant } from '../types/plant';

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }

  if (!Device.isDevice) {
    console.warn('Push notifications require a physical device');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('watering-reminders', {
      name: 'Watering Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#52796f',
    });
  }

  return true;
}

export async function scheduleWateringNotification(plant: Plant): Promise<string | null> {
  if (Platform.OS === 'web') {
    return null;
  }

  const nextWateringTime = plant.lastWatered + plant.intervalDays * MILLISECONDS_PER_DAY;
  const triggerDate = new Date(nextWateringTime);

  if (triggerDate.getTime() <= Date.now()) {
    return null;
  }

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: `Time to water ${plant.name}!`,
      body: `Your ${plant.name} is due for watering.`,
      data: { plantId: plant.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });

  return identifier;
}

export async function cancelPlantNotifications(plantId: string): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }

  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  const plantNotifications = scheduledNotifications.filter(
    (notification) => notification.content.data?.plantId === plantId
  );

  for (const notification of plantNotifications) {
    await Notifications.cancelScheduledNotificationAsync(notification.identifier);
  }
}

export async function rescheduleAllNotifications(plants: Plant[]): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }

  await Notifications.cancelAllScheduledNotificationsAsync();

  for (const plant of plants) {
    await scheduleWateringNotification(plant);
  }
}
