import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { FontFamilies, Spacing, Theme } from "@/constants/theme";
import { Chip } from "@/components/shared/chip";
import { ThemedText } from "@/components/shared/themed-text";
import { statusColors } from "@/features/patient/record/constants";

import type { PatientListItem as PatientListItemType } from "../types";

type PatientListItemProps = {
  patient: PatientListItemType;
};

// Cartão da paciente: nome e idade/prontuário à esquerda; à direita o status
// numa linha só e a última consulta. O nome encolhe antes do selo.
export function PatientListItem({ patient }: PatientListItemProps) {
  const colors = statusColors[patient.status];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir ficha de ${patient.name}`}
      onPress={() =>
        router.push({
          pathname: "/patients/[id]",
          params: { id: String(patient.id) },
        })
      }
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.identity}>
        <ThemedText style={styles.name} numberOfLines={2}>
          {patient.name}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {patient.age} anos · PRT {patient.record}
        </ThemedText>
      </View>
      <View style={styles.details}>
        {colors ? (
          <Chip
            label={patient.status}
            color={colors.text}
            background={colors.background}
          />
        ) : null}
        <ThemedText type="small" themeColor="textSecondary" style={styles.date}>
          {patient.lastVisit
            ? `Última consulta em ${patient.lastVisit}`
            : "Sem consultas"}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.three,
    marginBottom: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three - Spacing.one,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Theme.inputBorder,
    backgroundColor: Theme.backgroundElement,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },

  identity: {
    flex: 1,
    gap: Spacing.half,
  },

  name: {
    fontFamily: FontFamilies.primaryMedium,
  },

  details: {
    flexShrink: 0,
    alignItems: "flex-end",
    gap: Spacing.one + Spacing.half,
  },

  date: { textAlign: "right" },

  pressed: { opacity: 0.7 },
});
