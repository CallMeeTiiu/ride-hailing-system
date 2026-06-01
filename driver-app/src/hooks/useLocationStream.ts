import { useEffect, useRef } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { getSocket } from '../services/socketClient';
import { useTripStore } from '../store/tripStore';
import { TripStatus } from '../types';
import { CONFIG } from '../services/config';

export function useLocationStream() {
    const watchId = useRef<number | null>(null);
    const tripStatus = useTripStore((s) => s.tripStatus);
    const currentTrip = useTripStore((s) => s.currentTrip);

    useEffect(() => {
        const isActive = tripStatus !== TripStatus.OFFLINE;

        if (isActive) {
            watchId.current = Geolocation.watchPosition(
                (position) => {
                    const socket = getSocket();
                    if (!socket?.connected) return;

                    socket.emit('driver:update_location', {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        heading: position.coords.heading,
                        speed: position.coords.speed,
                        trip_id: currentTrip?.id || undefined,
                    });
                },
                (error) => console.error('[Location] Error:', error),
                {
                    enableHighAccuracy: true,
                    distanceFilter: 10,           // Chỉ emit khi di chuyển >10m
                    interval: CONFIG.LOCATION_INTERVAL_MS,
                    fastestInterval: 3000,
                },
            );
        }

        return () => {
            if (watchId.current !== null) {
                Geolocation.clearWatch(watchId.current);
                watchId.current = null;
            }
        };
    }, [tripStatus, currentTrip?.id]);
}
