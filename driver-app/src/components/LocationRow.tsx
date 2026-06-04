import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme';
import Icon from 'react-native-vector-icons/Feather';

interface LocationRowProps {
    type: 'pickup' | 'dropoff';
    address: string;
}

export default function LocationRow({ type, address }: LocationRowProps) {
    const isPickup = type === 'pickup';
    return (
        <View style={styles.container}>
            <Icon
                name={isPickup ? 'circle' : 'map-pin'}
                size={18}
                color={isPickup ? COLORS.primary : COLORS.error}
                style={styles.icon}
            />
            <View style={styles.textContainer}>
                <Text style={[styles.label, TYPOGRAPHY.small]}>
                    {isPickup ? 'ĐIỂM ĐÓN (PICKUP)' : 'ĐIỂM ĐẾN (DROP-OFF)'}
                </Text>
                <Text style={[styles.address, TYPOGRAPHY.body]} numberOfLines={2}>
                    {address}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: SPACING.sm,
        width: '100%',
    },
    icon: {
        marginTop: 3,
        marginRight: SPACING.md,
    },
    textContainer: {
        flex: 1,
    },
    label: {
        color: COLORS.textSecondary,
        fontWeight: '700',
        marginBottom: 2,
        letterSpacing: 0.5,
    },
    address: {
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
});
