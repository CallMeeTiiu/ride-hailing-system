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
            // Gửi ngay lập tức 1 lần khi vừa bật Online (không chờ movement)
            Geolocation.getCurrentPosition(
                (pos) => {
                    const socket = getSocket();
                    if (socket?.connected) {
                        console.log('[Location] Initial push:', pos.coords.latitude, pos.coords.longitude);
                        socket.emit('driver:update_location', {
                            latitude: pos.coords.latitude,
                            longitude: pos.coords.longitude,
                            heading: pos.coords.heading,
                            speed: pos.coords.speed,
                        });
                    }
                },
                (err) => console.warn('[Location] Initial getCurrentPosition error:', err),
                { enableHighAccuracy: true, timeout: 10000 },
            );

            // Theo dõi liên tục — distanceFilter:0 để luôn gửi kể cả đứng yên (fix emulator)
            watchId.current = Geolocation.watchPosition(
                (position) => {
                    const socket = getSocket();
                    if (!socket?.connected) return;

                    console.log('[Location] Emitting:', position.coords.latitude, position.coords.longitude);
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
                    distanceFilter: 0,           // Luôn gửi kể cả đứng yên (fix emulator)
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
