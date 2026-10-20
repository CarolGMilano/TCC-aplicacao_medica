import { SymbolView } from "expo-symbols";
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from "react-native";

import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

const icons = {
  back: { ios: "arrow.left", android: "arrow_back", web: "arrow_back" },
  close: { ios: "xmark", android: "close", web: "close" },
  logout: {
    ios: "rectangle.portrait.and.arrow.right",
    android: "logout",
    web: "logout",
  },
} as const;

type PillButtonProps = {
  label: string;
  onPress: () => void;
  // back (←, padrão) para voltar, close (×) para cancelar, logout para sair;
  // null para só o texto.
  icon?: keyof typeof icons | null;
  accessibilityLabel?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

// Ações de navegação dos cabeçalhos (voltar, cancelar, sair): pílula com
// fundo suave, texto 15 e área de toque de 44px, fácil de achar e de tocar.
export function PillButton({
  label,
  onPress,
  icon = "back",
  accessibilityLabel,
  disabled,
  style,
}: PillButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        !icon && styles.textOnly,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon ? (
        <SymbolView name={icons[icon]} tintColor={Theme.text} size={20} />
      ) : null}
      <ThemedText style={styles.label}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minHeight: 44,
    paddingLeft: Spacing.two + Spacing.one,
    paddingRight: Spacing.three,
    borderRadius: 22,
    backgroundColor: Theme.inputBackground,
  },

  textOnly: { paddingLeft: Spacing.three },

  pressed: { opacity: 0.7 },

  disabled: { opacity: 0.6 },

  label: {
    color: Theme.text,
    fontFamily: FontFamilies.primaryMedium,
    fontSize: Typography.sizes.action,
    lineHeight: Typography.lineHeights.input,
  },
});
