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
  placeholder: '#5F6B61',

  /*Cores de fundo*/
  background: '#F2F0EF',
  backgroundElement: '#FFFFFF',
  backgroundPrimary: '#F2F0EF',
  backgroundSecondary: '#FFFFFF',
  backgroundSelected: '#F7F6F1',
  cardDetail: '#F7F6F1',
  // Faixa "Última edição / Médico responsável" dos novos registros.
  backgroundMeta: '#E9E6DF',
  // Fundo das linhas que pedem atenção (secondary com transparência).
  backgroundAlert: 'rgba(231, 152, 151, 0.13)',
  tableRowHover: '#f7f6f16e',
  // Campos de digitação e seleção: preenchimento suave, um pouco mais escuro
  // que o fundo, com contorno quase invisível (verde ao focar).
  inputBackground: '#E9E6DF',
  inputBorder: 'rgba(198, 192, 156, 0.35)',

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

// Uma família só, a Atkinson Hyperlegible Next: feita para legibilidade, com
// 1/l/I e 0/O inconfundíveis. A hierarquia vem do peso, não de outra fonte.
// "detail" (títulos e números de destaque) usa o seminegrito.
export const FontFamilies = {
  primary: 'Atkinson',
  primaryMedium: 'Atkinson-Medium',
  primarySemiBold: 'Atkinson-SemiBold',
  detail: 'Atkinson-SemiBold',
} as const;

// Escala de 6 tamanhos usada no app inteiro:
// 13 apoio (selos) · 15 rótulos e abas · 17 valores e texto · 20 seções ·
// 26 títulos e nome da paciente · 40 números do dashboard.
export const Typography = {
  sizes: {
    small: 13,
    notice: 15,
    bodySmall: 15,
    action: 15,
    input: 17,
    value: 17,
    section: 20,
    body: 17,
    greeting: 26,
    heading: 26,
    subtitle: 26,
    title: 26,
    logo: 42,
    metric: 40,
    display: 40,
  },
  lineHeights: {
    compact: 18,
    caption: 21,
    input: 24,
    body: 24,
    greeting: 32,
    title: 32,
    logo: 44,
    metric: 46,
    display: 46,
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
