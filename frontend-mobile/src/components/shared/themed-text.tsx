import { StyleSheet, Text, type TextProps } from "react-native";

import {
  Colors,
  FontFamilies,
  ThemeColor,
  Typography,
} from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export type ThemedTextProps = TextProps & {
  type?:
    | "default"
    | "title"
    | "small"
    | "smallBold"
    | "subtitle"
    | "link"
    | "linkPrimary"
    | "code"
    | "button";
  themeColor?: ThemeColor;
};

export function ThemedText({
  style,
  type = "default",
  themeColor,
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? "text"] },
        type === "default" && styles.default,
        type === "title" && styles.title,
        type === "small" && styles.small,
        type === "smallBold" && styles.smallBold,
        type === "subtitle" && styles.subtitle,
        type === "link" && styles.link,
        type === "linkPrimary" && styles.linkPrimary,
        type === "code" && styles.code,
        type === "button" && styles.button,
        style,
      ]}
      {...rest}
    />
  );
}

// No Android (Expo Go/SDK 57) o peso vem do nome da família (Poppins-Medium,
// Poppins-SemiBold); fontWeight com fonte customizada é ignorado ou vira Roboto.
const styles = StyleSheet.create({
  small: {
    fontFamily: FontFamilies.primary,
    fontSize: Typography.sizes.bodySmall,
    lineHeight: Typography.lineHeights.input,
  },
  smallBold: {
    fontFamily: FontFamilies.primarySemiBold,
    fontSize: Typography.sizes.bodySmall,
    lineHeight: Typography.lineHeights.body,
  },
  default: {
    fontFamily: FontFamilies.primary,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
  },
  title: {
    fontFamily: FontFamilies.detail,
    fontSize: Typography.sizes.display,
    lineHeight: Typography.lineHeights.display,
  },
  subtitle: {
    fontFamily: FontFamilies.primary,
    fontSize: Typography.sizes.bodySmall,
    lineHeight: Typography.lineHeights.caption,
  },
  link: {
    fontSize: Typography.sizes.bodySmall,
    letterSpacing: Typography.letterSpacing.tight,
    fontFamily: FontFamilies.primaryMedium,
  },
  linkPrimary: {
    fontFamily: FontFamilies.primary,
    lineHeight: Typography.lineHeights.greeting,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.light.primary,
  },
  // Rótulos em maiúsculas: Poppins média em vez da mono fina, mais legível.
  code: {
    fontFamily: FontFamilies.primaryMedium,
    fontSize: Typography.sizes.notice,
    lineHeight: Typography.lineHeights.caption,
    letterSpacing: Typography.letterSpacing.tight,
  },
  // Texto dos botões principais: Poppins seminegrito 16.
  button: {
    fontFamily: FontFamilies.primarySemiBold,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
  },
});
