import { Platform, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import * as Location from 'expo-location';

export default async function PlacesScreen() {
  await Location.requestForegroundPermissionsAsync();
  return (
    <ThemedText type="title">Hi</ThemedText>
  );
}