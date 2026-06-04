import React, { useMemo, useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Alert, Linking } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { TripStatus, TripData } from '../types';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';
import CustomerInfo from './CustomerInfo';
import StepIndicator from './StepIndicator';
import PrimaryButton from './PrimaryButton';
import LocationRow from './LocationRow';
import Icon from 'react-native-vector-icons/Feather';
import EmojiGrid from './EmojiGrid';
import StarRating from './StarRating';
import { useTripStore } from '../store/tripStore';

interface TripBottomSheetProps {
    tripStatus: TripStatus;
    trip: TripData | null;
    onChat: () => void;

    // Trip control hooks
    onConfirmArrived: () => void;
    onStartTrip: () => void;
    onFinishTrip: () => void;
    onSimulateCancel: () => void;
    onCompleteFinish: () => void;
}

export default function TripBottomSheet({
    tripStatus,
    trip,
    onChat,
    onConfirmArrived,
    onStartTrip,
    onFinishTrip,
    onSimulateCancel,
    onCompleteFinish,
}: TripBottomSheetProps) {
    const bottomSheetRef = useRef<BottomSheet>(null);

    // Zustand rating store integration
    const {
        ratingStep,
        submitMood,
        submitRating,
    } = useTripStore();

    // Local UI selection states
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [hasSelectedMood, setHasSelectedMood] = useState(false);
    const [selectedRating, setSelectedRating] = useState<number>(0);

    const handleCallCustomer = async () => {
        const phone = trip?.customer?.phone;
        
        if (!phone) {
            Alert.alert('Lỗi', 'Không tìm thấy số điện thoại của khách hàng.');
            return;
        }

        const url = `tel:${phone}`;
        
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Lỗi', 'Thiết bị của bạn không hỗ trợ gọi điện.');
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi cố gắng mở trình gọi điện.');
        }
    };

    // Reset local selection states when trip finished starts
    useEffect(() => {
        if (tripStatus === TripStatus.FINISHED) {
            setSelectedMood(null);
            setHasSelectedMood(false);
            setSelectedRating(0);
        }
    }, [tripStatus, ratingStep]);

    // Define persistent snaps
    const snapPoints = useMemo(() => {
        if (tripStatus === TripStatus.OFFLINE || tripStatus === TripStatus.ONLINE) {
            return ['24%']; // smaller snap when idle
        }
        if (tripStatus === TripStatus.FINISHED) {
            return ['76%']; // larger height for rating & emoji elements
        }
        return ['42%']; // expanded for active cuốc
    }, [tripStatus]);

    const renderContent = () => {
        switch (tripStatus) {
            case TripStatus.OFFLINE:
                return (
                    <View style={styles.idleContainer}>
                        <View style={styles.offlineDot} />
                        <Text style={[styles.mainText, TYPOGRAPHY.h2]}>Bạn Đang Offline</Text>
                        <Text style={[styles.subText, TYPOGRAPHY.body]}>
                            Mau gạt Online phía trên để tiếp tục kết nối với những chuyến xe từ trung tâm điều động!
                        </Text>
                    </View>
                );

            case TripStatus.ONLINE:
                return (
                    <View style={styles.idleContainer}>
                        <View style={styles.onlineDot} />
                        <Text style={[styles.mainText, TYPOGRAPHY.h2]}>Đang Chờ Cuốc Xe...</Text>
                        <Text style={[styles.subText, TYPOGRAPHY.body]}>
                            Hệ thống đang dò tìm chuyến xe gần nhất. Hãy giữ kết nối Internet ổn định.
                        </Text>
                    </View>
                );

            case TripStatus.ARRIVING:
                return (
                    <View style={styles.activeContainer}>
                        <StepIndicator currentStep={0} />
                        <CustomerInfo customer={trip!.customer} onCall={handleCallCustomer} onChat={onChat} />

                        <View style={styles.addressRow}>
                            <Icon name="circle" size={14} color={COLORS.primary} style={{ marginRight: 8, marginTop: 4 }} />
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.addressLabel, TYPOGRAPHY.small]}>ĐIỂM ĐÓN CỦA KHÁCH</Text>
                                <Text style={[styles.addressText, TYPOGRAPHY.body]} numberOfLines={1}>{trip!.pickup.address}</Text>
                            </View>
                        </View>

                        <View style={styles.actionRow}>
                            <PrimaryButton
                                title="CONFIRM ARRIVED"
                                onPress={onConfirmArrived}
                                style={styles.primaryBtn}
                            />
                            <PrimaryButton
                                title="SIMULATE CANCEL"
                                variant="outline"
                                onPress={onSimulateCancel}
                                style={styles.simBtn}
                            />
                        </View>
                    </View>
                );

            case TripStatus.ARRIVED:
            case TripStatus.WAITING:
                return (
                    <View style={styles.activeContainer}>
                        <StepIndicator currentStep={1} />
                        <CustomerInfo customer={trip!.customer} onCall={handleCallCustomer} onChat={onChat} />

                        <View style={[styles.addressRow, { backgroundColor: '#FFFDF0', borderColor: '#FFE8A3', borderWidth: 1 }]}>
                            <Icon name="clock" size={16} color="#FF9800" style={{ marginRight: 8 }} />
                            <Text style={[styles.waitingAlert, TYPOGRAPHY.caption]}>
                                Tài xế đã đến điểm đón! Đang phát tín hiệu chờ khách lên xe.
                            </Text>
                        </View>

                        <View style={styles.actionRow}>
                            <PrimaryButton
                                title="START TRIP"
                                variant="success"
                                onPress={onStartTrip}
                                style={styles.primaryBtn}
                            />
                            <PrimaryButton
                                title="SIMULATE CANCEL"
                                variant="outline"
                                onPress={onSimulateCancel}
                                style={styles.simBtn}
                            />
                        </View>
                    </View>
                );

            case TripStatus.SERVING:
                return (
                    <View style={styles.activeContainer}>
                        <StepIndicator currentStep={2} />
                        <CustomerInfo customer={trip!.customer} onCall={handleCallCustomer} onChat={onChat} />

                        <View style={styles.addressRow}>
                            <Icon name="map-pin" size={14} color={COLORS.error} style={{ marginRight: 8, marginTop: 4 }} />
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.addressLabel, TYPOGRAPHY.small]}>ĐIỂM ĐẾN CỦA CHUYẾN ĐI</Text>
                                <Text style={[styles.addressText, TYPOGRAPHY.body]} numberOfLines={1}>{trip!.dropoff.address}</Text>
                            </View>
                        </View>

                        <PrimaryButton
                            title="FINISH TRIP"
                            variant="danger"
                            onPress={onFinishTrip}
                        />
                    </View>
                );

            case TripStatus.FINISHED:
                if (ratingStep === 'mood') {
                    return (
                        <View style={styles.ratingOuterContainer}>
                            <Text style={styles.sheetHeaderTitle}>Your Mood</Text>
                            <View style={styles.hr} />

                            <View style={styles.customerCard}>
                                <Image source={{ uri: trip?.customer.avatarUrl }} style={styles.customerAvatar} />
                                <View style={styles.customerCardDetails}>
                                    <Text style={[styles.customerCardName, TYPOGRAPHY.h3]}>{trip?.customer.name}</Text>
                                    <Text style={[styles.customerCardPhone, TYPOGRAPHY.caption]}>{trip?.customer.phone}</Text>
                                </View>
                            </View>

                            <Text style={styles.ratingPrimaryText}>What's Your Mood about this customer?</Text>
                            <Text style={styles.ratingSecondaryText}>about this trip?</Text>

                            <EmojiGrid
                                selectedId={selectedMood}
                                hasSelected={hasSelectedMood}
                                onSelect={(moodId) => {
                                    setSelectedMood(moodId);
                                    setHasSelectedMood(true);
                                }}
                            />

                            <View style={styles.ratingActionsRow}>
                                <PrimaryButton
                                    title="Cancel"
                                    variant="outline"
                                    onPress={onCompleteFinish}
                                    style={styles.ratingCancelBtn}
                                />
                                <PrimaryButton
                                    title="Submit"
                                    onPress={() => submitMood(selectedMood)}
                                    style={styles.ratingSubmitBtn}
                                    disabled={!hasSelectedMood}
                                />
                            </View>
                        </View>
                    );
                }

                if (ratingStep === 'star') {
                    return (
                        <View style={styles.ratingOuterContainer}>
                            <Text style={styles.sheetHeaderTitle}>Rate Customer</Text>
                            <View style={styles.hr} />

                            <View style={styles.customerCard}>
                                <Image source={{ uri: trip?.customer.avatarUrl }} style={styles.customerAvatar} />
                                <View style={styles.customerCardDetails}>
                                    <Text style={[styles.customerCardName, TYPOGRAPHY.h3]}>{trip?.customer.name}</Text>
                                    <Text style={[styles.customerCardPhone, TYPOGRAPHY.caption]}>{trip?.customer.phone}</Text>
                                </View>
                            </View>

                            <Text style={styles.ratingPrimaryText}>How is your Customer?</Text>
                            <Text style={styles.ratingSecondaryText}>Please rate your customer...</Text>

                            <StarRating
                                rating={selectedRating}
                                onRatingChange={(stars) => setSelectedRating(stars)}
                            />

                            <View style={styles.ratingActionsRow}>
                                <PrimaryButton
                                    title="Cancel"
                                    variant="outline"
                                    onPress={onCompleteFinish}
                                    style={styles.ratingCancelBtn}
                                />
                                <PrimaryButton
                                    title="Submit"
                                    variant="primary"
                                    onPress={() => submitRating(selectedRating)}
                                    style={styles.ratingSubmitBtn}
                                    disabled={selectedRating === 0}
                                />
                            </View>
                        </View>
                    );
                }

                // Default fallback if ratings completed but tripStatus not updated yet
                return (
                    <View style={styles.finishedContainer}>
                        <View style={styles.checkCircle}>
                            <Icon name="check" size={32} color={COLORS.white} />
                        </View>
                        <Text style={[styles.mainText, TYPOGRAPHY.h2]}>Hoàn Thành Chuyến Đi!</Text>
                        <Text style={[styles.fareText, TYPOGRAPHY.h1]}>
                            +{trip?.fare?.toLocaleString('vi-VN')} đ
                        </Text>
                        <Text style={[styles.subText, TYPOGRAPHY.caption]}>
                            Doanh thu đã được ghi nhận vào ví tài xế của quý đối tác.
                        </Text>
                        <PrimaryButton
                            title="TIẾP TỤC HOẠT ĐỘNG"
                            onPress={onCompleteFinish}
                            style={{ marginTop: 12 }}
                        />
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            handleIndicatorStyle={styles.bottomSheetIndicator}
            backgroundStyle={styles.bottomSheetBg}
        >
            <BottomSheetView style={styles.bottomSheetContent}>
                {renderContent()}
            </BottomSheetView>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    bottomSheetBg: {
        backgroundColor: COLORS.background,
        borderTopLeftRadius: RADIUS.lg,
        borderTopRightRadius: RADIUS.lg,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 8,
    },
    bottomSheetIndicator: {
        backgroundColor: COLORS.textTertiary,
        width: 40,
    },
    bottomSheetContent: {
        flex: 1,
        paddingHorizontal: SPACING.md,
        paddingTop: SPACING.xs,
        paddingBottom: SPACING.lg,
    },
    idleContainer: {
        alignItems: 'center',
        paddingVertical: SPACING.md,
    },
    offlineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.textSecondary,
        marginBottom: SPACING.sm,
    },
    onlineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.success,
        marginBottom: SPACING.sm,
    },
    mainText: {
        color: COLORS.textPrimary,
        fontWeight: '800',
        marginBottom: SPACING.sm,
    },
    subText: {
        color: COLORS.textSecondary,
        textAlign: 'center',
        paddingHorizontal: SPACING.md,
        lineHeight: 20,
    },
    activeContainer: {
        alignItems: 'center',
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: COLORS.surface,
        padding: SPACING.sm + 4,
        borderRadius: RADIUS.sm,
        marginVertical: SPACING.sm,
        width: '100%',
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    addressLabel: {
        color: COLORS.textSecondary,
        fontWeight: '700',
        fontSize: 10,
        marginBottom: 2,
    },
    addressText: {
        color: COLORS.textPrimary,
        fontWeight: '600',
    },
    waitingAlert: {
        color: '#E65100',
        fontWeight: '700',
        flex: 1,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    primaryBtn: {
        width: '54%',
    },
    simBtn: {
        width: '42%',
    },
    finishedContainer: {
        alignItems: 'center',
        paddingVertical: SPACING.sm,
    },
    checkCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.success,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.sm,
    },
    fareText: {
        color: COLORS.success,
        fontWeight: '900',
        marginVertical: 4,
    },

    // Rating & step designs
    ratingOuterContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: SPACING.xs,
    },
    sheetHeaderTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
        textAlign: 'center',
        paddingBottom: SPACING.sm,
    },
    hr: {
        height: 1,
        backgroundColor: '#EEEEEE',
        width: '120%', // bleed past sheet padding
        marginBottom: SPACING.md,
    },
    customerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: SPACING.md,
        marginBottom: SPACING.md,
    },
    customerAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    customerCardDetails: {
        marginLeft: SPACING.md,
        flex: 1,
    },
    customerCardName: {
        color: COLORS.textPrimary,
        fontWeight: '700',
    },
    customerCardPhone: {
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    ratingPrimaryText: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.textPrimary,
        textAlign: 'center',
        marginBottom: 4,
    },
    ratingSecondaryText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.md,
    },
    ratingActionsRow: {
        flexDirection: 'row',
        width: '100%',
        gap: SPACING.md,
        marginTop: SPACING.md,
    },
    ratingCancelBtn: {
        flex: 1,
    },
    ratingSubmitBtn: {
        flex: 1,
    },
});
