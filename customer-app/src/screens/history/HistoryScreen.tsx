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

// const MOCK_HISTORY_TRIPS: TripHistoryItem[] = [
//   {
//     id: 'hist_mock_1',
//     status: 'COMPLETED',
//     estimated_fare: 125000,
//     created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 tiếng trước
//     pickup_name: 'Trường Đại học Công nghệ Thông tin (UIT)',
//     pickup_address: 'Khu phố 6, Phường Linh Trung, TP. Thủ Đức',
//     dropoff_name: 'Landmark 81',
//     dropoff_address: '720A Điện Biên Phủ, Phường 22, Bình Thạnh',
//     pickup_latitude: 10.8700,
//     pickup_longitude: 106.8031,
//     dropoff_latitude: 10.7946,
//     dropoff_longitude: 106.7226,
//   },
//   {
//     id: 'hist_mock_2',
//     status: 'CANCELLED_BY_DRIVER',
//     estimated_fare: 45000,
//     created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 ngày trước
//     pickup_name: 'Ký túc xá Khu A',
//     pickup_address: 'ĐHQG TP.HCM, Phường Linh Trung, TP. Thủ Đức',
//     dropoff_name: 'Suối Tiên Theme Park',
//     dropoff_address: '120 Xa lộ Hà Nội, Phường Tân Phú, TP. Thủ Đức',
//     pickup_latitude: 10.8782,
//     pickup_longitude: 106.8063,
//     dropoff_latitude: 10.8634,
//     dropoff_longitude: 106.8028,
//   },
//   {
//     id: 'hist_mock_3',
//     status: 'COMPLETED',
//     estimated_fare: 210000,
//     created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 ngày trước
//     pickup_name: 'Sân bay Tân Sơn Nhất (Quốc nội)',
//     pickup_address: 'Trường Sơn, Phường 2, Tân Bình',
//     dropoff_name: 'Chợ Bến Thành',
//     dropoff_address: 'Lê Lợi, Phường Bến Thành, Quận 1',
//     pickup_latitude: 10.8149,
//     pickup_longitude: 106.6634,
//     dropoff_latitude: 10.7725,
//     dropoff_longitude: 106.6980,
//   }
// ];

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
        // setTrips([...MOCK_HISTORY_TRIPS, ...data]);
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
      name: trip.pickup_name || 'Pickup Location',
      address: trip.pickup_address,
      latitude: Number(trip.pickup_latitude),
      longitude: Number(trip.pickup_longitude),
    });

    setDestinationLocation({
      name: trip.dropoff_name || 'Destination',
      address: trip.dropoff_address,
      latitude: Number(trip.dropoff_latitude),
      longitude: Number(trip.dropoff_longitude),
    });

    navigation.navigate('HomeTab'); 
  };

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