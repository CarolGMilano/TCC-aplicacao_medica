import { Pressable, StyleSheet, View } from "react-native";

import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";
import { statusColors } from "@/features/patient/record/constants";

import type { PatientListItem as PatientListItemType } from "../types";

type PatientListItemProps = {
  patient: PatientListItemType;
};

export function PatientListItem({ patient }: PatientListItemProps) {
  const colors = statusColors[patient.status];

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.identity}>
        <ThemedText style={styles.name}>{patient.name}</ThemedText>
        <ThemedText type="subtitle" themeColor="textSecondary">
          {patient.age} anos · PRT {patient.record}
        </ThemedText>
      </View>
      <View style={styles.details}>
        {colors ? (
          <View style={[styles.badge, { backgroundColor: colors.background }]}>
            <ThemedText style={[styles.badgeText, { color: colors.text }]}>
              {patient.status.toUpperCase()}
            </ThemedText>
          </View>
        ) : null}
        <ThemedText style={styles.visit}>
          última consulta em {patient.lastVisit}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 73,
    backgroundColor: Theme.backgroundElement,
    paddingHorizontal: Spacing.three,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#E2DDC5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },

  identity: {
    flex: 1,
    gap: 3,
  },

  name: {
    fontSize: Typography.sizes.bodySmall,
    lineHeight: Typography.lineHeights.body,
  },

  details: {
    alignItems: "flex-end",
    gap: 4,
  },

  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  badgeText: {
    fontFamily: FontFamilies.primaryMedium,
    fontSize: Typography.sizes.tiny,
    letterSpacing: Typography.letterSpacing.tight,
  },

  visit: {
    fontSize: Typography.sizes.small,
    lineHeight: Typography.lineHeights.compact,
  },

  pressed: { opacity: 0.7 },
});
