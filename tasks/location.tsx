import { audioService } from '@/services/audioService';
import fetchMatchaStores from '@/services/fetch-matcha-stores';
import coordsToLocReg from '@/services/geofence';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { GEOFENCING } from './geofencing';

export const LOCATION_BG = 'LOCATION_BG';
export const MATCHA_FETCH = 'MATCHA_FETCH';

TaskManager.defineTask(LOCATION_BG,
  async (res: TaskManager.TaskManagerTaskBody<any>) => {
    if (res.error) return;
    const loc = res.data.locations[0];
    if (!loc) return;
    await AsyncStorage.setItem('loc', JSON.stringify(loc));
    
    // Update audio volume based on proximity to matcha stores
    try {
      const cachedMatcha = await AsyncStorage.getItem('matcha');
      if (cachedMatcha && audioService.getIsPlaying()) {
        const matchaStores = JSON.parse(cachedMatcha);
        if (Array.isArray(matchaStores) && matchaStores.length > 0) {
          await audioService.updateVolumeBasedOnProximity(loc, matchaStores);
        }
      }
    } catch (error) {
      console.error('Error updating audio volume:', error);
    }
  }
);

TaskManager.defineTask(MATCHA_FETCH,
  async (res: TaskManager.TaskManagerTaskBody<any>) => {
    console.log('fdufndinfsidm');
    if (res.error) return;
    const loc = res.data.locations[0];
    if (!loc) return;
    const stores = await fetchMatchaStores(loc);
    await AsyncStorage.setItem('matcha', JSON.stringify(stores));
    if (stores) {
      if (await Location.hasStartedGeofencingAsync(GEOFENCING))
        await Location.stopGeofencingAsync(GEOFENCING);
      await Location.startGeofencingAsync(GEOFENCING, coordsToLocReg(stores));
    }
    
  }
);