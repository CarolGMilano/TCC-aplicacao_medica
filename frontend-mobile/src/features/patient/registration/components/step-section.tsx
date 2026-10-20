import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

type StepSectionProps = {
  title: string;
  children: ReactNode;
};

export function StepSection({ title, children }: StepSectionProps) {
  return (
    <View>
      <View style={styles.sectionTitle}>
        <ThemedText type="code" style={styles.titleText}>
          {title}
        </ThemedText>
      </View>

      <FormFields>{children}</FormFields>
    </View>
  );
}

// Campos de um grupo: empilhados com espaço entre eles, sem linha por campo
// (as linhas ficam só entre as seções).
export function FormFields({ children }: { children: ReactNode }) {
  return <View style={styles.fields}>{children}</View>;
}

const styles = StyleSheet.create({
  // Título da seção como cabeçalho: espaço acima e linha verde abaixo,
  // para separar os grupos sem criar uma faixa de fundo.
  sectionTitle: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
    borderBottomWidth: 2,
    borderBottomColor: Theme.primary,
  },

  fields: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    gap: Spacing.three + Spacing.one,
  },

  titleText: {
    color: Theme.text,
    // Maior que os dados (17) para marcar bem o início de cada seção.
    fontFamily: FontFamilies.primarySemiBold,
    fontSize: Typography.sizes.section,
    lineHeight: Typography.lineHeights.body,
  },
});
