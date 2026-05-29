import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Customer } from '../types';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';
import Icon from 'react-native-vector-icons/Feather';

interface CustomerInfoProps {
    customer: Customer;
    onCall: () => void;
    onChat: () => void;
}

export default function CustomerInfo({ customer, onCall, onChat }: CustomerInfoProps) {
    return (
        <View style={styles.container}>
            <Image source={{ uri: customer.avatarUrl }} style={styles.avatar} />

            <View style={styles.details}>
                <Text style={[styles.name, TYPOGRAPHY.h3]}>{customer.name}</Text>
                <View style={styles.ratingRow}>
                    <Icon name="star" size={14} color="#FFC107" style={styles.star} />
                    <Text style={[styles.rating, TYPOGRAPHY.caption]}>
                        {customer.rating.toFixed(1)}
                    </Text>
                </View>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.iconBtn} onPress={onChat} activeOpacity={0.7}>
                    <Icon name="message-square" size={20} color={COLORS.primaryDark} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconBtn, styles.callBtn]} onPress={onCall} activeOpacity={0.7}>
                    <Icon name="phone" size={20} color={COLORS.white} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        width: '100%',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: SPACING.md,
    },
    details: {
        flex: 1,
    },
    name: {
        color: COLORS.textPrimary,
        fontWeight: '700',
        marginBottom: 2,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    star: {
        marginRight: 4,
    },
    rating: {
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primaryLight,
        marginLeft: SPACING.sm,
        borderWidth: 1,
        borderColor: '#FFE0A1',
        minHeight: 44, // touch size
        minWidth: 44,
    },
    callBtn: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
});
