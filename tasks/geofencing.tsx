import { GeofencingEventType } from 'expo-location';
import * as TaskManager from 'expo-task-manager';
export const GEOFENCING = 'GEOFENCING';

TaskManager.defineTask(GEOFENCING,
  async (res: TaskManager.TaskManagerTaskBody<any>) => {
    if (res.error) return;

    if (res.data.eventType === GeofencingEventType.Enter) {
      console.log('entered region ', res.data.region);
    } else {
      console.log('exited region ', res.data.region);
    }
  }
);