export const COLORS = {
    primary: '#F5A623',       // Amber/Golden Yellow
    primaryDark: '#E09500',   // Darker Amber for active/pressed
    primaryLight: '#FFF3D6',  // Warm beige/halo color
    background: '#FFFFFF',
    surface: '#F9F9F9',
    mapTint: '#F5E6C8',
    textPrimary: '#1A1A1A',
    textSecondary: '#8E8E93',
    textTertiary: '#BDBDBD',
    success: '#4CAF50',
    error: '#F44336',
    white: '#FFFFFF',
    overlay: 'rgba(0,0,0,0.5)',
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

export const RADIUS = {
    sm: 8,
    md: 12,
    lg: 16,
    full: 999,
};

export const TYPOGRAPHY = {
    h1: {
        fontSize: 28,
        fontWeight: '700' as const,
    },
    h2: {
        fontSize: 22,
        fontWeight: '600' as const,
    },
    h3: {
        fontSize: 18,
        fontWeight: '600' as const,
    },
    body: {
        fontSize: 16,
        fontWeight: '400' as const,
    },
    caption: {
        fontSize: 14,
        fontWeight: '400' as const,
    },
    small: {
        fontSize: 12,
        fontWeight: '500' as const,
    },
};
