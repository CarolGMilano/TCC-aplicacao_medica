import { View, type ViewProps } from "react-native";

import { ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor;
  borderColor?: ThemeColor;
  borderTopColor?: ThemeColor;
};

export function ThemedView({
  lightColor,
  darkColor,
  type,
  borderColor,
  borderTopColor,
  style,
  ...otherProps
}: ThemedViewProps) {
  const theme = useTheme();

  return (
    <View
      {...otherProps}
      style={[
        { backgroundColor: theme[type ?? "background"] },
        borderColor && { borderColor: theme[borderColor] },
        borderTopColor && { borderTopColor: theme[borderTopColor] },
        style,
      ]}
    />
  );
}
