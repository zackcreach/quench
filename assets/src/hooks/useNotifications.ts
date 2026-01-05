import { useEffect, useState } from 'react';
import { requestNotificationPermissions } from '../utils/notifications';

export function useNotifications() {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    requestNotificationPermissions().then(setHasPermission);
  }, []);

  return { hasPermission };
}
