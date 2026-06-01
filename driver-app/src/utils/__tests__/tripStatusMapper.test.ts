import { toFrontendStatus, toBackendStatus, isUIOnlyStatus } from '../tripStatusMapper';
import { TripStatus } from '../../types';

describe('tripStatusMapper', () => {
    describe('toFrontendStatus', () => {
        it('should map PENDING to BOOKING_INCOMING', () => {
            expect(toFrontendStatus('PENDING')).toBe(TripStatus.BOOKING_INCOMING);
        });

        it('should map ACCEPTED to ARRIVING', () => {
            expect(toFrontendStatus('ACCEPTED')).toBe(TripStatus.ARRIVING);
        });

        it('should map ARRIVED to ARRIVED', () => {
            expect(toFrontendStatus('ARRIVED')).toBe(TripStatus.ARRIVED);
        });

        it('should map IN_PROGRESS to SERVING', () => {
            expect(toFrontendStatus('IN_PROGRESS')).toBe(TripStatus.SERVING);
        });

        it('should map COMPLETED to FINISHED', () => {
            expect(toFrontendStatus('COMPLETED')).toBe(TripStatus.FINISHED);
        });

        it('should map CANCELLED_BY_CUSTOMER and CANCELLED_BY_DRIVER to CANCELED', () => {
            expect(toFrontendStatus('CANCELLED_BY_CUSTOMER')).toBe(TripStatus.CANCELED);
            expect(toFrontendStatus('CANCELLED_BY_DRIVER')).toBe(TripStatus.CANCELED);
        });

        it('should fallback to OFFLINE for unknown status', () => {
            // @ts-expect-error - testing invalid status handling
            expect(toFrontendStatus('UNKNOWN')).toBe(TripStatus.OFFLINE);
        });
    });

    describe('toBackendStatus', () => {
        it('should map BOOKING_INCOMING to PENDING', () => {
            expect(toBackendStatus(TripStatus.BOOKING_INCOMING)).toBe('PENDING');
        });

        it('should map ARRIVING to ACCEPTED', () => {
            expect(toBackendStatus(TripStatus.ARRIVING)).toBe('ACCEPTED');
        });

        it('should map ARRIVED to ARRIVED', () => {
            expect(toBackendStatus(TripStatus.ARRIVED)).toBe('ARRIVED');
        });

        it('should map SERVING to IN_PROGRESS', () => {
            expect(toBackendStatus(TripStatus.SERVING)).toBe('IN_PROGRESS');
        });

        it('should map FINISHED to COMPLETED', () => {
            expect(toBackendStatus(TripStatus.FINISHED)).toBe('COMPLETED');
        });

        it('should map CANCELED to CANCELLED_BY_DRIVER', () => {
            expect(toBackendStatus(TripStatus.CANCELED)).toBe('CANCELLED_BY_DRIVER');
        });

        it('should return null for UI-only statuses', () => {
            expect(toBackendStatus(TripStatus.ONLINE)).toBeNull();
            expect(toBackendStatus(TripStatus.OFFLINE)).toBeNull();
            expect(toBackendStatus(TripStatus.BOOKING_TIMEOUT)).toBeNull();
            expect(toBackendStatus(TripStatus.WAITING)).toBeNull();
        });
    });

    describe('isUIOnlyStatus', () => {
        it('should return true for OFFLINE, ONLINE, BOOKING_TIMEOUT, WAITING', () => {
            expect(isUIOnlyStatus(TripStatus.OFFLINE)).toBe(true);
            expect(isUIOnlyStatus(TripStatus.ONLINE)).toBe(true);
            expect(isUIOnlyStatus(TripStatus.BOOKING_TIMEOUT)).toBe(true);
            expect(isUIOnlyStatus(TripStatus.WAITING)).toBe(true);
        });

        it('should return false for other statuses', () => {
            expect(isUIOnlyStatus(TripStatus.BOOKING_INCOMING)).toBe(false);
            expect(isUIOnlyStatus(TripStatus.ARRIVING)).toBe(false);
            expect(isUIOnlyStatus(TripStatus.ARRIVED)).toBe(false);
            expect(isUIOnlyStatus(TripStatus.SERVING)).toBe(false);
            expect(isUIOnlyStatus(TripStatus.FINISHED)).toBe(false);
            expect(isUIOnlyStatus(TripStatus.CANCELED)).toBe(false);
        });
    });
});
