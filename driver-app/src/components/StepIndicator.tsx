import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme';

interface StepIndicatorProps {
    currentStep: number; // 0: Arriving, 1: Waiting, 2: Finishing/Serving
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
    const steps = ['ĐẾN ĐÓN', 'ĐANG CHỜ', 'DI CHUYỂN'];

    return (
        <View style={styles.container}>
            {steps.map((step, idx) => {
                const isActive = idx === currentStep;
                const isDone = idx < currentStep;

                return (
                    <React.Fragment key={idx}>
                        <View style={styles.stepWrapper}>
                            <View
                                style={[
                                    styles.circle,
                                    isActive && styles.circleActive,
                                    isDone && styles.circleDone,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.circleText,
                                        isActive && styles.circleTextActive,
                                        isDone && styles.circleTextDone,
                                    ]}
                                >
                                    {idx + 1}
                                </Text>
                            </View>
                            <Text
                                style={[
                                    styles.stepLabel,
                                    TYPOGRAPHY.small,
                                    isActive && styles.labelActive,
                                    isDone && styles.labelDone,
                                ]}
                            >
                                {step}
                            </Text>
                        </View>

                        {idx < steps.length - 1 ? (
                            <View
                                style={[
                                    styles.line,
                                    idx < currentStep ? styles.lineDone : styles.lineTodo,
                                ]}
                            />
                        ) : null}
                    </React.Fragment>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING.sm,
        width: '100%',
    },
    stepWrapper: {
        alignItems: 'center',
    },
    circle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: COLORS.textTertiary,
        marginBottom: 4,
    },
    circleActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    circleDone: {
        backgroundColor: COLORS.primaryDark,
        borderColor: COLORS.primaryDark,
    },
    circleText: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.textSecondary,
    },
    circleTextActive: {
        color: COLORS.white,
    },
    circleTextDone: {
        color: COLORS.white,
    },
    stepLabel: {
        color: COLORS.textTertiary,
        fontWeight: '600',
    },
    labelActive: {
        color: COLORS.textPrimary,
        fontWeight: '700',
    },
    labelDone: {
        color: COLORS.textSecondary,
    },
    line: {
        flex: 1,
        height: 3,
        marginHorizontal: SPACING.sm,
        transform: [{ translateY: -12 }],
    },
    lineDone: {
        backgroundColor: COLORS.primary,
    },
    lineTodo: {
        backgroundColor: '#EEEEEE',
    },
});
