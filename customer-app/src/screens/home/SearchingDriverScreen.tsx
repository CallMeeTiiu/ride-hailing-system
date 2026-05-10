import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';

import AppMap from '../../components/home/AppMap';
import { useTheme } from '../../contexts/ThemeContext';
import theme from '../../constants/theme';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import RadarAnimation from '../../components/home/RadarAnimation';
import SwipeButton from '../../components/booking/SwipeButton';

const mockDrivers = [
  { id: '1', dx: -100, dy: -150, rotation: '-45deg', avatar: 'https://i.pravatar.cc/150?u=d1' },
  { id: '2', dx: 120, dy: -100, rotation: '45deg', avatar: 'https://i.pravatar.cc/150?u=d2' },
  { id: '3', dx: -130, dy: 100, rotation: '-120deg', avatar: 'https://i.pravatar.cc/150?u=d3' },
  { id: '4', dx: 100, dy: 180, rotation: '160deg', avatar: 'https://i.pravatar.cc/150?u=d4' },
];

const SearchingDriverScreen = ({ navigation }: any) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* 2. SỬ DỤNG BẢNG VẼ APPMAP */}
      <AppMap>
        
        {/* RENDER MOCK DRIVERS */}
        {mockDrivers.map((driver) => (
          <View 
            key={driver.id} 
            style={[
              styles.driverMarkerWrapper, 
              { transform: [{ translateX: driver.dx }, { translateY: driver.dy }] }
            ]}
          >
            {/* Ảnh Avatar của Driver trong cái "Ghim" */}
            <View style={[styles.driverPin, { backgroundColor: colors.primary }]}>
              <Image source={{ uri: driver.avatar }} style={styles.driverAvatar} />
            </View>
            {/* Tam giác nhỏ tạo hình cái ghim */}
            <View style={[styles.pinTriangle, { borderTopColor: colors.primary }]} />
            
            {/* Icon xe taxi xoay theo hướng */}
            <View style={[styles.carWrapper, { transform: [{ rotate: driver.rotation }] }]}>
              <View style={[styles.carBody, { backgroundColor: colors.primary }]}>
                 <FontAwesomeIcon icon={faCar} size={14} color={colors.textBtn} />
              </View>
            </View>
          </View>
        ))}

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