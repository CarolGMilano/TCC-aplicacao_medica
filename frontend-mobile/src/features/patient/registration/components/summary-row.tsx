import { StyleSheet, View } from "react-native";

import { FontFamilies, Spacing, Typography } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

type SummaryRowProps = {
  label: string;
  value: string;
};

export function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <View style={styles.summaryRow}>
      <ThemedText type="code" themeColor="textSecondary" style={styles.label}>
        {label}
      </ThemedText>

      <ThemedText style={styles.value}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  // Rótulo em cima, valor embaixo: cabe em colunas (FieldRow).
  summaryRow: {
    gap: Spacing.one,
  },

  label: { fontSize: Typography.sizes.bodySmall },

  // Dado salvo em destaque (17, médio), mais fácil de ler que o rótulo.
  value: {
    flexShrink: 1,
    fontFamily: FontFamilies.primaryMedium,
    fontSize: Typography.sizes.value,
    lineHeight: Typography.lineHeights.body,
  },
});
