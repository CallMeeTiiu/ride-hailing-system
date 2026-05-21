import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';

import AppMap from '../../components/home/AppMap';
import DriverBottomCard, { DriverData } from '../../components/booking/DriverBottomCard';
import MessagePopup from '../../components/common/MessagePopup';

import { useBookingHistory } from '../../contexts/BookingHistoryContext';
import { useLocation } from '../../contexts/LocationContext';

import theme from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapBackgroundRef } from '../../components/home/MapBackground';

const mockDriverData: DriverData = {
  name: "Daniel Austin",
  carModel: "Mercedes-Benz E-Class",
  plateNumber: "HSW 4736 XK",
  rating: 4.8,
  avatar: "https://i.pravatar.cc/150?u=daniel",
};

const TravelingScreen = ({ navigation }: any) => {
  const mapRef = useRef<MapBackgroundRef>(null);

  const insets = useSafeAreaInsets();

  const { addTrip } = useBookingHistory();
  const { fromLocation, destinationLocation, setFromLocation, setDestinationLocation } = useLocation();
  
  const [tripStatus, setTripStatus] = useState<'waiting' | 'traveling'>('waiting');
  const [showArrivalPopup, setShowArrivalPopup] = useState(false);
  const [showDestinationPopup, setShowDestinationPopup] = useState(false);

  useEffect(() => {
    if (fromLocation && destinationLocation) {
      const startLat = fromLocation.latitude;
      const startLng = fromLocation.longitude;
      const destLat = destinationLocation.latitude;
      const destLng = destinationLocation.longitude;

      mapRef.current?.updateMarkers(startLat, startLng, destLat, destLng);

      const fetchRoute = async () => {
        try {
          const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${destLng},${destLat}?geometries=geojson`;
          const response = await fetch(url);
          const data = await response.json();

          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            mapRef.current?.drawRoute(route.geometry);
          }
        } catch (error) {
          console.error("Lỗi API OSRM tại TravelingScreen:", error);
        }
      };

      fetchRoute();
    }
  }, [fromLocation, destinationLocation]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (tripStatus === 'waiting') {
      timer = setTimeout(() => {
        setShowArrivalPopup(true);
      }, 5000);
    } else if (tripStatus === 'traveling') {
      timer = setTimeout(() => {
        setShowDestinationPopup(true);
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [tripStatus]);

  const handleAcknowledgeArrival = () => {
    setShowArrivalPopup(false);
    setTripStatus('traveling'); 
  };

  const handleAcknowledgeDestination = () => {
    setShowDestinationPopup(false);

    const newTrip = {
      id: Date.now().toString(),
      driver: mockDriverData,
      fromLocation: fromLocation!,
      destinationLocation: destinationLocation!,
      completionTime: new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' }),
      rating: null, 
    };

    addTrip(newTrip);

    setFromLocation(null);
    setDestinationLocation(null);

    navigation.navigate('Rating', { tripId: newTrip.id });
  };

  return (
    <View style={styles.container}>
      
      {/* 1. ĐÃ THÊM ref={mapRef} VÀ XÓA SẠCH CÁC MARKER GIẢ Ở ĐÂY */}
      <AppMap ref={mapRef} />

      {/* Card thông tin ở dưới cùng tự động thay đổi theo tripStatus */}
      <View style={[ styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, 20) } ]}>
        <DriverBottomCard 
          tripStatus={tripStatus}
          driverData={mockDriverData}
          distance="4.5"
          arrivalTime="2 mins"          

          onCancel={() => navigation.navigate('MainTabs')}
          onChat={() => console.log("Chat with driver")}
          onCall={() => console.log("Call driver")}
        />
      </View>

      {/* Popup thông báo tài xế đã đến đón */}
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
  floatingBackButton: {
    position: 'absolute',
    left: theme.SIZES.padding,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...theme.SHADOWS.light,
  },
  locationPin: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.COLORS.primary, 
    borderWidth: 3,
    borderColor: 'white',
    ...theme.SHADOWS.light,
  }
});

export default TravelingScreen;