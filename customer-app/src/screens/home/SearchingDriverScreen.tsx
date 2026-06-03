import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Alert, Image } from 'react-native';

import { useTheme } from '../../contexts/ThemeContext';
import theme from '../../constants/theme';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCarOn } from '@fortawesome/free-solid-svg-icons';

import AppMap from '../../components/home/AppMap';
import RadarAnimation from '../../components/home/RadarAnimation';
import SwipeButton from '../../components/booking/SwipeButton';

import apiClient from '../../utils/apiClient';
import io, { Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useLocation } from '../../contexts/LocationContext';
import { MapBackgroundRef } from '../../components/home/MapBackground';

const SearchingDriverScreen = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const route = useRoute<RouteProp<RootStackParamList, 'SearchingDriver'>>();
  const isRecovery = route.params?.isRecovery;
  const recoveredTripId = route.params?.tripId;
  const { selectedVehicleId, fare_quote_id } = route.params || {};

  const [tripId, setTripId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const { fromLocation, destinationLocation } = useLocation();
  const mapRef = useRef<MapBackgroundRef>(null);

  useEffect(() => {
    if (fromLocation) {
      mapRef.current?.jumpToLocation(fromLocation.latitude, fromLocation.longitude);
    }
  }, [fromLocation]);

  useEffect(() => {
    if (isRecovery && recoveredTripId) {
      console.log("Phục hồi chuyến đi, không tạo cuốc mới!");
      setTripId(recoveredTripId);
      return;
    }

    const createRideRequest = async () => {
      try {
        if (!fare_quote_id || !selectedVehicleId) {
          Alert.alert('Lỗi', 'Thiếu thông tin báo giá. Vui lòng quay lại chọn xe.');
          navigation.goBack();
          return;
        }

        const response = await apiClient.post('/rides/request', {
          fare_quote_id: fare_quote_id,
          vehicle_type: selectedVehicleId,
          payment_method: 'CASH', 
          pickup_address: fromLocation?.address || fromLocation?.name,
          dropoff_address: destinationLocation?.address || destinationLocation?.name,
          pickup_latitude: fromLocation?.latitude,
          pickup_longitude: fromLocation?.longitude,
          dropoff_latitude: destinationLocation?.latitude,
          dropoff_longitude: destinationLocation?.longitude,
        });

        setTripId(response.data.id);
        console.log('Tạo chuyến thành công, Trip ID:', response.data.id);
      } catch (error: any) {
        console.log('Lỗi tạo chuyến xe:', error.response?.data || error.message);
        Alert.alert('Lỗi', 'Không thể tạo chuyến đi lúc này.');
        navigation.goBack();
      }
    };  

    createRideRequest();
  }, [destinationLocation?.address, destinationLocation?.latitude, destinationLocation?.longitude, destinationLocation?.name, fare_quote_id, fromLocation?.address, fromLocation?.latitude, fromLocation?.longitude, fromLocation?.name, isRecovery, navigation, recoveredTripId, selectedVehicleId]);

  useEffect(() => {
    if (!tripId) return;

    const setupSocket = async () => {
      const token = await AsyncStorage.getItem('access_token'); 
      const SOCKET_URL = 'https://ride-hailing-system-nuf0.onrender.com'; 

      const socket = io(SOCKET_URL, {
        auth: { token: token }, 
        transports: ['websocket'],
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Đã kết nối Socket.IO thành công!');
        socket.emit('customer:subscribe', { trip_id: tripId });
      });

      socket.on('server:trip_accepted', (payload) => {
        console.log('Tài xế đã nhận cuốc!', payload);
        
        navigation.replace('Traveling', { 
          tripId: payload.trip_id,
          driverId: payload.driver_id
        });
      });

      socket.on('connect_error', (err) => {
        console.log('Lỗi kết nối Socket:', err.message);
      });
    };

    setupSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log('Đã ngắt kết nối Socket');
      }
    };
  }, [navigation, tripId]);

  const handleCancel = async () => {
    try {
      if (tripId) {
        await apiClient.post(`/rides/${tripId}/cancel`);
        console.log('Đã hủy chuyến đi thành công trên server:', tripId);
      }
    } catch (error: any) {
      console.log('Lỗi khi hủy chuyến:', error.response?.data || error.message);
    } finally {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log('Đã ngắt kết nối Socket do khách hàng chủ động hủy');
      }
      
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.mapContainer}>
        <AppMap ref={mapRef}/>
        
        <View style={styles.mapOverlay} />
        <View style={styles.radarContainer}>
          <RadarAnimation />
          <View style={[styles.avatarBorder, { borderColor: colors.primaryLight }]}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?u=user' }} // Bạn có thể thay bằng avatar thật của user
              style={styles.userAvatar} 
            />
          </View>
        </View>
      </View>

      <View style={[styles.bottomSheet, { backgroundColor: colors.background, paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.searchingStatusWrapper}>
          <View style={[styles.iconWrapper, { backgroundColor: colors.surface }]}>
            <FontAwesomeIcon icon={faCarOn} size={24} color={colors.primary} />
          </View>
          <View style={styles.statusTextContainer}>
            <Text style={[styles.statusTitle, { color: colors.textTitle }]}>
              Searching Ride...
            </Text>
            <Text style={[styles.statusSubtitle, { color: colors.textBody }]}>
              This may take a few seconds
            </Text>
          </View>
        </View>

        <SwipeButton
          onCancel={handleCancel}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.4)', 
    zIndex: 1,
  },
  backButton: {
    position: 'absolute',
    left: theme.SIZES.padding,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...theme.SHADOWS.light,
  },
  radarContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  avatarBorder: {
    position: 'absolute',
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    borderWidth: 4, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'white',
    zIndex: 10,
  },
  userAvatar: {
    width: 50, 
    height: 50, 
    borderRadius: 25 
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
    paddingHorizontal: theme.SIZES.padding,
    zIndex: 10,
    ...theme.SHADOWS.light, 
  },
  searchingStatusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    ...theme.SHADOWS.light,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: theme.SIZES.h3,
    fontFamily: theme.FONTS.bold,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: theme.SIZES.body2,
    fontFamily: theme.FONTS.medium,
  },
});

export default SearchingDriverScreen;