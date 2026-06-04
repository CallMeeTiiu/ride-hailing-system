import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faUser, faStar, faMoneyBill, faCalendarAlt, faCar, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../contexts/ThemeContext';
import apiClient from '../../utils/apiClient';
import theme from '../../constants/theme';

export interface TripDetailData {
  id: string;
  status: string;
  estimated_fare: number;
  created_at: string;
  pickup_address: string;
  dropoff_address: string;
  payment_method: string;
  driver?: {
    fullName: string;
    phone: string;
    vehicle_plate: string;
    vehicle_type: string;
    rating?: number;
    avatar?: string;
  };
}

const TripDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  
  const tripId = route.params?.tripId;

  const [trip, setTrip] = useState<TripDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTripDetail = async () => {
      try {
        const response = await apiClient.get(`/rides/${tripId}`);
        setTrip(response.data); 
      } catch (error: any) {
        console.log("Lỗi tải chi tiết chuyến đi:", error.response?.data || error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (tripId) fetchTripDetail();
  }, [tripId]);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return { text: 'Completed', color: theme.stateColors.completed, bg: theme.COLORS.background}; 
      case 'CANCELLED':
      case 'CANCELLED_BY_CUSTOMER':
      case 'CANCELLED_BY_DRIVER':
        return { text: 'Cancelled', color: theme.stateColors.cancelled, bg: theme.COLORS.background }; 
      case 'IN_PROGRESS':
        return { text: 'In Progress', color: theme.stateColors.inProgress, bg: theme.COLORS.background }; 
      default:
        return { text: 'Pending', color: theme.stateColors.pending, bg: theme.COLORS.background }; 
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nearby';
    const date = new Date(dateString);
    return date.toLocaleString('eng-ENG', { 
        day: '2-digit', month: '2-digit', year: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
    });
  }

  const formatPrice = (price: number) => {
    if (!price) return '0 VND';
    
    return Number(price).toLocaleString('vi-VN') + " VND";
  };

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <Text style={{ color: colors.textBody, marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={[styles.header]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <FontAwesomeIcon icon={faArrowLeft} size={20} color={colors.textTitle} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.textTitle }]}>Select Destination</Text>
            {/*eslint-disable-next-line react-native/no-inline-styles*/}
            <View style={{ width: 20 }} /> 
        </View>
        <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
            <Image 
                source={require('../../assets/images/no_locations_found.png')} 
                style={styles.emptyImage}
                resizeMode="contain"
            />
            <Text style={[styles.emptyTitle, { color: colors.textTitle }]}>Cannot find trip details</Text>
        </View>
      </View>
    );
  }

  const statusUI = getStatusDisplay(trip.status);

  const displayDriver = trip.driver ? {
    ...trip.driver,
    fullName: trip.driver.fullName || 'Nguyễn Văn A',
    avatar: trip.driver.avatar || 'https://randomuser.me/api/portraits/men/33.jpg',
  } : {
    fullName: 'Lê Văn Mock',
    phone: '0909123456',
    vehicle_plate: '59-S1 999.99',
    vehicle_type: 'Honda Winner',
    rating: 4.9,
    avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* HEADER */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color={colors.textTitle} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textTitle }]}>Trip Details</Text>
        { /* eslint-disable-next-line react-native/no-inline-styles */ }
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.sectionHeader}>
          <Text style={[styles.tripIdText, { color: colors.textBody }]}>Trip ID: {trip.id.split('-')[0].toUpperCase()}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusUI.bg }]}>
            <Text style={[styles.statusText, { color: statusUI.color }]}>{statusUI.text}</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.driverSection}>
          <Image 
            source={{ uri: displayDriver.avatar }} 
            style={styles.avatarPlaceholder} 
          />
          <View style={styles.driverInfo}>
            <Text style={[styles.driverName, { color: colors.textTitle }]}>
              {displayDriver.fullName}
            </Text>
            <View style={styles.driverSubInfo}>
              <Text style={[styles.vehicleText, { color: colors.textBody }]}>
                {displayDriver.vehicle_type} • {displayDriver.vehicle_plate}
              </Text>
              
              {displayDriver.rating ? (
                <View style={styles.ratingBox}>
                  <FontAwesomeIcon icon={faStar} size={12} color={theme.COLORS.primary} />
                  <Text style={styles.ratingText}>{displayDriver.rating}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {trip.driver ? <View style={[styles.divider, { backgroundColor: colors.border }]} /> : null}

        <View style={styles.routeSection}>
          <Text style={[styles.sectionTitle, { color: colors.textTitle }]}>Route</Text>
          <View style={styles.routeContainer}>
            <View style={styles.iconColumn}>
              <FontAwesomeIcon icon={faMapMarkerAlt} size={16} color={theme.stateColors.cancelled} />
              <View style={[styles.dashedLine, { borderColor: colors.textBody }]} />
              <FontAwesomeIcon icon={faMapMarkerAlt} size={16} color={theme.stateColors.completed} />
            </View>

            <View style={styles.addressColumn}>
              <View style={styles.addressItem}>
                <Text style={[styles.addressText, { color: colors.textTitle }]} numberOfLines={2}>
                  {trip.pickup_address}
                </Text>
              </View>
              <View style={styles.addressItem}>
                <Text style={[styles.addressText, { color: colors.textTitle }]} numberOfLines={2}>
                  {trip.dropoff_address}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.receiptSection}>
          <Text style={[styles.sectionTitle, { color: colors.textTitle }]}>Receipt</Text>
          
          <View style={styles.receiptRow}>
            <View style={styles.receiptLabelGroup}>
              <FontAwesomeIcon icon={faMoneyBill} size={16} color={theme.COLORS.primary} />
              <Text style={styles.receiptLabel}>Fare</Text>
            </View>
            <Text style={[styles.receiptValue, { color: colors.textTitle }]}>
              {formatPrice(trip.estimated_fare)}
            </Text>
          </View>

          <View style={styles.receiptRow}>
            <View style={styles.receiptLabelGroup}>
              <FontAwesomeIcon icon={faCalendarAlt} size={16} color={theme.COLORS.primary} />
              <Text style={styles.receiptLabel}>Booking Time</Text>
            </View>
            <Text style={[styles.receiptValue, { color: colors.textTitle }]}>
              {formatDate(trip.created_at)}
            </Text>
          </View>

          <View style={styles.receiptRow}>
            <View style={styles.receiptLabelGroup}>
              <FontAwesomeIcon icon={faCar} size={16} color={theme.COLORS.primary} />
              <Text style={styles.receiptLabel}>Payment Method</Text>
            </View>
            <Text style={[styles.receiptValue, { color: colors.textTitle }]}>
              {trip.payment_method === 'CASH' ? 'Cash' : trip.payment_method}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
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
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    width: '100%', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 15 
  },
  headerRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontFamily: theme.FONTS.bold,
    fontSize: 18,
  },
  scrollContent: { 
    padding: 20 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  tripIdText: { 
    fontSize: 14, 
    fontFamily: 'monospace',
  },
  statusBadge: { 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 12 
  },
  statusText: { 
    fontSize: 12, 
    fontWeight: '600' 
  },
  divider: { 
    height: 1, 
    opacity: 0.2, 
    marginVertical: 20 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 15 
  },
  driverSection: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  avatarPlaceholder: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  driverInfo: { 
    flex: 1 
  },
  driverName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 4 
  },
  driverSubInfo: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  vehicleText: { 
    fontSize: 14, 
    marginRight: 10 
  },
  ratingBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: theme.COLORS.backgroundLight, 
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    borderRadius: 8 
  },
  ratingText: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#B45309', 
    marginLeft: 4 
  },
  routeSection: { 
    marginBottom: 10 
  },
  routeContainer: { 
    flexDirection: 'row' 
  },
  iconColumn: { 
    alignItems: 'center', 
    width: 30, 
    marginRight: 10,
    paddingVertical: 10,
  },
  outerCircle: { 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  dashedLine: { 
    flex: 1, 
    borderWidth: 1, 
    borderStyle: 'dashed', 
    marginVertical: 4 
  },
  addressColumn: { 
    flex: 1, 
    justifyContent: 'space-between',
  },
  addressItem: { 
    minHeight: 40, 
    justifyContent: 'center',
  },
  addressText: { 
    fontSize: 14, 
    lineHeight: 20 
  },
  receiptSection: { 
    marginBottom: 30 
  },
  receiptRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  receiptLabelGroup: { 
    flexDirection: 'row', 
    alignItems: 'center',
    width: 140 
  },
  receiptLabel: { 
    marginLeft: 10, 
    fontSize: 14,
    color: theme.COLORS.primary,
  },
  receiptValue: { 
    fontSize: 15, 
    fontWeight: '600', 
    flex: 1, 
    textAlign: 'right' 
  },
});

export default TripDetailScreen;