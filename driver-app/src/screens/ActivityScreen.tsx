import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import apiClient from '../services/apiClient';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';

interface TripItem {
    id: string;
    status: string;
    estimated_fare?: number;
    pickup_address?: string;
    dropoff_address?: string;
    createdAt?: string;
}

export default function ActivityScreen() {
    const [trips, setTrips] = useState<TripItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchHistory = async (showLoader = false) => {
        if (showLoader) setLoading(true);
        try {
            const res = await apiClient.get('/drivers/trips/history');
            if (res.data) {
                // Sắp xếp chuyến mới nhất lên trên
                const sorted = (res.data as TripItem[]).sort((a, b) => {
                    const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return tB - tA;
                });
                setTrips(sorted);
            }
        } catch (err) {
            console.log('[ActivityScreen] Fetch history failed:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchHistory(true);
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchHistory(false);
    };

    const formatCurrency = (val?: number) => {
        if (!val) return '0 ₫';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'Hôm nay';
        try {
            const d = new Date(dateStr);
            return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} - ${d.getDate()}/${d.getMonth() + 1}`;
        } catch {
            return dateStr;
        }
    };

    const renderItem = useCallback(({ item }: { item: TripItem }) => {
        const isCompleted = item.status === 'COMPLETED';
        return (
            <View style={styles.tripCard}>
                <View style={styles.cardHeader}>
                    <View style={styles.timeWrapper}>
                        <Icon name="clock" size={14} color={COLORS.textSecondary} />
                        <Text style={styles.timeText}>{formatDate(item.createdAt)}</Text>
                    </View>
                    <View style={[styles.statusWrapper, isCompleted ? styles.statusSuccess : styles.statusCancel]}>
                        <Text style={[styles.statusText, isCompleted ? styles.statusTextSuccess : styles.statusTextCancel]}>
                            {isCompleted ? 'Đã hoàn thành' : 'Đã hủy'}
                        </Text>
                    </View>
                </View>

                {/* Pickup & Dropoff Detail */}
                <View style={styles.addrWrapper}>
                    <View style={styles.addrRow}>
                        <View style={styles.dotPickup} />
                        <Text style={styles.addrText} numberOfLines={1}>
                            {item.pickup_address || 'Địa chỉ đón khách'}
                        </Text>
                    </View>
                    <View style={styles.addrLine} />
                    <View style={styles.addrRow}>
                        <View style={styles.dotDropoff} />
                        <Text style={styles.addrText} numberOfLines={1}>
                            {item.dropoff_address || 'Địa chỉ trả khách'}
                        </Text>
                    </View>
                </View>

                <View style={styles.cardFooter}>
                    <Text style={styles.tripId}>Mã chuyến: {item.id}</Text>
                    <Text style={styles.fareText}>{formatCurrency(item.estimated_fare)}</Text>
                </View>
            </View>
        );
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={[styles.headerTitle, TYPOGRAPHY.h2]}>Lịch Sử Hoạt Động</Text>
            </View>

            {loading ? (
                <View style={styles.centerLoader}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={trips}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Icon name="navigation" size={48} color={COLORS.textTertiary} />
                            <Text style={styles.emptyText}>Bạn chưa thực hiện chuyến đi nào</Text>
                        </View>
                    }
                />
            )}
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
    centerLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: SPACING.md,
        paddingBottom: SPACING.xl,
    },
    tripCard: {
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        marginBottom: SPACING.sm,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        paddingBottom: 8,
        marginBottom: 10,
    },
    timeWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginLeft: 6,
    },
    statusWrapper: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: RADIUS.sm,
    },
    statusSuccess: {
        backgroundColor: '#E8F5E9',
    },
    statusCancel: {
        backgroundColor: '#FFEBEE',
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
    },
    statusTextSuccess: {
        color: COLORS.success,
    },
    statusTextCancel: {
        color: COLORS.error,
    },
    addrWrapper: {
        marginBottom: 12,
        paddingLeft: 4,
    },
    addrRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dotPickup: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.success,
        marginRight: 10,
    },
    dotDropoff: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.error,
        marginRight: 10,
    },
    addrLine: {
        width: 1.5,
        height: 14,
        backgroundColor: '#E0E0E0',
        marginLeft: 3,
        marginVertical: 2,
    },
    addrText: {
        fontSize: 14,
        color: COLORS.textPrimary,
        flex: 1,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
        paddingTop: 8,
    },
    tripId: {
        fontSize: 11,
        color: COLORS.textTertiary,
    },
    fareText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    emptyState: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: COLORS.textSecondary,
        fontSize: 14,
        marginTop: SPACING.md,
    },
});
