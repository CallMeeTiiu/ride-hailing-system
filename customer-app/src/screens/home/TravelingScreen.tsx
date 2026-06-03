import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

import AppMap from '../../components/home/AppMap';
import DriverBottomCard, { DriverData } from '../../components/booking/DriverBottomCard';
import MessagePopup from '../../components/common/MessagePopup';

import { useBookingHistory } from '../../contexts/BookingHistoryContext';
import { useLocation } from '../../contexts/LocationContext';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapBackgroundRef } from '../../components/home/MapBackground';

import io, { Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../utils/apiClient';
import { RootStackParamList } from '../../../App';
import { RouteProp, useRoute } from '@react-navigation/native';

const TravelingScreen = ({ navigation }: any) => {
  const mapRef = useRef<MapBackgroundRef>(null);
  const insets = useSafeAreaInsets();

  const route = useRoute<RouteProp<RootStackParamList, 'Traveling'>>();
  const { tripId, driverId } = route.params || {};

  const { addTrip } = useBookingHistory();
  const { fromLocation, destinationLocation } = useLocation();

  const fromLocationRef = useRef(fromLocation);
  useEffect(() => {
    fromLocationRef.current = fromLocation;
  }, [fromLocation]);
  
  const [tripStatus, setTripStatus] = useState<'waiting' | 'traveling'>('waiting');
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [driverLocation, setDriverLocation] = useState<{lat: number, lng: number} | null>(null);
  const [distance, setDistance] = useState<string>('...'); 
  
  const [showArrivalPopup, setShowArrivalPopup] = useState(false);
  const [showDestinationPopup, setShowDestinationPopup] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const fetchDriverInfo = async () => {
      if (!driverId) return;
      try {
        const response = await apiClient.get(`/drivers/${driverId}`);
        setDriverData(response.data);
      } catch (error) {
        console.log('Error while fetching driver info:', error);
        setDriverData({
          name: "Driver (Error)",
          carModel: "Bike/Car",
          plateNumber: "---",
          rating: 5.0,
          avatar: "https://i.pravatar.cc/150?img=11",
          phone_number: "0123456789"
        });
      }
    };

    fetchDriverInfo();
  }, [driverId]);

  useEffect(() => {
    if (!tripId) return;

    const setupSocket = async () => {
      let token = await AsyncStorage.getItem('access_token');
      if (token) token = token.replace(/"/g, ''); 
      
      const socket = io('http://localhost:3000', {
        auth: { token },
        transports: ['websocket'],
      });
      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('🚙 Traveling: Connect to socket successfully! Trip ID:', `trip_${tripId}`);
        socket.emit('customer:subscribe', { trip_id: tripId });
      });

      socket.on('server:driver_location', (data) => {
        setDriverLocation({ lat: data.latitude, lng: data.longitude });
      });

      socket.on('server:trip_status_updated', (payload) => {
        console.log('Trạng thái chuyến đi thay đổi thành:', payload.status);
        
        if (payload.status === 'ARRIVED') {
          setShowArrivalPopup(true); 
          if (fromLocationRef.current) {
            setDriverLocation({ lat: fromLocationRef.current.latitude, lng: fromLocationRef.current.longitude });
          }
        } else if (payload.status === 'IN_PROGRESS') {
          setTripStatus('traveling'); 
          if (fromLocationRef.current) {
            setDriverLocation({ lat: fromLocationRef.current.latitude, lng: fromLocationRef.current.longitude });
          }
        } else if (payload.status === 'COMPLETED') {
          setShowDestinationPopup(true); 
        }
      });
      
      socket.on('disconnect', (reason) => {
        console.log('❌ Disconnect from Socket (Traveling):', reason);
      });
    };

    setupSocket();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [fromLocation, tripId]);

  useEffect(() => {
    if (fromLocation && !driverLocation) {
      const latOffset = (Math.random() - 0.5) * 0.02; 
      const lngOffset = (Math.random() - 0.5) * 0.02;
      setDriverLocation({
        lat: fromLocation.latitude + latOffset,
        lng: fromLocation.longitude + lngOffset
      });
    }
  }, [driverLocation, fromLocation]);

  useEffect(() => {
    if (!fromLocation || !destinationLocation || !driverLocation) return;

    const fetchRoute = async (startLng: number, startLat: number, endLng: number, endLat: number) => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?geometries=geojson`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          mapRef.current?.drawRoute(data.routes[0].geometry);
          const distInKm = (data.routes[0].distance / 1000).toFixed(1);
          setDistance(distInKm);
        }
      } catch (error) {
        console.error("Error API OSRM:", error);
      }
    };

    if (tripStatus === 'waiting') {
      mapRef.current?.updateMarkers(fromLocation.latitude, fromLocation.longitude, null, null); 
      mapRef.current?.drawDrivers([{ lat: driverLocation.lat, lng: driverLocation.lng }]);
      fetchRoute(driverLocation.lng, driverLocation.lat, fromLocation.longitude, fromLocation.latitude);
    } else {
      mapRef.current?.updateMarkers(null, null, destinationLocation.latitude, destinationLocation.longitude);
      mapRef.current?.drawDrivers([{ lat: driverLocation.lat, lng: driverLocation.lng }]);
      fetchRoute(driverLocation.lng, driverLocation.lat, destinationLocation.longitude, destinationLocation.latitude); 
    }
  }, [tripStatus, driverLocation, fromLocation, destinationLocation]);

  const handleAcknowledgeArrival = () => {
    setShowArrivalPopup(false);
  };

  const handleAcknowledgeDestination = () => {
    setShowDestinationPopup(false);

    const finalFrom = fromLocation || { 
      id: 'fallback_from', name: 'Điểm đón (Dự phòng)', address: 'Không thể tải địa chỉ',
      latitude: 10.8700, longitude: 106.8031, distance: '0 km' 
    }; 
    
    const finalDest = destinationLocation || { 
      id: 'fallback_dest', name: 'Điểm đến (Dự phòng)', address: 'Không thể tải địa chỉ',
      latitude: 10.7626, longitude: 106.6601, distance: '0 km'
    };

    const newTrip = {
      id: tripId || Date.now().toString(),
      driver: driverData || {
        name: "Bác tài xế", carModel: "Xe máy/Ô tô", plateNumber: "---", rating: 5, avatar: "https://i.pravatar.cc/150?img=11", phone_number: "0123456789"
      },
      fromLocation: finalFrom,
      destinationLocation: finalDest,
      completionTime: new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' }),
      rating: null, 
    };

    addTrip(newTrip);

    navigation.navigate('Rating', { tripId: newTrip.id });
  };

  return (
    <View style={styles.container}>
      {/* MAP */}
      <AppMap ref={mapRef} />

      {/* BOTTOM CARD */}
      <View style={[ styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, 20) } ]}>
        {driverData ? (
          <DriverBottomCard 
            tripStatus={tripStatus}
            driverData={driverData}
            distance={distance} 
            arrivalTime={tripStatus === 'waiting' ? "Arriving in 5 mins" : ""}          
            onCancel={async () => {
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
              };
            }}
            onChat={() => console.log("Chat with driver")}
          />
        ) : (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </View>

      {/* POPUPS */}
      <MessagePopup 
        visible={showArrivalPopup}
        title="Driver is Arriving!"
        context="Your driver is almost at your pickup location. Please be ready!"
        onClose={handleAcknowledgeArrival}
      />

      <MessagePopup 
        visible={showDestinationPopup}
        title="You have arrived at your destination!"
        context="See you on the next trip :)"
        onClose={handleAcknowledgeDestination}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  loadingCard: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 150,
  }
});

export default TravelingScreen;