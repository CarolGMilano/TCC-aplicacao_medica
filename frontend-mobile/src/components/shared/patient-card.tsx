import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

type PatientCardProps = {
  name: string;
  record: string;
  // Linha extra opcional (ex.: médico responsável de um registro novo).
  detail?: string | null;
  style?: StyleProp<ViewStyle>;
};

// De quem é a tela: nome legível e prontuário, num cartão de fundo suave.
export function PatientCard({ name, record, detail, style }: PatientCardProps) {
  return (
    <View style={[styles.card, style]}>
      <ThemedText style={styles.name}>{name}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Prontuário {record}
      </ThemedText>
      {detail ? (
        <ThemedText type="small" themeColor="textSecondary">
          {detail}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + Spacing.one,
    gap: Spacing.half,
    borderRadius: 12,
    backgroundColor: Theme.inputBackground,
  },

  name: {
    fontFamily: FontFamilies.primaryMedium,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
  },
});
