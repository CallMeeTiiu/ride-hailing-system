import React, { useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SPACING } from '../theme';

interface StarRatingProps {
    rating: number;
    onRatingChange: (stars: number) => void;
    maxStars?: number;
    starSize?: number;
}

const Star = React.memo(({
    index,
    filled,
    size,
    onPress,
}: {
    index: number;
    filled: boolean;
    size: number;
    onPress: (index: number) => void;
}) => {
    return (
        <TouchableOpacity
            onPress={() => onPress(index)}
            activeOpacity={0.7}
            style={styles.starTouch}
            accessibilityRole="button"
            accessibilityLabel={`${index + 1} ngôi sao`}
        >
            <Icon
                name={filled ? 'star' : 'star-border'}
                size={size}
                color={filled ? COLORS.primary : COLORS.textTertiary}
            />
        </TouchableOpacity>
    );
});

export default function StarRating({
    rating,
    onRatingChange,
    maxStars = 5,
    starSize = 44,
}: StarRatingProps) {
    const handleStarPress = useCallback((index: number) => {
        onRatingChange(index + 1);
    }, [onRatingChange]);

    return (
        <View style={styles.container}>
            {Array.from({ length: maxStars }, (_, i) => (
                <Star
                    key={i}
                    index={i}
                    filled={i < rating}
                    size={starSize}
                    onPress={handleStarPress}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: SPACING.md,
        paddingVertical: SPACING.md,
    },
    starTouch: {
        padding: 4,
    },
});
