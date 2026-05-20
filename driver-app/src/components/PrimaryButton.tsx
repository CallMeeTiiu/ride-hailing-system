import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';

interface PrimaryButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'danger' | 'success' | 'outline';
    disabled?: boolean;
    style?: ViewStyle;
}

export default function PrimaryButton({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    style,
}: PrimaryButtonProps) {
    const getBgStyle = () => {
        if (disabled) return styles.disabledBtn;
        switch (variant) {
            case 'danger':
                return styles.dangerBtn;
            case 'success':
                return styles.successBtn;
            case 'outline':
                return styles.outlineBtn;
            default:
                return styles.primaryBtn;
        }
    };

    const getTextStyle = () => {
        if (disabled) return styles.disabledText;
        if (variant === 'outline') return styles.outlineText;
        return styles.whiteText;
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.btn, getBgStyle(), style]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={[styles.btnText, TYPOGRAPHY.body, getTextStyle()]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btn: {
        height: 52,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 2,
        minHeight: 48, // ensure minimum touch target
        width: '100%',
    },
    primaryBtn: {
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primaryDark,
    },
    dangerBtn: {
        backgroundColor: COLORS.error,
        shadowColor: COLORS.error,
    },
    successBtn: {
        backgroundColor: COLORS.success,
        shadowColor: COLORS.success,
    },
    outlineBtn: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: COLORS.primary,
        elevation: 0,
        shadowOpacity: 0,
    },
    disabledBtn: {
        backgroundColor: '#E0E0E0',
        elevation: 0,
        shadowOpacity: 0,
    },
    btnText: {
        fontWeight: '700',
    },
    whiteText: {
        color: COLORS.white,
    },
    outlineText: {
        color: COLORS.primaryDark,
    },
    disabledText: {
        color: COLORS.textTertiary,
    },
});
