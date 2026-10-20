import { StyleSheet, View } from "react-native";

import { Spacing, Typography } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

type SummaryRowProps = {
  label: string;
  value: string;
};

export function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <View style={styles.summaryRow}>
      <ThemedText type="code" themeColor="textSecondary">
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

  value: {
    flexShrink: 1,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
  },
});
