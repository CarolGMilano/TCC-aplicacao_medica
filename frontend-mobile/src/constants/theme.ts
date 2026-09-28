/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#10212a',
    background: '#f8f7f6',
    backgroundElement: '#ffffff',
    backgroundSelected: '#f1f0ec',
    textSecondary: '#24323a',
    primary: '#7e9984',
    accent: '#7e9984',
    border: '#d7c58d',
    muted: '#64736c',
    warning: '#f0bd7b',
    alert: '#c8484b',
  },
  dark: {
    text: '#ffffff',
    background: '#17221f',
    backgroundElement: '#22302b',
    backgroundSelected: '#304239',
    textSecondary: '#d6ddd5',
    primary: '#a9c3a7',
    accent: '#a9c3a7',
    border: '#88794e',
    muted: '#a9b8aa',
    warning: '#e5b875',
    alert: '#f07e7f',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 78, android: 88 }) ?? 0;
export const MaxContentWidth = 800;
