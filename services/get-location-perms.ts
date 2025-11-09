import * as Location from 'expo-location';
import { Dispatch } from 'react';
import { PermissionsAndroid } from 'react-native';

export default async function getLocationPerms(setErr: Dispatch<any>) {
  let status = (await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION));
  if (status != 'granted') {
    setErr('Foreground location access denied');
    return;
  }

  let statusBg = (await Location.requestBackgroundPermissionsAsync()).status;
  if (statusBg != 'granted') {
    setErr('Background location access denied');
    return;
  }
}