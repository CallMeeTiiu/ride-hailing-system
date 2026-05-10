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
// Chiều rộng tổng của thanh trượt (trừ đi padding 2 bên)
const COMPONENT_WIDTH = SCREEN_WIDTH - theme.SIZES.padding * 4;
const KNOB_SIZE = 56; 
const PADDING = 6;    
// Khoảng cách tối đa mà nút có thể trượt
const MAX_TRANSLATE_X = COMPONENT_WIDTH - KNOB_SIZE - PADDING * 2;
// Ngưỡng quyết định (vuốt qua 40% thì tính là thành công)
const SWIPE_THRESHOLD = MAX_TRANSLATE_X * 0.4; 

interface SwipeButtonProps {
  onCancel: () => void;
  style?: any;
}

const SwipeButton: React.FC<SwipeButtonProps> = ({ onCancel, style }) => {
  const { colors } = useTheme();
  
  // State chia sẻ giữa UI và Native thread
  const translateX = useSharedValue(0);
  // Reanimated v3 cần một biến riêng để lưu vị trí bắt đầu vuốt
  const startX = useSharedValue(0);

  // Xử lý sự kiện vuốt bằng API Gesture.Pan() mới
  const panGesture = Gesture.Pan()
    .onStart(() => {
      // Lưu lại vị trí khi vừa chạm vào nút
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      let newValue = startX.value + event.translationX;
      // Chặn không cho vuốt lố qua trái/phải
      if (newValue < 0) newValue = 0;
      if (newValue > MAX_TRANSLATE_X) newValue = MAX_TRANSLATE_X;
      
      translateX.value = newValue;
    })
    .onEnd(() => {
      // Cấu hình lò xo: tăng damping (độ cản), thêm overshootClamping để không nảy lố
      const springConfig = { 
        damping: 20, 
        stiffness: 100, 
        overshootClamping: true 
      };

      // Nhả tay ra: Nếu qua ngưỡng thì trượt hết cỡ và gọi onCancel
      if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withSpring(MAX_TRANSLATE_X, springConfig, () => {
          runOnJS(onCancel)();
        });
      } else {
        // Chưa đủ lực thì nảy về 0
        translateX.value = withSpring(0, springConfig);
      }
    });

  // Animation trượt ngang cho cục nút (Knob)
  const animatedKnobStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // Animation mờ dần dòng chữ khi bắt đầu vuốt
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
      {/* Lớp chữ ở dưới */}
      <Animated.View style={[styles.textContainer, animatedTextStyle]}>
        <Text style={[styles.text, { color: colors.textTitle }]}>
          {">>"} Slide to Cancel
        </Text>
      </Animated.View>

      {/* Cục nút được bọc trong GestureDetector */}
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