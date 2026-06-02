import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Linking } from 'react-native';
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
  phone_number: string;
}

interface DriverBottomCardProps {
  tripStatus: 'waiting' | 'traveling';
  driverData: DriverData;
  distance: string | number;
  arrivalTime?: string;
  onCancel?: () => void;
  onChat?: () => void;
}

const DriverBottomCard: React.FC<DriverBottomCardProps> = ({
  tripStatus, driverData, distance, arrivalTime,
  onCancel, onChat
}) => {
  const { colors } = useTheme();

  const handleCall = async () => {
    if (!driverData.phone_number) {
      Alert.alert('Lỗi', 'Không tìm thấy số điện thoại của tài xế.');
      return;
    }

    const url = `tel:${driverData.phone_number}`;
    
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Lỗi', 'Thiết bị của thiết bị không hỗ trợ gọi điện.');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi cố gắng mở trình gọi điện.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.statusText, { color: colors.textTitle }]}>
          {tripStatus === 'waiting' ? 'Driver is Arriving...' : 'Trip to Destination'}
        </Text>
        <Text style={[styles.timeText, { color: colors.textBody }]}>
          {tripStatus === 'waiting' ? arrivalTime : `${distance} km`}
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

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
            onPress={handleCall}
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