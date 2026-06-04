export type EmojiType = 'emoji' | 'skip';

export interface EmojiItem {
    id: string;
    type: EmojiType;
    label: string;
    emoji: string;
}

export interface DriverProfile {
    id: string;
    name: string;
    avatarUrl: string;
    rating: number;
    vehicleModel: string;
    licensePlate: string;
}

export interface DriverInfoCardProps {
    avatarUrl: string;
    name: string;
    vehicleModel: string;
    licensePlate: string;
    rating: number;
}

export type RatingStep = 'mood' | 'star' | 'completed';
