import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler'; 
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COMPONENT_WIDTH = SCREEN_WIDTH - theme.SIZES.padding * 4; // Chiều rộng tổng của thanh trượt (trừ đi padding 2 bên)
const KNOB_SIZE = 56; 
const PADDING = 6;    
const MAX_TRANSLATE_X = COMPONENT_WIDTH - KNOB_SIZE - PADDING * 2; // Khoảng cách tối đa mà nút có thể trượt
const SWIPE_THRESHOLD = MAX_TRANSLATE_X * 0.4; // Ngưỡng quyết định (vuốt qua 40% thì tính là thành công)

interface SwipeButtonProps {
  onCancel: () => void;
  style?: any;
}

const SwipeButton: React.FC<SwipeButtonProps> = ({ onCancel, style }) => {
  const { colors } = useTheme();
  
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      let newValue = startX.value + event.translationX;
      if (newValue < 0) newValue = 0;
      if (newValue > MAX_TRANSLATE_X) newValue = MAX_TRANSLATE_X;
      
      translateX.value = newValue;
    })
    .onEnd(() => {
      const springConfig = { 
        damping: 20, 
        stiffness: 100, 
        overshootClamping: true 
      };

      if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withSpring(MAX_TRANSLATE_X, springConfig, () => {
          runOnJS(onCancel)();
        });
      } else {
        translateX.value = withSpring(0, springConfig);
      }
    });

  const animatedKnobStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translateX.value,
        [0, SWIPE_THRESHOLD / 2], 
        [1, 0],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.white }, style]}>
      <Animated.View style={[styles.textContainer, animatedTextStyle]}>
        <Text style={[styles.text, { color: colors.textTitle }]}>
          {">>"} Slide to Cancel
        </Text>
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View 
          style={[
            styles.knob, 
            { backgroundColor: colors.circleButtonBg },
            animatedKnobStyle
          ]}
        >
          <FontAwesomeIcon icon={faTimes} size={24} color={colors.textTitle} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: COMPONENT_WIDTH,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    padding: PADDING,
    ...theme.SHADOWS.light,
  },
  textContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  text: {
    fontFamily: theme.FONTS.medium,
    fontSize: theme.SIZES.body1,
  },
  knob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
});

export default SwipeButton;