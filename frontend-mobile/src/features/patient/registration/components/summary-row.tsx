import { StyleSheet, View } from "react-native";

import { Spacing, Theme } from "@/constants/theme";
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
  summaryRow: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
    gap: Spacing.three,
  },

  // Valores longos (ex.: MAC) quebram linha em vez de sair da tela.
  value: {
    flexShrink: 1,
    textAlign: "right",
  },
});
