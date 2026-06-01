import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  RefreshControl, 
  Image
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import theme from '../../constants/theme';
import TripCard, { TripHistoryItem } from '../../components/history/TripCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import apiClient from '../../utils/apiClient';
import { useLocation } from '../../contexts/LocationContext';
import { RootStackParamList } from '../../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/core';

const HistoryScreen = () => {
  const { colors } = useTheme();
  const { setFromLocation, setDestinationLocation } = useLocation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  const [trips, setTrips] = useState<TripHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const insets = useSafeAreaInsets();

  const fetchHistory = async () => {
    try {
      const response = await apiClient.get('/rides/history');
      const data = response.data;
      
      if (Array.isArray(data)) {
        setTrips(data);
      }
    } catch (error) {
      console.error("Lỗi khi tải lịch sử chuyến đi:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHistory();
  }, []);

  const handleRebook = (trip: TripHistoryItem) => {
    setFromLocation({
      name: trip.pickup_address || 'Pickup Location',
      address: trip.pickup_address,
      latitude: Number(trip.pickup_latitude),
      longitude: Number(trip.pickup_longitude),
    });

    setDestinationLocation({
      name: trip.dropoff_address || 'Destination',
      address: trip.dropoff_address,
      latitude: Number(trip.dropoff_latitude),
      longitude: Number(trip.dropoff_longitude),
    });

    navigation.navigate('HomeTab'); 
  };

  // UI khi danh sách trống
  const renderEmptyComponent = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Image 
          source={require('../../assets/images/welcome.png')} 
          style={styles.emptyImage}
          resizeMode="contain"
        />
        <Text style={[styles.emptyTitle, { color: colors.textTitle }]}>No Trips Found</Text>
        <Text style={[styles.emptyText, { color: colors.textBody }]}>
          You have no trips to show.
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textTitle }]}>Activities</Text>
    </View>
      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TripCard 
              trip={item} 
              onPressRebook={handleRebook}
              onPressDetail={() => navigation.navigate('TripDetail', { tripId: item.id })}
            />
          )}
          ListEmptyComponent={renderEmptyComponent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              tintColor={theme.COLORS.primary}
              colors={[theme.COLORS.primary]} 
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.SIZES.padding,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.FONTS.bold,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexGrow: 1, 
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.SIZES.padding,
    marginTop: -50,
  },
  emptyImage: { 
    width: 200, 
    height: 200, 
    marginBottom: 20 
  },
  emptyTitle: { 
    fontFamily: theme.FONTS.bold, 
    fontSize: 22, 
    marginBottom: 10 
  },
  emptyText: { 
    fontFamily: theme.FONTS.regular, 
    fontSize: 16, 
    textAlign: 'center' 
  },
});

export default HistoryScreen;