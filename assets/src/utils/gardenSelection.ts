import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Garden, Session } from '../services/api';

const selectionKey = (userId: string) => `quench:selected-garden:${userId}`;

export async function selectedGarden(session: Session): Promise<Garden | undefined> {
  const [firstGarden] = session.gardens ?? [];
  const userId = session.user?.id;

  if (!firstGarden || !userId) return firstGarden;

  const selectedGardenId = await AsyncStorage.getItem(selectionKey(userId));

  return session.gardens?.find((garden) => garden.id === selectedGardenId) ?? firstGarden;
}

export async function saveSelectedGarden(session: Session, gardenId: string): Promise<void> {
  if (session.user?.id) await AsyncStorage.setItem(selectionKey(session.user.id), gardenId);
}

export async function clearSelectedGarden(session: Session): Promise<void> {
  if (session.user?.id) await AsyncStorage.removeItem(selectionKey(session.user.id));
}
