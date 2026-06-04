import type { EmojiItem, DriverProfile } from '../types';

export const MOOD_EMOJIS: EmojiItem[] = [
    { id: 'cool', type: 'emoji', label: 'Cool', emoji: '😎' },
    { id: 'love', type: 'emoji', label: 'Love it', emoji: '😍' },
    { id: 'happy', type: 'emoji', label: 'Happy', emoji: '😄' },
    { id: 'laughing', type: 'emoji', label: 'Laughing', emoji: '🤣' },
    { id: 'annoyed', type: 'emoji', label: 'Annoyed', emoji: '😣' },
    { id: 'neutral', type: 'emoji', label: 'Neutral', emoji: '😐' },
    { id: 'worried', type: 'emoji', label: 'Worried', emoji: '😟' },
    { id: 'dizzy', type: 'emoji', label: 'Dizzy', emoji: '😵' },
    { id: 'crying', type: 'emoji', label: 'Crying', emoji: '😢' },
    { id: 'skip', type: 'skip', label: 'No Emoji', emoji: '' },
];

export const MOCK_DRIVER: DriverProfile = {
    id: 'driver-001',
    name: 'Daniel Austin',
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    rating: 4.8,
    vehicleModel: 'Mercedes-Benz E-Class',
    licensePlate: 'HSW 4736 XK',
};
