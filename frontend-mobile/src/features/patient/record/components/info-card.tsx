import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

type InfoCardProps = {
  title: string;
  // Sem onEdit, o card só mostra os dados.
  onEdit?: () => void;
  editLabel?: string;
  children: ReactNode;
};

// Bloco do histórico clínico: título, "Editar" do próprio bloco e os dados
// numa grade de duas colunas.
export function InfoCard({
  title,
  onEdit,
  editLabel = "Editar",
  children,
}: InfoCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        {onEdit ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${editLabel}: ${title}`}
            onPress={onEdit}
            hitSlop={8}
            style={({ pressed }) => [styles.edit, pressed && styles.pressed]}
          >
            <ThemedText type="code" style={styles.editLabel}>
              {editLabel}
            </ThemedText>
          </Pressable>
        ) : null}
      </View>
      <View style={styles.grid}>{children}</View>
    </View>
  );
}

type InfoFieldProps = {
  label: string;
  value: string;
  // Texto longo (nome, método contraceptivo): ocupa a linha toda.
  full?: boolean;
  // Dado que o médico precisa ver de relance (ex.: carga tabágica).
  highlight?: boolean;
};

export function InfoField({ label, value, full, highlight }: InfoFieldProps) {
  return (
    <View
      style={[
        styles.field,
        full && styles.fieldFull,
        highlight && styles.fieldHighlight,
      ]}
    >
      <ThemedText type="code" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText style={[styles.value, highlight && styles.valueHighlight]}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.three,
    marginTop: Spacing.three,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Theme.inputBorder,
    backgroundColor: Theme.backgroundElement,
    overflow: "hidden",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },

  title: {
    flexShrink: 1,
    fontFamily: FontFamilies.primarySemiBold,
    fontSize: Typography.sizes.section,
    lineHeight: Typography.lineHeights.body,
  },

  edit: {
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: Spacing.three,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Theme.border,
  },

  editLabel: {
    fontFamily: FontFamilies.primaryMedium,
  },

  pressed: { backgroundColor: Theme.backgroundSelected },

  // Duas colunas de mesma largura; "full" ocupa as duas.
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: Spacing.three - Spacing.two,
    paddingBottom: Spacing.three,
  },

  field: {
    width: "50%",
    gap: Spacing.half,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },

  fieldFull: { width: "100%" },

  fieldHighlight: {
    borderRadius: 10,
    backgroundColor: Theme.backgroundAlert,
  },

  value: {
    fontFamily: FontFamilies.primaryMedium,
    fontSize: Typography.sizes.value,
    lineHeight: Typography.lineHeights.body,
  },

  valueHighlight: {
    fontFamily: FontFamilies.primarySemiBold,
    fontSize: Typography.sizes.section,
  },
});
