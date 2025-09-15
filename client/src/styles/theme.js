// Theme configuration for KrishiSeva
export const lightTheme = {
  colors: {
    primary: '#2E7D32', // Deep green
    primaryLight: '#4CAF50', // Light green
    primaryDark: '#1B5E20', // Dark green
    secondary: '#8BC34A', // Light green
    accent: '#FFC107', // Amber
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#212529',
    textSecondary: '#6C757D',
    border: '#E9ECEF',
    success: '#28A745',
    warning: '#FFC107',
    error: '#DC3545',
    info: '#17A2B8',
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#F8F9FA',
      100: '#E9ECEF',
      200: '#DEE2E6',
      300: '#CED4DA',
      400: '#ADB5BD',
      500: '#6C757D',
      600: '#495057',
      700: '#343A40',
      800: '#212529',
      900: '#000000'
    }
  },
  fonts: {
    primary: '"Inter", "Noto Sans", "Noto Sans Devanagari", "Noto Sans Malayalam", sans-serif',
    hindi: '"Noto Sans Devanagari", sans-serif',
    malayalam: '"Noto Sans Malayalam", sans-serif'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  }
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#4CAF50', // Lighter green for dark mode
    primaryLight: '#66BB6A',
    primaryDark: '#2E7D32',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    gray: {
      50: '#1A1A1A',
      100: '#2D2D2D',
      200: '#404040',
      300: '#525252',
      400: '#737373',
      500: '#A3A3A3',
      600: '#D4D4D4',
      700: '#E5E5E5',
      800: '#F5F5F5',
      900: '#FFFFFF'
    }
  }
};

export const breakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1536px'
};


