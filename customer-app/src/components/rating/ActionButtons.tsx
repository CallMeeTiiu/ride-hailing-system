import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

interface ActionButtonsProps {
    onCancel: () => void;
    onSubmit: () => void;
    submitDisabled?: boolean;
}

export const ActionButtons = React.memo(
    ({ onCancel, onSubmit, submitDisabled = false }: ActionButtonsProps) => (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.cancelButton}
                onPress={onCancel}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Cancel rating">
                <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.submitButton, submitDisabled && styles.submitDisabled]}
                onPress={onSubmit}
                activeOpacity={0.7}
                disabled={submitDisabled}
                accessibilityRole="button"
                accessibilityLabel="Submit rating">
                <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
        </View>
    ),
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: spacing.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    cancelButton: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: 'transparent',
    },
    cancelText: {
        ...typography.body,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    submitButton: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: radius.full,
        backgroundColor: colors.primary,
    },
    submitDisabled: {
        opacity: 0.5,
    },
    submitText: {
        ...typography.body,
        color: colors.white,
        fontWeight: '600',
    },
});
