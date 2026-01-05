import { MD3LightTheme } from 'react-native-paper';

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#52796f',
    primaryContainer: '#CCE3DE',
    secondary: '#CCE3DE',
    secondaryContainer: '#E8F3F0',
    background: '#FAFBFB',
    surface: '#FFFFFF',
    surfaceVariant: '#E8F3F0',
    error: '#d14d3a',
    errorContainer: '#fef0ee',
    onPrimary: '#FFFFFF',
    onSecondary: '#1a2927',
    onBackground: '#1a2927',
    onSurface: '#1a2927',
    onSurfaceVariant: '#5A6C6A',
    outline: '#BCD3CB',
    outlineVariant: '#DEE9E5',
  },
  roundness: 12,
};

export const statusColors = {
  healthy: {
    background: '#E8F3F0',
    gradientStart: '#E8F3F0',
    gradientEnd: '#deeae7',
    border: '#d1e4df',
    text: '#364f49',
    icon: 'check-circle',
  },
  'due-soon': {
    background: '#fff8e6',
    gradientStart: '#fff8e6',
    gradientEnd: '#fef5dc',
    border: '#f9edc9',
    text: '#a86a0d',
    icon: 'alert',
  },
  overdue: {
    background: '#fef0ee',
    gradientStart: '#fef0ee',
    gradientEnd: '#fce8e6',
    border: '#f8dbd8',
    text: '#a83d2e',
    icon: 'alert-circle',
  },
};

export const buttonStyles = {
  borderRadius: 8,
};
