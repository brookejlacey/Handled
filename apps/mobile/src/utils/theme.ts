export const COLORS = {
  // Brand colors
  primary: '#2E6417',         // Handled forest green
  primaryDark: '#234F12',     // Darker green for pressed states
  primaryLight: '#4A8A2D',    // Lighter green for highlights

  // Cream accent
  cream: '#FAF9F6',
  creamDark: '#F5F4F1',

  // Dark mode surfaces
  dark: {
    bg: '#1A1A1A',
    bgSecondary: '#242424',
    bgTertiary: '#2D2D2D',
    surface: '#333333',
    surfaceLight: '#404040',
  },

  // Status colors
  success: '#2E6417',         // Use brand green for success
  warning: '#D4A84B',         // Warm gold, not harsh yellow
  error: '#C45C4A',           // Warm red, not alarming
  info: '#5B8A72',            // Muted sage

  // Light mode backgrounds
  background: '#FAF9F6',      // Warm cream (brand background)
  backgroundSecondary: '#F5F4F1',  // Slightly darker cream
  surface: '#FFFFFF',         // Pure white for cards

  // Text - Light mode
  text: '#2D2D2D',            // Soft black
  textSecondary: '#6B6B6B',   // Medium gray
  textTertiary: '#9B9B9B',    // Light gray
  textInverse: '#FAF9F6',     // Cream for dark backgrounds

  // Text - Dark mode
  textDark: '#FAF9F6',        // Cream text on dark
  textDarkSecondary: 'rgba(250, 249, 246, 0.7)',
  textDarkTertiary: 'rgba(250, 249, 246, 0.5)',

  // Borders
  border: '#E8E6E1',          // Warm gray border
  borderLight: '#F0EEE9',     // Lighter warm border
  borderDark: 'rgba(255, 255, 255, 0.1)', // For dark mode

  // Overlay
  overlay: 'rgba(45, 45, 45, 0.5)',
  overlayDark: 'rgba(0, 0, 0, 0.5)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  hero: 40,
};

export const FONT_WEIGHTS = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const SHADOWS = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  glow: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
};
