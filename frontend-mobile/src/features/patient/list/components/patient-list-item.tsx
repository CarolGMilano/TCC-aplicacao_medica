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

// Cartão da paciente em duas linhas fixas: nome e status; idade/prontuário e
// última consulta. O selo fica sempre à direita, no topo; o nome quebra antes
// de empurrá-lo.
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
      <View style={styles.line}>
        <ThemedText style={styles.name} numberOfLines={2}>
          {patient.name}
        </ThemedText>
        {colors ? (
          <View style={styles.status}>
            <Chip
              label={patient.status}
              color={colors.text}
              background={colors.background}
            />
          </View>
        ) : null}
      </View>
      <View style={styles.line}>
        <ThemedText type="small" themeColor="textSecondary">
          {patient.age} anos · PRT {patient.record}
        </ThemedText>
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
    gap: Spacing.one + Spacing.half,
  },

  line: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.two,
  },

  name: {
    flex: 1,
    fontFamily: FontFamilies.primaryMedium,
  },

  // O Chip se alinha ao início por padrão; aqui ele fica preso à direita.
  status: {
    flexShrink: 0,
    alignItems: "flex-end",
  },

  date: { flexShrink: 1, textAlign: "right" },

  pressed: { opacity: 0.7 },
});
