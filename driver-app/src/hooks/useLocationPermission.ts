import { useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';

export function useLocationPermission() {
    const [granted, setGranted] = useState(false);
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    useEffect(() => {
        const handlePermissions = async () => {
            const permissionType =
                Platform.OS === 'ios'
                    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

            try {
                const checkStatus = await check(permissionType);
                if (checkStatus === RESULTS.GRANTED) {
                    setGranted(true);
                    startWatchingLocation();
                } else {
                    const requestStatus = await request(permissionType);
                    if (requestStatus === RESULTS.GRANTED) {
                        setGranted(true);
                        startWatchingLocation();
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

        const startWatchingLocation = () => {
            Geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.warn('GPS Error: ', error.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        };

        handlePermissions();
    }, []);

    return { granted, location };
}
