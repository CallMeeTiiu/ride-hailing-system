export const colors = {
    primary: '#F5A623',
    primaryDark: '#E09500',
    primaryLight: '#FFF3D6',
    background: '#FFFFFF',
    surface: '#F9F9F9',
    textPrimary: '#1A1A1A',
    textSecondary: '#8E8E93',
    textTertiary: '#BDBDBD',
    border: '#E0E0E0',
    success: '#4CAF50',
    error: '#F44336',
    white: '#FFFFFF',
    overlay: 'rgba(0,0,0,0.5)',
} as const;

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
} as const;

export const radius = {
    sm: 8,
    md: 12,
    lg: 16,
    full: 999,
} as const;

export const typography = {
    h1: { fontSize: 28, fontWeight: '700' as const },
    h2: { fontSize: 22, fontWeight: '600' as const },
    h3: { fontSize: 18, fontWeight: '600' as const },
    body: { fontSize: 16, fontWeight: '400' as const },
    caption: { fontSize: 14, fontWeight: '400' as const },
    small: { fontSize: 12, fontWeight: '500' as const },
    emoji: { fontSize: 48 },
} as const;

export const sizing = {
    avatarSm: 40,
    avatarMd: 56,
    avatarLg: 80,
    iconSize: 24,
    touchTarget: 48,
} as const;
