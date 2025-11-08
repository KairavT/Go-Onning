import { ThemedText } from '@/components/themed-text';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
  const [loc, setLoc] = useState<Location.LocationObject | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestBackgroundPermissionsAsync();
      if (status != 'granted') {
        setErr('Location access denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync();
      setLoc(location);
    })();
  });

  let text = '...';
  if (err) text = err;
  else text = JSON.stringify(loc);

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
