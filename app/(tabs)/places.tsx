import { ThemedText } from '@/components/themed-text';
import getLocationPerms from '@/services/get-location-perms';
import { LOCATION_BG } from '@/tasks/location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
  const [err, setErr] = useState<string | null>(null);
  const [loc, setLoc] = useState<Location.LocationObject | null>(null);

  useEffect(() => {(async () => { getLocationPerms(setErr) })()});
  Location.startLocationUpdatesAsync(LOCATION_BG,
    {
      accuracy: Location.LocationAccuracy.Balanced,
      distanceInterval: 1,
      foregroundService: {
        notificationTitle: "Searching for matcha...",
        notificationBody: "Your location is being used in the background"
      },
      timeInterval: 1000,
    }
  );

  useEffect(() => {( async () => {
    const lastLoc = await AsyncStorage.getItem('loc');
    if (lastLoc) setLoc(JSON.parse(lastLoc));
  })()});

  let text = '...';
  if (err) text = err;
  else if (text != null) text = `${loc?.coords.latitude}, ${loc?.coords.longitude}`
  else text = 'Loading...';

  return (
    <ThemedText>{text}</ThemedText>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
