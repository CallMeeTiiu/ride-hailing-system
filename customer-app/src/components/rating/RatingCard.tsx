import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faLocationDot, faClock, faChevronRight, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { Trip } from '../../contexts/BookingHistoryContext';

interface RatingCardProps {
  trip: Trip;
  onPress: () => void;
}

const RatingCard: React.FC<RatingCardProps> = ({ trip, onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.cardContainer, { backgroundColor: colors.background }]} 
      activeOpacity={0.8}
      onPress={onPress}
    >
      {/* 1. Header: Thông tin tài xế */}
      <View style={styles.driverInfoRow}>
        <Image source={{ uri: trip.driver.avatar }} style={styles.driverAvatar} />
        <View style={styles.detailsColumn}>
          <View style={styles.nameRow}>
            <Text style={[styles.driverName, { color: colors.textTitle }]} numberOfLines={1}>
              {trip.driver.name}
            </Text>
            <View style={styles.ratingWrapper}>
              <FontAwesomeIcon icon={faStar} size={12} color={theme.COLORS.primary} />
              <Text style={[styles.ratingText, { color: colors.textBody }]}>{trip.driver.rating}</Text>
            </View>
          </View>
          <Text style={[styles.carInfo, { color: colors.textBody }]} numberOfLines={1}>
            {trip.driver.carModel} • <Text style={{ color: colors.textTitle, fontFamily: theme.FONTS.bold }}>{trip.driver.plateNumber}</Text>
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* 2. Body: Thông tin chuyến đi (From - To) */}
      <View style={styles.locationContainer}>
        <View style={styles.locationRow}>
          <FontAwesomeIcon icon={faLocationDot} size={14} color={theme.COLORS.primary} />
          <Text style={[styles.locationText, { color: colors.textTitle }]} numberOfLines={1}>
            <Text style={{ fontFamily: theme.FONTS.regular, color: colors.textBody }}>From: </Text>
            {trip.fromLocation.name}
          </Text>
        </View>
        <View style={[styles.locationRow, { marginTop: 8 }]}>
          <FontAwesomeIcon icon={faMapMarkerAlt} size={14} color={theme.COLORS.primary} />
          <Text style={[styles.locationText, { color: colors.textTitle }]} numberOfLines={1}>
            <Text style={{ fontFamily: theme.FONTS.regular, color: colors.textBody }}>To: </Text>
            {trip.destinationLocation.name}
          </Text>
        </View>
      </View>

      {/* 3. Footer: Thời gian hoàn thành và Nút Rate */}
      <View style={[styles.footerRow, { borderTopColor: colors.border }]}>
        <View style={styles.timeWrapper}>
          <FontAwesomeIcon icon={faClock} size={14} color={colors.primary} />
          <Text style={[styles.timeText, { color: colors.textBody }]}>{trip.completionTime}</Text>
        </View>
        <View style={[styles.rateBadge, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.rateBadgeText, { color: theme.COLORS.primary }]}>Rate Now</Text>
          <FontAwesomeIcon icon={faChevronRight} size={12} color={theme.COLORS.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 15,
    borderRadius: theme.SIZES.radiusCard || 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    ...theme.SHADOWS.light,
  },
  driverInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  detailsColumn: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  driverName: {
    fontFamily: theme.FONTS.bold,
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontFamily: theme.FONTS.bold,
    fontSize: 12,
    marginLeft: 4,
  },
  carInfo: {
    fontFamily: theme.FONTS.regular,
    fontSize: 13,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 12,
  },
  locationContainer: {
    marginBottom: 15,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: theme.FONTS.semiBold,
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  timeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontFamily: theme.FONTS.medium,
    fontSize: 12,
    marginLeft: 6,
  },
  rateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rateBadgeText: {
    fontFamily: theme.FONTS.bold,
    fontSize: 12,
    marginRight: 4,
  },
});

export default RatingCard;