import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { useTripStore } from '../store/tripStore';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

export default function CallScreen() {
    const navigation = useNavigation();
    const currentTrip = useTripStore((state) => state.currentTrip);

    // Call configuration
    const [seconds, setSeconds] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeaker, setIsSpeaker] = useState(false);
    const [isDisconnecting, setIsDisconnecting] = useState(false);

    // Time counting ticker
    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatDuration = (secCount: number) => {
        const mins = Math.floor(secCount / 60);
        const secs = secCount % 60;
        const pad = (val: number) => (val < 10 ? `0${val}` : val);
        return `${pad(mins)}:${pad(secs)}`;
    };

    const handleEndCall = () => {
        setIsDisconnecting(true);
        // Phase 4: Mock connection closing lag of 2 seconds
        setTimeout(() => {
            navigation.goBack();
        }, 2000);
    };

    if (!currentTrip) return null;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />

            {/* Tên & Trạng Thái Gọi */}
            <View style={styles.header}>
                <Icon name="shield" size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
                <Text style={styles.secureText}>Cuộc gọi bảo mật mã hoá</Text>
            </View>

            {/* Avatar Khách Hàng */}
            <View style={styles.centerBlock}>
                <View style={styles.avatarOutline}>
                    <Image
                        source={{ uri: currentTrip.customer.avatarUrl }}
                        style={styles.avatar}
                    />
                </View>
                <Text style={[styles.name, TYPOGRAPHY.h1]}>{currentTrip.customer.name}</Text>
                <Text style={[styles.statusText, TYPOGRAPHY.body]}>
                    {isDisconnecting ? 'Đang ngắt kết nối...' : 'Cuộc gọi đang kết nối'}
                </Text>

                {!isDisconnecting && (
                    <Text style={[styles.timer, TYPOGRAPHY.h2]}>
                        {formatDuration(seconds)}
                    </Text>
                )}
            </View>

            {/* Điều Khiển Cuộc Gọi */}
            <View style={styles.controlsRow}>
                <TouchableOpacity
                    style={[styles.actionBtn, isMuted && styles.activeActionBtn]}
                    onPress={() => setIsMuted(!isMuted)}
                    activeOpacity={0.8}
                >
                    <Icon
                        name={isMuted ? 'mic-off' : 'mic'}
                        size={24}
                        color={isMuted ? COLORS.white : '#B0B0B0'}
                    />
                    <Text style={styles.actionLabel}>Mute</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionBtn, isSpeaker && styles.activeActionBtn]}
                    onPress={() => setIsSpeaker(!isSpeaker)}
                    activeOpacity={0.8}
                >
                    <Icon
                        name="volume-2"
                        size={24}
                        color={isSpeaker ? COLORS.white : '#B0B0B0'}
                    />
                    <Text style={styles.actionLabel}>Speaker</Text>
                </TouchableOpacity>
            </View>

            {/* Nút Gác Máy */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.declineBtn}
                    onPress={handleEndCall}
                    activeOpacity={0.8}
                    disabled={isDisconnecting}
                >
                    <Icon name="phone-off" size={28} color={COLORS.white} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING.xl,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.md,
    },
    secureText: {
        color: '#8E8E93',
        fontSize: 13,
        fontWeight: '600',
    },
    centerBlock: {
        alignItems: 'center',
    },
    avatarOutline: {
        width: 130,
        height: 130,
        borderRadius: 65,
        borderWidth: 2,
        borderColor: 'rgba(245, 166, 35, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.lg,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    name: {
        color: COLORS.white,
        fontWeight: '800',
        marginBottom: SPACING.xs,
    },
    statusText: {
        color: COLORS.primary,
        fontWeight: '600',
        marginBottom: SPACING.sm,
    },
    timer: {
        color: COLORS.white,
        fontWeight: '800',
    },
    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: SPACING.xl,
    },
    actionBtn: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: '#2C2C2E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeActionBtn: {
        backgroundColor: COLORS.primaryDark,
    },
    actionLabel: {
        color: '#8E8E93',
        fontSize: 12,
        fontWeight: '700',
        marginTop: 6,
        position: 'absolute',
        bottom: -22,
    },
    footer: {
        marginBottom: SPACING.lg,
    },
    declineBtn: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: COLORS.error,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.error,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
        minHeight: 48, // ensure minimum touch target
    },
});
