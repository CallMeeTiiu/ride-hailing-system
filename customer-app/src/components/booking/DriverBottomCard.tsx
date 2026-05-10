import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMessage, faPhone, faTimes, faStar } from '@fortawesome/free-solid-svg-icons';
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

export interface DriverData {
  name: string;
  carModel: string;
  plateNumber: string;
  rating: number;
  avatar: string;
}

interface DriverBottomCardProps {
  tripStatus: 'waiting' | 'traveling';
  driverData: DriverData;
  distance: string | number;
  arrivalTime?: string;
  onCancel?: () => void;
  onChat?: () => void;
  onCall?: () => void;
}

const DriverBottomCard: React.FC<DriverBottomCardProps> = ({
  tripStatus, driverData, distance, arrivalTime,
  onCancel, onChat, onCall
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 1. Header: Trạng thái thay đổi theo tripStatus */}
      <View style={styles.headerRow}>
        <Text style={[styles.statusText, { color: colors.textTitle }]}>
          {tripStatus === 'waiting' ? 'Driver is Arriving...' : 'Trip to Destination'}
        </Text>
        <Text style={[styles.timeText, { color: colors.textBody }]}>
          {tripStatus === 'waiting' ? arrivalTime : `${distance} km`}
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* 2. Body: Thông tin tài xế & xe */}
      <View style={styles.driverInfoRow}>
        <Image source={{ uri: driverData.avatar }} style={styles.driverAvatar} />
        <View style={styles.detailsColumn}>
          <View style={styles.nameRow}>
            <Text style={[styles.driverName, { color: colors.textTitle }]}>{driverData.name}</Text>
            <View style={styles.ratingWrapper}>
              <FontAwesomeIcon icon={faStar} size={12} color={theme.COLORS.primary} />
              <Text style={[styles.ratingText, { color: colors.textBody }]}>{driverData.rating}</Text>
            </View>
          </View>
          <View style={styles.carRow}>
            <Text style={[styles.carModel, { color: colors.textBody }]}>{driverData.carModel}</Text>
            <Text style={[styles.plateNumber, { color: colors.textTitle }]}>{driverData.plateNumber}</Text>
          </View>
        </View>
      </View>

      {/* 3. Footer: Cụm 3 nút Action (Chỉ hiện khi đang chờ tài xế) */}
      {tripStatus === 'waiting' && (
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={[styles.circleButton, { backgroundColor: colors.circleButtonBg }]} 
            onPress={onCancel}
          >
            <FontAwesomeIcon icon={faTimes} size={20} color={colors.textTitle} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.primary }]} 
            onPress={onChat}
          >
            <FontAwesomeIcon icon={faMessage} size={20} color={colors.textBtn} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.primary }]} 
            onPress={onCall}
          >
            <FontAwesomeIcon icon={faPhone} size={20} color={colors.textBtn} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.SIZES.padding,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    ...theme.SHADOWS.primaryGlow,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusText: { 
    fontFamily: theme.FONTS.bold, 
    fontSize: 20 
  },
  timeText: { 
    fontFamily: theme.FONTS.medium, 
    fontSize: 14 
  },
  divider: { 
    height: 1, 
    width: '100%', 
    marginBottom: 20 
  },
  driverInfoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 5 
  },
  driverAvatar: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    marginRight: 15 
  },
  detailsColumn: { 
    flex: 1 
  },
  nameRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 4 
  },
  driverName: { 
    fontFamily: theme.FONTS.bold, 
    fontSize: 18 
  },
  ratingWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4 
  },
  ratingText: { 
    fontFamily: theme.FONTS.medium, 
    fontSize: 14, 
    marginLeft: 4 
  },
  carRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  carModel: { 
    fontFamily: theme.FONTS.medium, 
    fontSize: 12
  },
  plateNumber: { 
    fontFamily: theme.FONTS.bold, 
    fontSize: 12
  },
  actionRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    gap: 15,
    marginTop: 20,
  },
  circleButton: { 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  actionButton: { 
    flex: 1, 
    height: 56, 
    borderRadius: 28, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});

export default DriverBottomCard;