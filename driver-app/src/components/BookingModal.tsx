import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View, Animated, Easing, Platform } from 'react-native';
import { TripData } from '../types';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';
import LocationRow from './LocationRow';
import PrimaryButton from './PrimaryButton';
import Icon from 'react-native-vector-icons/Feather';

interface BookingModalProps {
    visible: boolean;
    trip: TripData | null;
    onAccept: () => void;
    onReject: () => void;
    onTimeout: () => void;
    timeoutSeconds?: number;
}

export default function BookingModal({
    visible,
    trip,
    onAccept,
    onReject,
    onTimeout,
    timeoutSeconds = 15,
}: BookingModalProps) {
    const [secondsLeft, setSecondsLeft] = useState(timeoutSeconds);
    const [progressWidth] = useState(new Animated.Value(100)); // Percentage

    useEffect(() => {
        if (!visible || !trip) return;

        // Reset countdown states
        setSecondsLeft(timeoutSeconds);
        progressWidth.setValue(100);

        // Linear bar shrink animation
        Animated.timing(progressWidth, {
            toValue: 0,
            duration: timeoutSeconds * 1000,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();

        // 1-second interval ticking
        const intervalId = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalId);
                    onTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(intervalId);
            progressWidth.setValue(100);
        };
    }, [visible, trip, timeoutSeconds]);

    if (!visible || !trip) return null;

    return (
        <Modal
            transparent
            animationType="slide"
            visible={visible}
            onRequestClose={onReject}
        >
            <View style={styles.overlay}>
                <View style={styles.modalView}>

                    {/* Headline Timer Section */}
                    <View style={styles.header}>
                        <Icon name="bell" size={24} color={COLORS.primaryDark} style={styles.bellIcon} />
                        <Text style={[styles.title, TYPOGRAPHY.h3]}>CUỐC XE MỚI!</Text>
                        <View style={styles.timerBubble}>
                            <Text style={styles.timerText}>{secondsLeft}s</Text>
                        </View>
                    </View>

                    {/* Countdown Indicator Bar */}
                    <View style={styles.progressBarBg}>
                        <Animated.View
                            style={[
                                styles.progressBarFill,
                                {
                                    width: progressWidth.interpolate({
                                        inputRange: [0, 100],
                                        outputRange: ['0%', '100%'],
                                    }),
                                },
                            ]}
                        />
                    </View>

                    <View style={styles.fareRow}>
                        <Text style={styles.fareLabel}>GIÁ CƯỚC</Text>
                        <Text style={styles.fareValue}>
                            {trip.fare ? `${trip.fare.toLocaleString('vi-VN')} đ` : '0đ'}
                        </Text>
                    </View>

                    {/* Location Block */}
                    <View style={styles.divider} />

                    <LocationRow type="pickup" address={trip.pickup.address} />

                    <View style={styles.verticalLink} />

                    <LocationRow type="dropoff" address={trip.dropoff.address} />

                    <View style={styles.divider} />

                    {/* Customer Rating Box */}
                    <View style={styles.customerRow}>
                        <Icon name="user" size={16} color={COLORS.textSecondary} style={{ marginRight: 6 }} />
                        <Text style={[styles.customerText, TYPOGRAPHY.caption]}>
                            Khách hàng: <Text style={{ fontWeight: '700' }}>{trip.customer.name}</Text> ({trip.customer.rating} ★)
                        </Text>
                    </View>

                    {/* Reject & Accept CTAs */}
                    <View style={styles.actions}>
                        <PrimaryButton
                            title="REJECT"
                            variant="outline"
                            style={styles.rejectBtn}
                            onPress={onReject}
                        />
                        <PrimaryButton
                            title="ACCEPT"
                            variant="primary"
                            style={styles.acceptBtn}
                            onPress={onAccept}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: COLORS.overlay,
        justifyContent: 'flex-end',
        padding: SPACING.md,
    },
    modalView: {
        backgroundColor: COLORS.background,
        borderTopLeftRadius: RADIUS.lg,
        borderTopRightRadius: RADIUS.lg,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
        marginBottom: Platform.OS === 'ios' ? 24 : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
        width: '100%',
    },
    bellIcon: {
        marginRight: SPACING.sm,
    },
    title: {
        color: COLORS.primaryDark,
        fontWeight: '800',
        flex: 1,
    },
    timerBubble: {
        backgroundColor: COLORS.primaryLight,
        borderRadius: RADIUS.full,
        paddingHorizontal: SPACING.md,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#FFE0A1',
    },
    timerText: {
        fontWeight: '800',
        fontSize: 16,
        color: '#D47500',
    },
    progressBarBg: {
        height: 4,
        width: '100%',
        backgroundColor: '#EEEEEE',
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: SPACING.md,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
    },
    fareRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: SPACING.sm,
    },
    fareLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.textSecondary,
    },
    fareValue: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.success,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#EEEEEE',
        marginVertical: SPACING.sm,
    },
    verticalLink: {
        width: 2,
        height: 12,
        backgroundColor: COLORS.textTertiary,
        alignSelf: 'flex-start',
        marginLeft: 23,
        marginVertical: -8,
    },
    customerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginBottom: SPACING.md,
    },
    customerText: {
        color: COLORS.textPrimary,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    rejectBtn: {
        width: '45%',
    },
    acceptBtn: {
        width: '50%',
    },
});
