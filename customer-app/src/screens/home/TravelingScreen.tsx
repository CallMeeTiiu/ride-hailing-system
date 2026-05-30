import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';

import AppMap from '../../components/home/AppMap';
import DriverBottomCard, { DriverData } from '../../components/booking/DriverBottomCard';
import MessagePopup from '../../components/common/MessagePopup';

import { useBookingHistory } from '../../contexts/BookingHistoryContext';
import { useLocation } from '../../contexts/LocationContext';

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
  const [driverLocation, setDriverLocation] = useState<{lat: number, lng: number} | null>(null);
  const [distance, setDistance] = useState<string>('...'); 
  
  const [showArrivalPopup, setShowArrivalPopup] = useState(false);
  const [showDestinationPopup, setShowDestinationPopup] = useState(false);

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
        console.error("Lỗi API OSRM tại TravelingScreen:", error);
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
    if (fromLocation) {
      setDriverLocation({ lat: fromLocation.latitude, lng: fromLocation.longitude });
    }
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
      {/* MAP */}
      <AppMap ref={mapRef} />

      {/* BOTTOM CARD */}
      <View style={[ styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, 20) } ]}>
        <DriverBottomCard 
          tripStatus={tripStatus}
          driverData={mockDriverData}
          distance={distance} 
          arrivalTime={tripStatus === 'waiting' ? "Arriving in 5 mins" : ""}          
          onCancel={() => navigation.navigate('MainTabs')}
          onChat={() => console.log("Chat with driver")}
          onCall={() => console.log("Call driver")}
        />
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
  }
});

export default TravelingScreen;