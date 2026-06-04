import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
    AppState,
    AppStateStatus,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import apiClient from '../services/apiClient';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';

interface Transaction {
    id: string;
    amount: number;
    type: 'CREDIT' | 'DEBIT';
    createdAt?: string;
    description?: string;
}

export default function WalletScreen() {
    const [balance, setBalance] = useState<number>(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Call API /drivers/wallet
    const fetchWallet = async (showLoader = false) => {
        if (showLoader) setLoading(true);
        try {
            const res = await apiClient.get('/drivers/wallet');
            if (res.data) {
                setBalance(res.data.balance || 0);
                setTransactions(res.data.transactions || []);
            }
        } catch (err) {
            console.log('[WalletScreen] Fetch wallet failed:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // 1. Tự động tải lại khi tài xế mở app/resume từ background (Edge Case 3)
    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active') {
                console.log('[Wallet] App resumed, auto re-fetching wallet balance...');
                fetchWallet(false);
            }
        };
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => {
            subscription.remove();
        };
    }, []);

    // 2. Tự động tải lại khi tab Ví tài xế được hiển thị (Focus Tab)
    useFocusEffect(
        useCallback(() => {
            fetchWallet(true);
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchWallet(false);
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    };

    const renderItem = useCallback(({ item }: { item: Transaction }) => {
        const isCredit = item.type === 'CREDIT';
        return (
            <View style={styles.txnCard}>
                <View style={[styles.txnIconCol, isCredit ? styles.iconCreditBg : styles.iconDebitBg]}>
                    <Icon name={isCredit ? 'arrow-down-left' : 'arrow-up-right'} size={18} color={isCredit ? COLORS.success : COLORS.error} />
                </View>
                <View style={styles.txnDetailCol}>
                    <Text style={styles.txnTitle}>
                        {isCredit ? 'Cộng tiền chuyến đi' : 'Rút tiền về ngân hàng'}
                    </Text>
                    <Text style={styles.txnId}>Mã GD: {item.id}</Text>
                </View>
                <View style={styles.txnAmtCol}>
                    <Text style={[styles.txnAmount, isCredit ? styles.txtCredit : styles.txtDebit]}>
                        {isCredit ? '+' : '-'}{formatCurrency(item.amount)}
                    </Text>
                </View>
            </View>
        );
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={[styles.headerTitle, TYPOGRAPHY.h2]}>Ví Tài Xế</Text>
            </View>

            {loading ? (
                <View style={styles.centerLoader}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <View style={styles.flexContainer}>
                    {/* Wallet Balance Card */}
                    <View style={styles.balanceCard}>
                        <Text style={styles.balanceLabel}>Số dư hoạt động</Text>
                        <Text style={[styles.balanceValue, TYPOGRAPHY.h1]}>{formatCurrency(balance)}</Text>
                        <View style={styles.actionsRow}>
                            <TouchableOpacity style={styles.actionBtn}>
                                <Icon name="download" size={16} color={COLORS.white} />
                                <Text style={styles.actionBtnText}>Yêu cầu rút tiền</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnOutline]}>
                                <Icon name="refresh-cw" size={16} color={COLORS.primary} />
                                <Text style={[styles.actionBtnText, styles.actionBtnTextOutline]}>Nạp tiền</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Transaction List Title */}
                    <View style={styles.listHeaderRow}>
                        <Text style={[styles.listTitle, TYPOGRAPHY.h3]}>Lịch sử giao dịch</Text>
                        <TouchableOpacity onPress={() => fetchWallet(true)}>
                            <Icon name="rotate-cw" size={16} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* FlatList (Performance-tuned: memoized items) */}
                    <FlatList
                        data={transactions}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Icon name="credit-card" size={48} color={COLORS.textTertiary} />
                                <Text style={styles.emptyText}>Chưa có giao dịch phát sinh</Text>
                            </View>
                        }
                    />
                </View>
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
    flexContainer: {
        flex: 1,
        padding: SPACING.md,
    },
    balanceCard: {
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        marginBottom: SPACING.md,
        alignItems: 'center',
    },
    balanceLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 6,
    },
    balanceValue: {
        color: COLORS.primaryDark,
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: SPACING.md,
    },
    actionsRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    actionBtn: {
        flex: 1,
        height: 42,
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
    },
    actionBtnOutline: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    actionBtnText: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: '700',
        marginLeft: 6,
    },
    actionBtnTextOutline: {
        color: COLORS.primary,
    },
    listHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SPACING.xs,
        marginBottom: SPACING.sm,
        paddingHorizontal: 4,
    },
    listTitle: {
        color: COLORS.textPrimary,
    },
    listContent: {
        paddingBottom: SPACING.xl,
    },
    txnCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
        marginBottom: SPACING.sm,
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    txnIconCol: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.sm,
    },
    iconCreditBg: {
        backgroundColor: '#E8F5E9',
    },
    iconDebitBg: {
        backgroundColor: '#FFEBEE',
    },
    txnDetailCol: {
        flex: 1,
    },
    txnTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 2,
    },
    txnId: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    txnAmtCol: {
        alignItems: 'flex-end',
    },
    txnAmount: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    txtCredit: {
        color: COLORS.success,
    },
    txtDebit: {
        color: COLORS.error,
    },
    emptyState: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.lg,
    },
    emptyText: {
        color: COLORS.textSecondary,
        fontSize: 14,
        marginTop: SPACING.sm,
    },
});
