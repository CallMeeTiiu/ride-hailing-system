import React, { useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, spacing } from '../../theme';

interface StarRatingProps {
    rating: number;
    onRatingChange: (stars: number) => void;
    maxStars?: number;
    starSize?: number;
    activeColor?: string;
    inactiveColor?: string;
}

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const Star = React.memo(
    ({
        index,
        filled,
        size,
        activeColor,
        inactiveColor,
        onPress,
    }: {
        index: number;
        filled: boolean;
        size: number;
        activeColor: string;
        inactiveColor: string;
        onPress: (index: number) => void;
    }) => {
        const scale = useSharedValue(1);

        const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ scale: scale.value }],
        }));

        const handlePress = () => {
            scale.value = withSequence(
                withTiming(0.8, { duration: 80 }),
                withSpring(1, { damping: 8, stiffness: 300 }),
            );
            onPress(index);
        };

        return (
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.7}
                style={styles.starTouch}
                accessibilityRole="button"
                accessibilityLabel={`${index + 1} star`}
                accessibilityState={{ selected: filled }}>
                <Animated.View style={animatedStyle}>
                    <AnimatedIcon
                        name={filled ? 'star' : 'star-border'}
                        size={size}
                        color={filled ? activeColor : inactiveColor}
                    />
                </Animated.View>
            </TouchableOpacity>
        );
    },
);

export const StarRating = React.memo(
    ({
        rating,
        onRatingChange,
        maxStars = 5,
        starSize = 44,
        activeColor = colors.primary,
        inactiveColor = colors.border,
    }: StarRatingProps) => {
        const handleStarPress = useCallback(
            (index: number) => {
                onRatingChange(index + 1);
            },
            [onRatingChange],
        );

        return (
            <View style={styles.container}>
                {Array.from({ length: maxStars }, (_, i) => (
                    <Star
                        key={i}
                        index={i}
                        filled={i < rating}
                        size={starSize}
                        activeColor={activeColor}
                        inactiveColor={inactiveColor}
                        onPress={handleStarPress}
                    />
                ))}
            </View>
        );
    },
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.lg,
    },
    starTouch: {
        padding: 4,
    },
});
