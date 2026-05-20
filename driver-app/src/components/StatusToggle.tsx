import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';
import Icon from 'react-native-vector-icons/Feather';

interface StatusToggleProps {
    isOnline: boolean;
    onToggle: () => void;
}

export default function StatusToggle({ isOnline, onToggle }: StatusToggleProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={[
                styles.container,
                isOnline ? styles.onlineBg : styles.offlineBg,
            ]}
            onPress={onToggle}
        >
            <View style={[styles.pill, isOnline ? styles.pillRight : styles.pillLeft]}>
                <Icon
                    name="power"
                    size={16}
                    color={isOnline ? COLORS.success : COLORS.textSecondary}
                />
            </View>
            <Text style={[styles.text, TYPOGRAPHY.body]}>
                {isOnline ? 'ONLINE' : 'OFFLINE'}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 140,
        height: 48,
        borderRadius: RADIUS.full,
        paddingHorizontal: 6,
        position: 'relative',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
        justifyContent: 'center',
    },
    onlineBg: {
        backgroundColor: COLORS.success,
    },
    offlineBg: {
        backgroundColor: COLORS.textSecondary,
    },
    pill: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 6,
    },
    pillLeft: {
        left: 6,
    },
    pillRight: {
        right: 6,
    },
    text: {
        color: COLORS.white,
        fontWeight: '700',
        marginLeft: 12,
    },
});
