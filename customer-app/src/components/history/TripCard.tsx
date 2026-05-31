import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMapMarkerAlt, faLocationDot, faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

export interface TripHistoryItem {
  id: string;
  status: 'COMPLETED' | 'CANCELLED' | 'PENDING' | 'IN_PROGRESS';
  estimated_fare: number;
  created_at: string;
  pickup_address: string;
  dropoff_address: string;
  driver?: any; 
}

interface TripCardProps {
  trip: TripHistoryItem;
  onPressRebook?: (trip: TripHistoryItem) => void;
  onPressDetail?: (trip: TripHistoryItem) => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onPressRebook, onPressDetail }) => {
  const { colors } = useTheme();

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return { text: 'Completed', color: theme.stateColors.completed, bg: theme.COLORS.background}; 
      case 'CANCELLED':
        return { text: 'Cancelled', color: theme.stateColors.cancelled, bg: theme.COLORS.background }; 
      case 'IN_PROGRESS':
        return { text: 'In Progress', color: theme.stateColors.inProgress, bg: theme.COLORS.background }; 
      default:
        return { text: 'Pending', color: theme.stateColors.pending, bg: theme.COLORS.background }; 
    }
  };

  const statusConfig = getStatusDisplay(trip.status);

  const formatPrice = (price: number) => {
    if (!price) return '$0';
    
    return "$" + Number(price)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatDate = (dateString?: string) => {
      if (!dateString) return 'Nearby';
      const date = new Date(dateString);
      return date.toLocaleString('eng-ENG', { 
          day: '2-digit', month: '2-digit', year: 'numeric', 
          hour: '2-digit', minute: '2-digit' 
      });
  }

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={() => onPressDetail && onPressDetail(trip)}
      style={[styles.cardContainer, { backgroundColor: colors.background, borderColor: colors.border }]}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.timeText, { color: colors.textBody }]}>
          {formatDate(trip.created_at)}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.text}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.locationContainer}>
        <View style={styles.locationRow}>
          <FontAwesomeIcon icon={faMapMarkerAlt} size={16} color={theme.stateColors.cancelled} />
          <Text style={[styles.locationText, { color: colors.textTitle }]} numberOfLines={1}>
            {trip.pickup_address || 'Pickup location - Empty'}
          </Text>
        </View>
        <View style={styles.verticalDashedLine} />
        <View style={styles.locationRow}>
          <FontAwesomeIcon icon={faLocationDot} size={16} color={theme.stateColors.completed} />
          <Text style={[styles.locationText, { color: colors.textTitle }]} numberOfLines={1}>
            {trip.dropoff_address || 'Drop-off location - Empty'}
          </Text>
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footerRow}>
        <Text style={[styles.priceText, { color: theme.COLORS.primary }]}>
          {formatPrice(trip.estimated_fare)}
        </Text>
        
        {(trip.status === 'COMPLETED' || trip.status === 'CANCELLED') && (
          <TouchableOpacity 
            style={styles.rebookButton} 
            onPress={() => onPressRebook && onPressRebook(trip)}
          >
            <FontAwesomeIcon icon={faRedoAlt} size={12} color='white' />
            <Text style={styles.rebookText}>Rebook</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 15,
    ...theme.SHADOWS.light, 
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeText: {
    fontSize: 13,
    fontFamily: theme.FONTS.medium,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontFamily: theme.FONTS.bold,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 15,
  },
  locationContainer: {
    marginBottom: 15,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticalDashedLine: {
    height: 12,
    width: 1,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderStyle: 'dashed',
    marginLeft: 7.5, 
    marginVertical: 2,
  },
  locationText: {
    fontSize: 15,
    fontFamily: theme.FONTS.semiBold,
    marginLeft: 10,
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  priceText: {
    fontSize: 16,
    fontFamily: theme.FONTS.bold,
  },
  rebookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: theme.COLORS.primary,
  },
  rebookText: {
    fontSize: 13,
    fontFamily: theme.FONTS.bold,
    marginLeft: 5,
    color: 'white',
  },
});

export default TripCard;