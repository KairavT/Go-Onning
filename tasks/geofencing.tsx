import { audioService } from '@/services/audioService';
import { GeofencingEventType } from 'expo-location';
import * as TaskManager from 'expo-task-manager';

export const GEOFENCING = 'GEOFENCING';

TaskManager.defineTask(GEOFENCING,
  async (res: TaskManager.TaskManagerTaskBody<any>) => {
    if (res.error) {
      console.error('Geofencing error:', res.error);
      return;
    }

    if (res.data.eventType === GeofencingEventType.Enter) {
      console.log('Entered matcha store region:', res.data.region);
      
      // Initialize and start playing music when entering any geofence
      await audioService.initialize();
      await audioService.play();
    } else {
      console.log('Exited matcha store region:', res.data.region);
      
      // Stop music when exiting all geofences
      // Note: This will stop even if still in another geofence
      // You may want to check if still in any geofence before stopping
      await audioService.stop();
    }
  }
);