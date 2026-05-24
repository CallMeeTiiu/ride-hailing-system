import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Dimensions 
} from 'react-native';
import Animated, { useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

import { useAddress } from '../../contexts/AddressContext';
import { useLocation } from '../../contexts/LocationContext';
import { getIconObject } from '../../screens/profile/AddressListScreen'; // Import hàm map icon ta đã viết

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FloatingMapActionsProps {
  animatedIndex: any;
  onLocationPress?: () => void;
}

const FloatingMapActions: React.FC<FloatingMapActionsProps> = ({ animatedIndex, onLocationPress }) => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  
  const { addresses } = useAddress();
  const { 
    fromLocation, 
    setFromLocation, 
    destinationLocation, 
    setDestinationLocation 
  } = useLocation();

  const floatingAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animatedIndex.value, [0, 0.3], [1, 0], Extrapolation.CLAMP),
      zIndex: animatedIndex.value > 0.1 ? -1 : 1,
    };
  });

  const handleChipPress = (chip: any) => {
    if (chip.lat && chip.lng) {
      const locationPayload = {
        id: chip.id,                  
        name: chip.name,             
        address: chip.details,       
        latitude: chip.lat,
        longitude: chip.lng,
        distance: '',                 
      };

      if (fromLocation && destinationLocation) {
        return;
      } else if (fromLocation && !destinationLocation) {
        setDestinationLocation(locationPayload);
      } else {
        setFromLocation(locationPayload);
      }

    } else {
      navigation.navigate('EditAddressScreen', { addressId: chip.id });
    }
  };

  return (
    <Animated.View style={[styles.floatingWrapper, floatingAnimatedStyle]} pointerEvents="box-none">
      
      <View style={styles.locationButtonContainer}>
        <TouchableOpacity style={styles.locationButton} activeOpacity={0.8} onPress={onLocationPress}>
          <FontAwesomeIcon icon={faCrosshairs} size={24} color={colors.textTitle} />
        </TouchableOpacity>
      </View>

      <View style={styles.chipsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {addresses.map((chip) => (
            <TouchableOpacity 
              key={chip.id} 
              style={styles.chip} 
              activeOpacity={0.7}
              onPress={() => handleChipPress(chip)}
            >
              <FontAwesomeIcon icon={getIconObject(chip.icon)} size={14} color={theme.COLORS.primary} />
              <Text style={styles.chipText}>{chip.name}</Text>
            </TouchableOpacity>
          ))}

        </ScrollView>
      </View>

    </Animated.View>
  );
};

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.15 + 10, 
    left: 0,
    right: 0,
    zIndex: 1, 
  },
  locationButtonContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: theme.SIZES.padding,
    marginBottom: 15,
  },
  locationButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.SHADOWS.primaryGlow,
  },
  chipsContainer: {
    marginBottom: 5,
  },
  scrollContent: {
    paddingHorizontal: theme.SIZES.padding,
    gap: 10
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.COLORS.primary,
    backgroundColor: theme.COLORS.white,
    ...theme.SHADOWS.light,
  },
  chipText: {
    fontFamily: theme.FONTS.semiBold,
    fontSize: 14,
    marginLeft: 8,
    color: theme.COLORS.primary,
  },
});

export default FloatingMapActions;