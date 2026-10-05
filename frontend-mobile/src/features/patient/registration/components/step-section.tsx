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

      {children}
    </View>
  );
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

  titleText: {
    color: Theme.text,
    fontFamily: FontFamilies.primarySemiBold,
    fontSize: Typography.sizes.bodySmall,
  },
});
