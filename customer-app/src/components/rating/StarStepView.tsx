import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DriverInfoCard } from './DriverInfoCard';
import { StarRating } from './StarRating';
import { ActionButtons } from './ActionButtons';
import { MOCK_DRIVER } from '../../data/emojiData';
import { useTripStore } from '../../store/tripStore';
import { colors, spacing, typography } from '../../theme';

export const StarStepView = React.memo(() => {
    const { driverRating, selectRating, submitRating, cancelRating } =
        useTripStore();

    return (
        <View style={styles.container}>
            <DriverInfoCard
                avatarUrl={MOCK_DRIVER.avatarUrl}
                name={MOCK_DRIVER.name}
                vehicleModel={MOCK_DRIVER.vehicleModel}
                licensePlate={MOCK_DRIVER.licensePlate}
                rating={MOCK_DRIVER.rating}
            />

            <Text style={styles.title}>How is your Driver?</Text>
            <Text style={styles.subtitle}>Please rate your driver...</Text>

            <StarRating rating={driverRating} onRatingChange={selectRating} />

            <ActionButtons
                onCancel={cancelRating}
                onSubmit={submitRating}
                submitDisabled={driverRating < 1}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        ...typography.h2,
        color: colors.textPrimary,
        textAlign: 'center',
        marginTop: spacing.lg,
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
});
