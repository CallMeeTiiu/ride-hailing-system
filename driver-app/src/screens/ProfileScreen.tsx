import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';
import Icon from 'react-native-vector-icons/Feather';
import apiClient from '../services/apiClient';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
    const navigation = useNavigation<any>();
    const driver = useAuthStore((state) => state.driver);
    const logout = useAuthStore((state) => state.logout);

    const [tripsCount, setTripsCount] = useState<number | null>(null);
    const [acceptanceRate, setAcceptanceRate] = useState<number | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        let isMounted = true;
        apiClient.get('/drivers/trips/history')
            .then((res) => {
                if (isMounted) {
                    setTripsCount(res.data.length);
                    // Giả lập/tính toán phần trăm chấp nhận (phối hợp mặc định 99%)
                    setAcceptanceRate(99);
                    setLoadingStats(false);
                }
            })
            .catch((err) => {
                console.error('[ProfileScreen] Fetch history failed:', err);
                if (isMounted) {
                    setTripsCount(0);
                    setAcceptanceRate(100);
                    setLoadingStats(false);
                }
            });
        return () => {
            isMounted = false;
        };
    }, []);

    if (!driver) return null;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={[styles.headerTitle, TYPOGRAPHY.h2]}>Trang Cá Nhân</Text>
            </View>

            <View style={styles.content}>
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <Image source={{ uri: driver.avatarUrl }} style={styles.avatar} />
                    <Text style={[styles.name, TYPOGRAPHY.h2]}>{driver.name}</Text>
                    <Text style={[styles.vehicle, TYPOGRAPHY.body]}>
                        Biển số: {driver.vehiclePlate}
                    </Text>

                    {/* Rating */}
                    <View style={styles.ratingRow}>
                        <Icon name="star" size={18} color="#FFC107" style={styles.starIcon} />
                        <Text style={styles.ratingText}>{driver.rating.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Small stats row */}
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statVal}>
                            {loadingStats ? '–' : `${acceptanceRate}%`}
                        </Text>
                        <Text style={styles.statLabel}>Chấp nhận</Text>
                    </View>
                    <View style={styles.statBoxBorder} />
                    <View style={styles.statBox}>
                        <Text style={styles.statVal}>
                            {loadingStats ? '–' : tripsCount}
                        </Text>
                        <Text style={styles.statLabel}>Chuyến đi (Tháng)</Text>
                    </View>
                </View>

                {/* Menu Items */}
                <View style={styles.menuList}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('EditProfile')}
                    >
                        <Icon name="edit" size={20} color={COLORS.textSecondary} />
                        <Text style={styles.menuText}>Chỉnh sửa hồ sơ</Text>
                        <Icon name="chevron-right" size={18} color={COLORS.textTertiary} style={styles.chevron} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('Documents')}
                    >
                        <Icon name="shield" size={20} color={COLORS.textSecondary} />
                        <Text style={styles.menuText}>Chứng chỉ & Giấy tờ</Text>
                        <Icon name="chevron-right" size={18} color={COLORS.textTertiary} style={styles.chevron} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Icon name="settings" size={20} color={COLORS.textSecondary} />
                        <Text style={styles.menuText}>Cấu hình thiết bị</Text>
                        <Icon name="chevron-right" size={18} color={COLORS.textTertiary} style={styles.chevron} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Icon name="help-circle" size={20} color={COLORS.textSecondary} />
                        <Text style={styles.menuText}>Trợ giúp & Hỗ trợ</Text>
                        <Icon name="chevron-right" size={18} color={COLORS.textTertiary} style={styles.chevron} />
                    </TouchableOpacity>

                    {/* Sign out */}
                    <TouchableOpacity style={styles.signOutBtn} onPress={logout}>
                        <Icon name="log-out" size={20} color={COLORS.error} />
                        <Text style={styles.signOutText}>Đăng xuất tài khoản</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.surface,
    },
    header: {
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    headerTitle: {
        color: COLORS.textPrimary,
    },
    content: {
        flex: 1,
        padding: SPACING.md,
    },
    profileCard: {
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        alignItems: 'center',
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        marginBottom: SPACING.md,
        borderWidth: 3,
        borderColor: COLORS.primaryLight,
    },
    name: {
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    vehicle: {
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFDE7',
        paddingHorizontal: SPACING.md,
        paddingVertical: 4,
        borderRadius: RADIUS.full,
    },
    starIcon: {
        marginRight: 4,
    },
    ratingText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#E0A800',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.md,
        paddingVertical: SPACING.md,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statVal: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    statBoxBorder: {
        width: 1,
        backgroundColor: '#EEEEEE',
    },
    menuList: {
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.lg,
        paddingVertical: SPACING.sm,
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: COLORS.textPrimary,
        marginLeft: SPACING.md,
    },
    chevron: {
        marginLeft: 'auto',
    },
    signOutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: 14,
        marginTop: SPACING.xs,
    },
    signOutText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.error,
        marginLeft: SPACING.md,
    },
});
