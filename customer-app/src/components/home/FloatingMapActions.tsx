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
import { 
  faCrosshairs, 
  faHome, 
  faBriefcase, 
  faMugHot, 
  faSchool
} from '@fortawesome/free-solid-svg-icons';

import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const suggestionChips = [
  { id: '1', label: 'Home', icon: faHome },
  { id: '2', label: 'Work', icon: faBriefcase },
  { id: '3', label: 'Cafe', icon: faMugHot },
  { id: '4', label: 'School', icon: faSchool },
];

interface FloatingMapActionsProps {
  animatedIndex: any;
  onLocationPress?: () => void;
}

const FloatingMapActions: React.FC<FloatingMapActionsProps> = ({ animatedIndex, onLocationPress }) => {
  const { colors } = useTheme();

  const floatingAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animatedIndex.value, [0, 0.3], [1, 0], Extrapolation.CLAMP),
      zIndex: animatedIndex.value > 0.1 ? -1 : 1,
    };
  });

  return (
    <Animated.View style={[styles.floatingWrapper, floatingAnimatedStyle]} pointerEvents="box-none">
      
      <View style={styles.locationButtonContainer}>
        <TouchableOpacity style={styles.locationButton} activeOpacity={0.8} onPress={onLocationPress}>
          <FontAwesomeIcon icon={faCrosshairs} size={24} color={colors.textTitle} />
        </TouchableOpacity>
      </View>

      <View style={styles.chipsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {suggestionChips.map((chip) => (
            <TouchableOpacity key={chip.id} style={styles.chip} activeOpacity={0.7}>
              <FontAwesomeIcon icon={chip.icon} size={14} color={theme.COLORS.primary} />
              <Text style={styles.chipText}>{chip.label}</Text>
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