import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  interpolate,
  Extrapolation,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';

const Ring = ({ delay, color }: { delay: number; color: string }) => {
  const ringProgress = useSharedValue(0);

  useEffect(() => {
    ringProgress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 3000,
          easing: Easing.out(Easing.ease), 
        }),
        -1,
        false
      )
    );
  }, [delay, ringProgress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        ringProgress.value,
        [0, 0.1, 1],
        [0, 0.8, 0],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          scale: interpolate(ringProgress.value, [0, 1], [1, 6]), 
        },
      ],
    };
  });

  return (
    <Animated.View 
      style={[
        styles.ring, 
        { backgroundColor: color }, 
        animatedStyle
      ]} 
    />
  );
};

const RadarAnimation = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Ring delay={0} color={colors.primary} />
      <Ring delay={1000} color={colors.primary} />
      <Ring delay={2000} color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    width: 60, 
    height: 60,
    borderRadius: 30,
  },
});

export default RadarAnimation;