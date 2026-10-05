import { Platform } from 'react-native';

const palette = {

  /*Identidade visual*/
  primary: '#768E78',
  primaryHoverDark: '#657B67',
  primaryHoverLight: '#7D9580',

  secondary: '#E79897',
  tertiary: '#FCC88A',

  /*Cores de texto*/
  text: '#26301F',
  textSecondaryDark: '#3F4D42',
  textPrimaryLight: '#FFFFFF',
  textSecondaryLight: '#F3EAD6',

  /*Cores de fundo*/
  background: '#F2F0EF',
  backgroundElement: '#FFFFFF',
  backgroundPrimary: '#F2F0EF',
  backgroundSecondary: '#FFFFFF',
  backgroundSelected: '#F7F6F1',
  cardDetail: '#F7F6F1',
  tableRowHover: '#f7f6f16e',

  textSecondary: '#3F4D42',
  accent: '#768E78',
  border: '#C6C09C',
  muted: '#3F4D42',

  /*Tipos de usuário*/
  doctorDark: '#2F5D63',
  doctorLight: '#D9E5E6',
  residentDark: '#8A5F1C',
  residentLight: '#FCE8C6',
  administratorDark: '#8F3F44',
  administratorLight: '#F6D7D6',

  /*Status do paciente*/
  dischargeDark: '#5E4A72',
  dischargeLight: '#E8E0EE',
  investigationDark: '#8A5F1C',
  investigationLight: '#FCE8C6',
  treatmentDark: '#9C4243',
  treatmentLight: '#F7DCDB',
  waitingDark: '#8A5A3A',
  waitingLight: '#FBE0CC',
  postProcedureDark: '#2F5D63',
  postProcedureLight: '#D9E5E6',
  followUpDark: '#56603D',
  followUpLight: '#EAEBD6',

  /*Ações*/
  deleteButtonHover: '#8a3b3c',
  deleteButton: '#A8494A',
  deleteIcon: '#A8494BA2',
  deleteBorder: '#DFAFAF',
  editIcon: '#3F4F4291',
  editBorder: '#C6C09C',

  /*Alertas*/  
  warning: '#c28a00',
  error: '#A8494A',
} as const;

export const Colors = {
  light: palette,
  dark: palette,
} as const;

export const Theme = Colors.light;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const FontFamilies = {
  primary: 'Poppins',
  primaryMedium: 'Poppins-Medium',
  primarySemiBold: 'Poppins-SemiBold',
  secondary: 'JetBrains Mono',
  detail: 'PT Serif',
} as const;

export const Typography = {
  sizes: {
    tiny: 8,
    micro: 9,
    label: 10,
    caption: 11,
    small: 12,
    notice: 13,
    bodySmall: 14,
    input: 15,
    body: 16,
    greeting: 25,
    heading: 30,
    subtitle: 32,
    title: 36,
    logo: 42,
    metric: 43,
    display: 48,
  },
  lineHeights: {
    compact: 17,
    caption: 19,
    input: 22,
    body: 24,
    greeting: 30,
    title: 42,
    logo: 44,
    metric: 48,
    display: 52,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  letterSpacing: {
    tight: 0.5,
    normal: 1,
    label: 1.2,
    wide: 1.3,
    expanded: 1.5,
    hero: 1.7,
  },
} as const;

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
