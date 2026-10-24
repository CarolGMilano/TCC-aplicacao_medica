import { SymbolView } from "expo-symbols";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/shared/themed-text";
import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";

// Peças do dashboard: card, linha de paciente e o link "Ver todas".

export function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <ThemedText style={styles.cardTitle}>{title}</ThemedText>
      </View>
      {subtitle ? (
        <ThemedText type="small" themeColor="textSecondary">
          {subtitle}
        </ThemedText>
      ) : null}
      {children}
    </View>
  );
}

type Tone = "error" | "warning" | "text";

export function PatientRow({
  name,
  detail,
  days,
  tone,
  onPress,
}: {
  name: string;
  detail: string;
  days: string;
  tone: Tone;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={`Abrir ficha de ${name}`}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.patientRow, pressed && styles.pressed]}
    >
      <View style={styles.identity}>
        <ThemedText style={styles.name}>{name}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {detail}
        </ThemedText>
      </View>
      <ThemedText themeColor={tone} style={styles.days}>
        {days}
      </ThemedText>
      <SymbolView
        name={{
          ios: "chevron.right",
          android: "chevron_right",
          web: "chevron_right",
        }}
        tintColor={Theme.textSecondary}
        size={16}
      />
    </Pressable>
  );
}

export function SeeAll({
  count,
  onPress,
}: {
  count: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.seeAll, pressed && styles.pressed]}
    >
      <ThemedText style={styles.seeAllText}>Ver todas ({count})</ThemedText>
    </Pressable>
  );
}

export const dashboardStyles = StyleSheet.create({
  tab: { gap: Spacing.three },
  bigValue: {
    fontFamily: FontFamilies.detail,
    fontSize: Typography.sizes.metric,
    lineHeight: Typography.lineHeights.metric,
  },
  message: { paddingVertical: Spacing.two },
});

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: 14,
    backgroundColor: Theme.backgroundElement,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  cardTitle: {
    flexShrink: 1,
    fontFamily: FontFamilies.primarySemiBold,
  },
  patientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minHeight: 56,
    borderTopWidth: 1,
    borderTopColor: Theme.border,
    paddingTop: Spacing.two,
  },
  identity: { flex: 1 },
  name: { fontFamily: FontFamilies.primaryMedium },
  days: {
    fontFamily: FontFamilies.primarySemiBold,
    fontSize: Typography.sizes.action,
  },
  seeAll: {
    minHeight: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.inputBackground,
    marginTop: Spacing.one,
  },
  seeAllText: {
    color: Theme.primary,
    fontFamily: FontFamilies.primarySemiBold,
    fontSize: Typography.sizes.action,
  },
  pressed: { opacity: 0.7 },
});
