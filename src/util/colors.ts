export const COLORS = {
    navy: '#002654',
    navyHover: '#004080',
    navyDark: '#001B40',

    cyan: '#00B0FF',

    bgSoft: '#F3F6FA',
    textPrimary: '#0B1228',
    textOnNavy: '#E6EEF9',
    textSecondary: '#9FB3C8',
    dividerNavy: 'rgba(0, 38, 84, 0.2)',
} as const;

export type AppColorKey = keyof typeof COLORS;