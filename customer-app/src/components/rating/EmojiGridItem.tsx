import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withSpring,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { EmojiItem } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';

interface EmojiGridItemProps {
    item: EmojiItem;
    isSelected: boolean;
    onPress: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const EmojiGridItemComponent = ({ item, isSelected, onPress }: EmojiGridItemProps) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePress = () => {
        scale.value = withSpring(1, { damping: 10, stiffness: 300 }, () => {
            scale.value = 1;
        });
        scale.value = withTiming(1.1, { duration: 100 });
        onPress();
    };

    const isSkip = item.type === 'skip';

    return (
        <AnimatedTouchable
            style={[
                styles.container,
                isSelected && styles.selected,
                isSkip && styles.skipContainer,
                animatedStyle,
            ]}
            onPress={handlePress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: isSelected }}>
            {isSkip ? (
                <View style={styles.skipContent}>
                    <Icon name="block" size={32} color={colors.textTertiary} />
                    <Text style={styles.skipText}>Skip</Text>
                </View>
            ) : (
                <Text style={styles.emoji}>{item.emoji}</Text>
            )}
        </AnimatedTouchable>
    );
};

export const EmojiGridItem = React.memo(EmojiGridItemComponent);

const ITEM_SIZE = 88;

const styles = StyleSheet.create({
    container: {
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: radius.md,
        borderWidth: 2,
        borderColor: 'transparent',
        margin: spacing.sm,
        backgroundColor: colors.surface,
    },
    selected: {
        borderColor: colors.primary,
        backgroundColor: colors.primaryLight,
    },
    skipContainer: {
        borderStyle: 'dashed',
        borderColor: colors.border,
    },
    skipContent: {
        alignItems: 'center',
        gap: 4,
    },
    skipText: {
        ...typography.small,
        color: colors.textTertiary,
    },
    emoji: {
        ...typography.emoji,
    },
});
