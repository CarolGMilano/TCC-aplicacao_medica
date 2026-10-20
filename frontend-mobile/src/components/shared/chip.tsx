import { StyleSheet, View } from "react-native";

import { FontFamilies, Spacing, Typography } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

type ChipProps = {
  label: string;
  color: string;
  background: string;
  // Estado da tela ("Editando", "Cadastrada"): maior, para ser lido de longe.
  large?: boolean;
};

// Selo arredondado (status, grupo prioritário, tipo do registro). Texto em
// caixa normal, 13-14, para ler sem esforço.
export function Chip({ label, color, background, large }: ChipProps) {
  return (
    <View
      style={[
        styles.chip,
        large && styles.chipLarge,
        { backgroundColor: background },
      ]}
    >
      <ThemedText style={[styles.text, large && styles.textLarge, { color }]}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: "flex-start",
    borderRadius: 14,
    paddingHorizontal: Spacing.two + Spacing.half,
    paddingVertical: Spacing.one,
  },

  chipLarge: {
    borderRadius: 16,
    paddingHorizontal: Spacing.three - Spacing.one,
    paddingVertical: Spacing.one + Spacing.half,
  },

  text: {
    fontFamily: FontFamilies.primaryMedium,
    fontSize: Typography.sizes.notice,
    lineHeight: Typography.lineHeights.caption,
  },

  textLarge: {
    fontSize: Typography.sizes.bodySmall,
  },
});
