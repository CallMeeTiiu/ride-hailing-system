import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { DriverInfoCardProps } from '../../types';
import { colors, spacing, typography, sizing } from '../../theme';

export const DriverInfoCard = React.memo(
    ({ avatarUrl, name, vehicleModel, licensePlate, rating }: DriverInfoCardProps) => (
        <View style={styles.container}>
            <Image
                source={{ uri: avatarUrl }}
                style={styles.avatar}
                accessibilityLabel={`${name}'s avatar`}
            />

            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                    {name}
                </Text>
                <Text style={styles.vehicle} numberOfLines={1}>
                    {vehicleModel}
                </Text>
            </View>

            <View style={styles.ratingContainer}>
                <Icon name="star" size={18} color={colors.primary} />
                <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            </View>

            <Text style={styles.plate}>{licensePlate}</Text>
        </View>
    ),
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    avatar: {
        width: sizing.avatarMd,
        height: sizing.avatarMd,
        borderRadius: sizing.avatarMd / 2,
        borderWidth: 2,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
    info: {
        flex: 1,
        marginLeft: spacing.md,
    },
    name: {
        ...typography.body,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    vehicle: {
        ...typography.caption,
        color: colors.textSecondary,
        marginTop: 2,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginRight: spacing.sm,
    },
    ratingText: {
        ...typography.caption,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    plate: {
        ...typography.caption,
        color: colors.textSecondary,
    },
});
