import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';

import AppMap from '../../components/home/AppMap';
import { useTheme } from '../../contexts/ThemeContext';
import theme from '../../constants/theme';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import RadarAnimation from '../../components/home/RadarAnimation';
import SwipeButton from '../../components/booking/SwipeButton';
import { useLocation } from '../../contexts/LocationContext';
import { MapBackgroundRef } from '../../components/home/MapBackground';

const SearchingDriverScreen = ({ navigation }: any) => {
  const { colors } = useTheme();

  const mapRef = useRef<MapBackgroundRef>(null);
  const { fromLocation } = useLocation();

  const generateMockDrivers = (centerLat: number, centerLng: number, count: number = 6) => {
    const drivers = [];
    for (let i = 0; i < count; i++) {
      const latOffset = (Math.random() - 0.5) * 0.01; 
      const lngOffset = (Math.random() - 0.5) * 0.01;
      drivers.push({
        lat: centerLat + latOffset,
        lng: centerLng + lngOffset
      });
    }
    return drivers;
  };

  useEffect(() => {
    const lat = fromLocation ? fromLocation.latitude : 10.8700;
    const lng = fromLocation ? fromLocation.longitude : 106.8031;

    mapRef.current?.flyToLocation(lat, lng);
    
    const nearbyDrivers = generateMockDrivers(lat, lng, 6);
    mapRef.current?.drawDrivers(nearbyDrivers);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mapRef.current?.clearDrivers();
    };
  }, [fromLocation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Traveling');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* 2. SỬ DỤNG BẢNG VẼ APPMAP */}
      <AppMap ref={mapRef}>
        {/* TÂM BẢN ĐỒ: USER + RADAR */}
        {/* Đặt ở cuối để nó nằm đè lên (layer cao hơn) nếu lỡ đụng các driver khác */}
        <View style={styles.userCenterAnchor}>
          <RadarAnimation />
          <View style={[styles.avatarBorder, { borderColor: colors.primaryLight }]}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?u=user' }}
              style={styles.userAvatar} 
            />
          </View>
        </View>
      </AppMap>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTextWrapper}>
          <Text style={[styles.title, { color: colors.textTitle }]}>
            Searching for Driver
          </Text>
        </View>
      </View>

      {/* STATUS BOX */}
      <View style={styles.searchingStatusWrapper}>
         <View style={[styles.taxiIconBubble, { backgroundColor: colors.primary }]}>
           <FontAwesomeIcon icon={faCar} size={18} color={colors.textBtn} />
         </View>
         <Text style={[styles.statusTitle, { color: colors.textTitle }]}>
           Searching Ride...
         </Text>
         <Text style={[styles.statusSubTitle, { color: colors.textBody }]}>
           This may take a few seconds...
         </Text>
      </View>

      <View style={styles.searchingStatusWrapper}>
         <View style={[styles.taxiIconBubble, { backgroundColor: colors.primary }]}>
           <FontAwesomeIcon icon={faCar} size={18} color={colors.textBtn} />
         </View>
         <Text style={[styles.statusTitle, { color: colors.textTitle }]}>
           Searching Ride...
         </Text>
         <Text style={[styles.statusSubTitle, { color: colors.textBody }]}>
           This may take a few seconds...
         </Text>
      </View>

      {/* GẮN SLIDER MỚI VÀO ĐÂY CHỖ NÀY */}
      <View style={styles.bottomSliderWrapper}>
        <SwipeButton 
          onCancel={() => {
            navigation.goBack();
          }} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    position: 'absolute', 
    top: 50, 
    left: theme.SIZES.padding, 
    right: theme.SIZES.padding, 
    flexDirection: 'row', 
    alignItems: 'center', 
    zIndex: 10 
  },
  backButton: { 
    padding: theme.SIZES.base 
  },
  headerTextWrapper: { 
    flex: 1, 
    marginLeft: 10 
  },
  title: { 
    fontSize: theme.SIZES.h2, 
    fontFamily: theme.FONTS.bold 
  },
  searchingStatusWrapper: { 
    position: 'absolute', 
    top: 120, width: '100%', 
    alignItems: 'center' 
  },
  taxiIconBubble: { 
    width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', 
    marginBottom: 12, ...theme.SHADOWS.light 
  },
  statusTitle: { 
    fontSize: theme.SIZES.h3, 
    fontFamily: theme.FONTS.bold, 
    marginBottom: 6 

  },
  statusSubTitle: { 
    fontSize: theme.SIZES.body2, 
    fontFamily: theme.FONTS.medium 

  },
  userCenterAnchor: {
    position: 'absolute', 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
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
  driverMarkerWrapper: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 2,
  },
  driverPin: {
    width: 46, 
    height: 46, 
    borderRadius: 23,
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 3,
  },
  driverAvatar: {
    width: '100%', 
    height: '100%', 
    borderRadius: 20,
  },
  pinTriangle: {
    width: 0, 
    height: 0, 
    backgroundColor: 'transparent', 
    borderStyle: 'solid',
    borderLeftWidth: 6, 
    borderRightWidth: 6, 
    borderBottomWidth: 0, 
    borderTopWidth: 8,
    borderLeftColor: 'transparent', 
    borderRightColor: 'transparent',
    marginTop: -1,
  },
  carWrapper: {
    marginTop: 5, 
  },
  carBody: {
    width: 28, 
    height: 40, 
    borderRadius: 10,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  bottomSliderWrapper: {
    position: 'absolute',
    bottom: theme.SIZES.padding * 3.5,
    left: theme.SIZES.padding,
    right: theme.SIZES.padding,
    alignItems: 'center',
    zIndex: 10,
  },
});

export default SearchingDriverScreen;