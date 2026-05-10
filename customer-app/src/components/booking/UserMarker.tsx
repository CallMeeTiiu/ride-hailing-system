import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface DriverMarkerProps {
  avatar: string;
  rotation: string;
  style?: any;
}

const UserMarker: React.FC<DriverMarkerProps> = ({ avatar, rotation, style }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.driverMarkerWrapper, style]}>
      {/* Pin với Avatar tài xế */}
      <View style={[styles.driverPin, { backgroundColor: colors.primary }]}>
        <Image source={{ uri: avatar }} style={styles.driverAvatar} />
      </View>
      <View style={[styles.pinTriangle, { borderTopColor: colors.primary }]} />
      
      {/* Xe taxi xoay theo hướng */}
      <View style={[styles.carWrapper, { transform: [{ rotate: rotation }] }]}>
        <View style={[styles.carBody, { backgroundColor: colors.primary }]}>
           <FontAwesomeIcon icon={faCar} size={14} color={colors.textBtn} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  }
});

export default UserMarker;