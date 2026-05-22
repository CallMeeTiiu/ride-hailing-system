import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native'; 

import { useTheme } from '../../contexts/ThemeContext';

import BottomSearchBoard from '../../components/home/HomeBottomSheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';
import FloatingMapActions from '../../components/home/FloatingMapActions';
import { useSharedValue } from 'react-native-reanimated';
import AppMap from '../../components/home/AppMap';
import theme from '../../constants/theme';
import { MapBackgroundRef } from '../../components/home/MapBackground';
import { useLocation } from '../../contexts/LocationContext';

const HomeScreen = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const animatedSheetIndex = useSharedValue(0);

  const mapRef = useRef<MapBackgroundRef>(null);

  const [distance, setDistance] = useState<string>('');

  const { fromLocation, destinationLocation } = useLocation();
  useEffect(() => {
    const markerFromLat = fromLocation ? fromLocation.latitude : null;
    const markerFromLng = fromLocation ? fromLocation.longitude : null;
    
    const markerDestLat = destinationLocation ? destinationLocation.latitude : null;
    const markerDestLng = destinationLocation ? destinationLocation.longitude : null;

    mapRef.current?.updateMarkers(markerFromLat, markerFromLng, markerDestLat, markerDestLng);


    if (destinationLocation) {
      const routeStartLat = fromLocation ? fromLocation.latitude : 10.8700;
      const routeStartLng = fromLocation ? fromLocation.longitude : 106.8031;
      
      const routeEndLat = destinationLocation.latitude;
      const routeEndLng = destinationLocation.longitude;

      const fetchRoute = async () => {
        try {
          const url = `https://router.project-osrm.org/route/v1/driving/${routeStartLng},${routeStartLat};${routeEndLng},${routeEndLat}?geometries=geojson`;
          
          const response = await fetch(url);
          const data = await response.json();

          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            
            mapRef.current?.drawRoute(route.geometry);
            
            const distanceInKm = (route.distance / 1000).toFixed(1);
            setDistance(`${distanceInKm} km`);
          }
        } catch (error) {
          console.error("Lỗi khi vẽ tuyến đường OSRM:", error);
        }
      };

      fetchRoute();
    } else {
      mapRef.current?.clearRoute(); 
      setDistance('');              
    }
  }, [fromLocation, destinationLocation]);
  
  return (
    <View style={styles.container}>
      <AppMap ref={mapRef}/>

      <View style={[styles.topActionContainer, { top: insets.top + 10 }]}>
        <TouchableOpacity
          style={[styles.circleButton, { backgroundColor: colors.circleButtonBg }]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Search')}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} size={20} color={colors.textTitle} />
        </TouchableOpacity>
      </View>
      <FloatingMapActions animatedIndex={animatedSheetIndex} />
      <BottomSearchBoard animatedIndex={animatedSheetIndex} distance={distance}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end', 
  },
  topActionContainer: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    gap: 15,
    zIndex: 10,
  },
  circleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userCenterAnchor: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBorder: {
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    borderWidth: 4, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: theme.COLORS.white,
  },
  userAvatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 25 
  },
});

export default HomeScreen;