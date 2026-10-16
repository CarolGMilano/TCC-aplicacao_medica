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
    | "code";
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
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontFamily: FontFamilies.primary,
    fontSize: Typography.sizes.bodySmall,
    lineHeight: Typography.lineHeights.body,
    fontWeight: Typography.weights.medium,
  },
  smallBold: {
    fontFamily: FontFamilies.primary,
    fontSize: Typography.sizes.bodySmall,
    lineHeight: Typography.lineHeights.body,
    fontWeight: Typography.weights.bold,
  },
  default: {
    fontFamily: FontFamilies.primary,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
    fontWeight: Typography.weights.medium,
  },
  title: {
    fontFamily: FontFamilies.detail,
    fontSize: Typography.sizes.display,
    fontWeight: Typography.weights.semibold,
    lineHeight: Typography.lineHeights.display,
  },
  subtitle: {
    fontSize: Typography.sizes.label,
    letterSpacing: Typography.letterSpacing.tight,
    fontFamily: FontFamilies.secondary,
  },
  link: {
    fontSize: Typography.sizes.bodySmall,
    letterSpacing: Typography.letterSpacing.tight,
    fontFamily: FontFamilies.secondary,
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
    letterSpacing: Typography.letterSpacing.tight,
  },
});
