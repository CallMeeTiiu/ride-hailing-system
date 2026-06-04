import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Alert,
    TouchableOpacity,
    StatusBar,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocationPermission } from '../hooks/useLocationPermission';
import { useLocationStream } from '../hooks/useLocationStream';
import MapBackground, { MapBackgroundRef } from '../components/MapBackground';
import { fetchRoute } from '../utils/fetchRoute';
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
    const insets = useSafeAreaInsets();

    // Bắn GPS stream liên tục khi online
    useLocationStream();

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

    const { granted: hasLocationPermission, location: userLocation } = useLocationPermission();
    const mapRef = useRef<MapBackgroundRef>(null);

    // Check for incomplete profiles (newly registered account check)
    useEffect(() => {
        if (driver && (driver.name === 'Tài xế mới' || driver.vehiclePlate === 'Chưa cập nhật')) {
            Alert.alert(
                'Yêu Cầu Hoàn Thiện Hồ Sơ',
                'Hồ sơ cá nhân và thông tin phương tiện của bạn chưa được thiết lập đầy đủ. Vui lòng cập nhật thông tin ngay.',
                [
                    {
                        text: 'Cập nhật ngay',
                        onPress: () => {
                            navigation.navigate('EditProfile');
                        }
                    }
                ],
                { cancelable: false }
            );
        }
    }, [driver, navigation]);

    // Recenter/fly to driver position when GPS is available
    useEffect(() => {
        if (hasLocationPermission && userLocation && mapRef.current) {
            mapRef.current.flyToLocation(userLocation.latitude, userLocation.longitude);
        }
    }, [hasLocationPermission, userLocation]);

    // Manage markers and routes based on trip status updates
    useEffect(() => {
        if (!mapRef.current) return;

        // Clear previous state elements
        mapRef.current.clearRoute();
        mapRef.current.clearDrivers();

        // UIT coordinates fallback if location is unavailable
        const driverLat = userLocation?.latitude ?? 10.8700;
        const driverLng = userLocation?.longitude ?? 106.8031;

        if (tripStatus === TripStatus.ONLINE) {
            // Draw driver itself on map
            mapRef.current.drawDrivers([{ lat: driverLat, lng: driverLng }]);
            mapRef.current.flyToLocation(driverLat, driverLng);
        } else if (tripStatus === TripStatus.ARRIVING && currentTrip) {
            // Driver is driving to pickup location
            mapRef.current.updateMarkers(
                driverLat,
                driverLng,
                currentTrip.pickup.latitude,
                currentTrip.pickup.longitude
            );
            fetchRoute(
                { latitude: driverLat, longitude: driverLng },
                currentTrip.pickup
            ).then((geoJson) => {
                if (geoJson && mapRef.current) {
                    mapRef.current.drawRoute(geoJson);
                }
            });
        } else if (tripStatus === TripStatus.SERVING && currentTrip) {
            // Driving to dropoff location
            mapRef.current.updateMarkers(
                currentTrip.pickup.latitude,
                currentTrip.pickup.longitude,
                currentTrip.dropoff.latitude,
                currentTrip.dropoff.longitude
            );
            fetchRoute(
                currentTrip.pickup,
                currentTrip.dropoff
            ).then((geoJson) => {
                if (geoJson && mapRef.current) {
                    mapRef.current.drawRoute(geoJson);
                }
            });
        }
    }, [tripStatus, currentTrip, userLocation]);

    const handleToggleOnline = () => {
        if (tripStatus === TripStatus.OFFLINE) {
            toggleOnline(true);
        } else {
            toggleOnline(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

            {/* Render Leaflet WebView Map block */}
            <MapBackground
                ref={mapRef}
                initialLat={MAP_INITIAL_REGION.latitude}
                initialLng={MAP_INITIAL_REGION.longitude}
            />

            {/* Top Floating Pill Toggle bar */}
            <View style={[styles.topControlFloating, { top: insets.top + 12 }]}>
                <StatusToggle
                    isOnline={tripStatus !== TripStatus.OFFLINE}
                    onToggle={handleToggleOnline}
                />
            </View>

            {/* Recaps maps overlay button */}
            <TouchableOpacity
                style={[styles.recenterBtn, { top: insets.top + 68 }]}
                activeOpacity={0.8}
                onPress={() => {
                    const lat = userLocation?.latitude ?? MAP_INITIAL_REGION.latitude;
                    const lng = userLocation?.longitude ?? MAP_INITIAL_REGION.longitude;
                    mapRef.current?.flyToLocation(lat, lng);
                }}
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
                onChat={() => navigation.navigate('Chat')}
                onConfirmArrived={confirmArrived}
                onStartTrip={startTrip}
                onFinishTrip={finishTrip}
                onSimulateCancel={cancelTrip}
                onCompleteFinish={completeFinish}
            />
        </View>
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
        alignSelf: 'center',
        zIndex: 10,
    },
    recenterBtn: {
        position: 'absolute',
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
