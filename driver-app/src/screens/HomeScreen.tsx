import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Alert,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useTripStore } from '../store/tripStore';
import { useAuthStore } from '../store/authStore';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';
import StatusToggle from '../components/StatusToggle';
import BookingModal from '../components/BookingModal';
import TripBottomSheet from '../components/TripBottomSheet';
import CanceledModal from '../components/CanceledModal';
import Icon from 'react-native-vector-icons/Feather';
import { TripStatus } from '../types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStack';

// Center of Hanoi center point
const MAP_INITIAL_REGION = {
    latitude: 21.028511,
    longitude: 105.804817,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
};

export default function HomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
    const driver = useAuthStore((state) => state.driver);

    // Zustand stores
    const {
        tripStatus,
        currentTrip,
        toggleOnline,
        receiveBooking,
        acceptTrip,
        rejectTrip,
        confirmArrived,
        startTrip,
        finishTrip,
        cancelTrip,
        completeFinish,
        dismissCancel,
    } = useTripStore();

    const [hasLocationPermission, setHasLocationPermission] = useState(false);
    const [mapRegion, setMapRegion] = useState(MAP_INITIAL_REGION);

    // Phase 1: Request fine maps location permissions automatically
    useEffect(() => {
        const handlePermissions = async () => {
            const permissionType =
                Platform.OS === 'ios'
                    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

            try {
                const checkStatus = await check(permissionType);
                if (checkStatus === RESULTS.GRANTED) {
                    setHasLocationPermission(true);
                } else {
                    const requestStatus = await request(permissionType);
                    if (requestStatus === RESULTS.GRANTED) {
                        setHasLocationPermission(true);
                    } else {
                        Alert.alert(
                            'Quyền Vị Trí Bị Từ Chối',
                            'Để hiển thị bản đồ và di chuyển, vui lòng cấp quyền truy cập vị trí trong cài đặt hệ thống.'
                        );
                    }
                }
            } catch (err) {
                console.warn('Cannot request location rights: ', err);
            }
        };
        handlePermissions();
    }, []);

    // Phase 3: Simulated 5-second incoming cuốc xe after switching Online
    useEffect(() => {
        let mockBookingTimer: any;
        if (tripStatus === TripStatus.ONLINE) {
            mockBookingTimer = setTimeout(() => {
                receiveBooking();
            }, 5000); // 5s countdown delay
        }

        return () => {
            if (mockBookingTimer) clearTimeout(mockBookingTimer);
        };
    }, [tripStatus]);

    // Recaps maps area region when trip status updates for premium user experience
    useEffect(() => {
        if (!currentTrip) {
            setMapRegion(MAP_INITIAL_REGION);
            return;
        }

        if (tripStatus === TripStatus.ARRIVING) {
            // Focus on active pickup
            setMapRegion({
                latitude: (currentTrip.pickup.latitude + 21.026) / 2, // midpoint
                longitude: (currentTrip.pickup.longitude + 105.802) / 2,
                latitudeDelta: 0.025,
                longitudeDelta: 0.025,
            });
        } else if (tripStatus === TripStatus.SERVING) {
            // Focus dropoff route
            setMapRegion({
                latitude: (currentTrip.pickup.latitude + currentTrip.dropoff.latitude) / 2,
                longitude: (currentTrip.pickup.longitude + currentTrip.dropoff.longitude) / 2,
                latitudeDelta: 0.035,
                longitudeDelta: 0.035,
            });
        }
    }, [tripStatus, currentTrip]);

    const handleToggleOnline = () => {
        if (tripStatus === TripStatus.OFFLINE) {
            toggleOnline(true);
        } else {
            toggleOnline(false);
        }
    };

    // Mock points for live visualization on maps
    const mockDriverLoc = { latitude: 21.0252, longitude: 105.801 }; // Simulated live driver coords
    const mockPickupLoc = currentTrip?.pickup || { latitude: 0, longitude: 0 };
    const mockDropoffLoc = currentTrip?.dropoff || { latitude: 0, longitude: 0 };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

            {/* Render Google Maps block */}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={mapRegion}
                showsUserLocation={hasLocationPermission}
                showsMyLocationButton={false}
            >
                {/* Render simulated driver pin when online or active */}
                {tripStatus !== TripStatus.OFFLINE && (
                    <Marker
                        coordinate={mockDriverLoc}
                        title={driver?.name || 'Tài xế'}
                        description={driver?.vehiclePlate}
                    >
                        <View style={styles.driverIndicator}>
                            <View style={styles.driverCore} />
                        </View>
                    </Marker>
                )}

                {/* Pickup marker */}
                {currentTrip &&
                    tripStatus !== TripStatus.OFFLINE &&
                    tripStatus !== TripStatus.ONLINE &&
                    tripStatus !== TripStatus.BOOKING_INCOMING &&
                    tripStatus !== TripStatus.FINISHED && (
                        <Marker
                            coordinate={mockPickupLoc}
                            title="ĐIỂM Đ đón khách"
                            description={currentTrip.pickup.address}
                            pinColor="green"
                        />
                    )}

                {/* Dropoff marker */}
                {currentTrip &&
                    (tripStatus === TripStatus.SERVING) && (
                        <Marker
                            coordinate={mockDropoffLoc}
                            title="ĐIỂM ĐẾN trả khách"
                            description={currentTrip.dropoff.address}
                            pinColor="red"
                        />
                    )}

                {/* Visual routing curves between positions */}
                {tripStatus === TripStatus.ARRIVING && (
                    <Polyline
                        coordinates={[mockDriverLoc, mockPickupLoc]}
                        strokeColor={COLORS.primaryDark}
                        strokeWidth={4}
                        lineDashPattern={[5, 5]}
                    />
                )}

                {tripStatus === TripStatus.SERVING && (
                    <Polyline
                        coordinates={[mockPickupLoc, mockDropoffLoc]}
                        strokeColor={COLORS.success}
                        strokeWidth={4}
                    />
                )}
            </MapView>

            {/* Top Floating Pill Toggle bar */}
            <View style={styles.topControlFloating}>
                <StatusToggle
                    isOnline={tripStatus !== TripStatus.OFFLINE}
                    onToggle={handleToggleOnline}
                />
            </View>

            {/* Recaps maps overlay button */}
            <TouchableOpacity
                style={styles.recenterBtn}
                activeOpacity={0.8}
                onPress={() => setMapRegion(MAP_INITIAL_REGION)}
            >
                <Icon name="crosshair" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>

            {/* Booking Incoming Popups details countdown */}
            <BookingModal
                visible={tripStatus === TripStatus.BOOKING_INCOMING}
                trip={currentTrip}
                onAccept={acceptTrip}
                onReject={rejectTrip}
                onTimeout={rejectTrip} // Timeout triggers cuốc trôi, goes back to ONLINE
                timeoutSeconds={15}
            />

            {/* Finished or Canceled triggers modals */}
            <CanceledModal
                visible={tripStatus === TripStatus.CANCELED}
                onDismiss={dismissCancel}
            />

            {/* Bottom sliding panels workflow sheets controller */}
            <TripBottomSheet
                tripStatus={tripStatus}
                trip={currentTrip}
                onCall={() => navigation.navigate('Call')}
                onChat={() => navigation.navigate('Chat')}
                onConfirmArrived={confirmArrived}
                onStartTrip={startTrip}
                onFinishTrip={finishTrip}
                onSimulateCancel={cancelTrip}
                onCompleteFinish={completeFinish}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    topControlFloating: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 36,
        alignSelf: 'center',
        zIndex: 10,
    },
    recenterBtn: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 120 : 96,
        right: SPACING.md,
        backgroundColor: COLORS.background,
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
        zIndex: 10,
    },
    driverIndicator: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(245, 166, 35, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    driverCore: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.primaryDark,
        borderWidth: 1.5,
        borderColor: COLORS.white,
    },
});
