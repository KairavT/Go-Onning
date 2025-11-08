import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useMatchaStores } from '@/hooks/use-matcha-stores';
import { Place } from '@/services/placesService';

interface MatchaStoresListProps {
  latitude: number;
  longitude: number;
  radius?: number;
}

export function MatchaStoresList({ latitude, longitude, radius }: MatchaStoresListProps) {
  const { stores, loading, error, refetch } = useMatchaStores({
    latitude,
    longitude,
    radius,
    autoFetch: true,
  });

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Finding matcha stores...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  if (stores.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No matcha stores found nearby</Text>
      </View>
    );
  }

  const renderStore = ({ item }: { item: Place }) => (
    <View style={styles.storeCard}>
      <Text style={styles.storeName}>{item.name}</Text>
      <Text style={styles.storeAddress}>{item.vicinity}</Text>
      {item.rating && (
        <Text style={styles.storeRating}>
          ⭐ {item.rating} ({item.user_ratings_total} reviews)
        </Text>
      )}
      {item.opening_hours && (
        <Text style={styles.storeStatus}>
          {item.opening_hours.open_now ? '🟢 Open now' : '🔴 Closed'}
        </Text>
      )}
    </View>
  );

  return (
    <FlatList
      data={stores}
      renderItem={renderStore}
      keyExtractor={(item) => item.place_id}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  list: {
    padding: 16,
  },
  storeCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  storeAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  storeRating: {
    fontSize: 14,
    marginBottom: 4,
  },
  storeStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
});
