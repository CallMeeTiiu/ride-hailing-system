import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DriverInfoCard } from './DriverInfoCard';
import { EmojiGrid } from './EmojiGrid';
import { ActionButtons } from './ActionButtons';
import { MOOD_EMOJIS, MOCK_DRIVER } from '../../data/emojiData';
import { useTripStore } from '../../store/tripStore';
import { colors, spacing, typography } from '../../theme';

export const MoodStepView = React.memo(() => {
    const { selectedMoodId, hasSelectedMood, selectMood, submitMood, cancelRating } =
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

            <Text style={styles.title}>What's Your Mood!</Text>
            <Text style={styles.subtitle}>about this trip?</Text>

            <EmojiGrid
                emojis={MOOD_EMOJIS}
                selectedId={selectedMoodId}
                hasSelected={hasSelectedMood}
                onSelect={selectMood}
            />

            <ActionButtons
                onCancel={cancelRating}
                onSubmit={submitMood}
                submitDisabled={!hasSelectedMood}
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
        marginTop: spacing.md,
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
});
