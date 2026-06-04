export enum TripStatus {
    OFFLINE = 'OFFLINE',
    ONLINE = 'ONLINE',
    BOOKING_INCOMING = 'BOOKING_INCOMING',
    BOOKING_TIMEOUT = 'BOOKING_TIMEOUT',
    ARRIVING = 'ARRIVING',
    ARRIVED = 'ARRIVED',
    WAITING = 'WAITING',
    SERVING = 'SERVING',
    FINISHED = 'FINISHED',
    CANCELED = 'CANCELED',
}

export interface DriverProfile {
    id: string;
    name: string;
    phone: string;
    avatarUrl: string;
    rating: number;
    vehiclePlate: string;
    licenseNumber?: string;
    vehicleId?: string;
    brand?: string;
    model?: string;
    color?: string;
}

export interface Customer {
    id: string;
    name: string;
    phone: string;
    avatarUrl: string;
    rating: number;
}

export interface LocationPoint {
    address: string;
    latitude: number;
    longitude: number;
}

export interface TripData {
    id: string;
    customer: Customer;
    pickup: LocationPoint;
    dropoff: LocationPoint;
    fare?: number;
    status: TripStatus;
    createdAt: string;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    text?: string;
    imageUrl?: string;
    timestamp: string;
    isDriver: boolean;
}
