import { TripStatus } from '../types';

/**
 * Backend TripStatus values (as received from API/Socket)
 * Đây là "ngôn ngữ" của server.
 */
export type BackendTripStatus =
    | 'PENDING'
    | 'ACCEPTED'
    | 'ARRIVED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED_BY_CUSTOMER'
    | 'CANCELLED_BY_DRIVER';

/**
 * BE → FE: Convert trạng thái từ server về trạng thái UI.
 * Dùng khi: nhận response từ API hoặc Socket event.
 */
export function toFrontendStatus(beStatus: BackendTripStatus): TripStatus {
    const map: Record<BackendTripStatus, TripStatus> = {
        PENDING: TripStatus.BOOKING_INCOMING,
        ACCEPTED: TripStatus.ARRIVING,
        ARRIVED: TripStatus.ARRIVED,
        IN_PROGRESS: TripStatus.SERVING,
        COMPLETED: TripStatus.FINISHED,
        CANCELLED_BY_CUSTOMER: TripStatus.CANCELED,
        CANCELLED_BY_DRIVER: TripStatus.CANCELED,
    };
    return map[beStatus] ?? TripStatus.OFFLINE;
}

/**
 * FE → BE: Convert trạng thái UI về trạng thái server.
 * Dùng khi: gọi API PATCH /trips/:id/status
 *
 * Chỉ map những trạng thái CÓ TƯƠNG ĐƯƠNG ở BE.
 * OFFLINE, ONLINE, BOOKING_TIMEOUT, WAITING → không gửi lên BE.
 */
export function toBackendStatus(feStatus: TripStatus): BackendTripStatus | null {
    const map: Partial<Record<TripStatus, BackendTripStatus>> = {
        [TripStatus.BOOKING_INCOMING]: 'PENDING',
        [TripStatus.ARRIVING]: 'ACCEPTED',
        [TripStatus.ARRIVED]: 'ARRIVED',
        [TripStatus.SERVING]: 'IN_PROGRESS',
        [TripStatus.FINISHED]: 'COMPLETED',
        [TripStatus.CANCELED]: 'CANCELLED_BY_DRIVER', // Driver app cancel mặc định là by driver
    };
    return map[feStatus] ?? null; // null = trạng thái chỉ FE, không gửi BE
}

/**
 * Kiểm tra trạng thái này có phải UI-only (không tồn tại ở BE) không.
 */
export function isUIOnlyStatus(status: TripStatus): boolean {
    return [
        TripStatus.OFFLINE,
        TripStatus.ONLINE,
        TripStatus.BOOKING_TIMEOUT,
        TripStatus.WAITING,
    ].includes(status);
}
