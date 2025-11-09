// @ts-nocheck
import fetchMatchaStores from '@/services/fetch-matcha-stores';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface LocationContextType {
  location: Location.LocationObject | null;
  matchaStores: any[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [matchaStores, setMatchaStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        setLoading(false);
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.LocationAccuracy.High,
      });
      setLocation(currentLocation);
      await AsyncStorage.setItem('loc', JSON.stringify(currentLocation));

      // Fetch matcha stores
      const stores = await fetchMatchaStores(currentLocation);
      if (stores && Array.isArray(stores)) {
        setMatchaStores(stores);
        await AsyncStorage.setItem('matcha', JSON.stringify(stores));
      } else {
        setMatchaStores([]);
      }
    } catch (err) {
      console.error('Error fetching location/matcha:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Load cached data first, then fetch fresh data
  useEffect(() => {
    (async () => {
      // Load from cache first
      try {
        const cachedLoc = await AsyncStorage.getItem('loc');
        const cachedMatcha = await AsyncStorage.getItem('matcha');

        if (cachedLoc) {
          setLocation(JSON.parse(cachedLoc));
        }
        if (cachedMatcha) {
          const parsed = JSON.parse(cachedMatcha);
          setMatchaStores(Array.isArray(parsed) ? parsed : []);
        }
      } catch (err) {
        console.error('Error loading cached data:', err);
      }

      // Then fetch fresh data
      await fetchData();
    })();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        matchaStores,
        loading,
        error,
        refetch: fetchData,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within LocationProvider');
  }
  return context;
}
