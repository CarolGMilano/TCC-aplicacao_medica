import { StyleSheet, View } from "react-native";

import { FontFamilies, Spacing, Typography } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

type BadgeProps = {
  label: string;
  color: string;
  background: string;
};

// Selo arredondado do cabeçalho (grupo prioritário, status, "Cadastrada").
export function Badge({ label, color, background }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: background }]}>
      <ThemedText style={[styles.text, { color }]}>
        {label.toUpperCase()}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: 14,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },

  text: {
    fontFamily: FontFamilies.primaryMedium,
    fontSize: Typography.sizes.small,
    letterSpacing: Typography.letterSpacing.tight,
  },
});
