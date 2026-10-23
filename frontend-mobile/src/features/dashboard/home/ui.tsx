import { SymbolView } from "expo-symbols";
import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/shared/themed-text";
import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";

// Peças comuns das três abas do dashboard: card, número em destaque, barras,
// linha de paciente e o link "Ver todas".

export function Card({
  title,
  subtitle,
  tag,
  children,
}: {
  title: string;
  subtitle?: string;
  tag?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <ThemedText style={styles.cardTitle}>{title}</ThemedText>
        {tag ? (
          <View style={styles.tag}>
            <ThemedText style={styles.tagText}>{tag}</ThemedText>
          </View>
        ) : null}
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

export function Tile({
  value,
  label,
  tone = "text",
  loading = false,
  onPress,
}: {
  value: string | number;
  label: string;
  tone?: Tone;
  loading?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={`${label}: ${value}`}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        tone === "error" && styles.tileError,
        tone === "warning" && styles.tileWarning,
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={Theme.primary} style={styles.tileLoading} />
      ) : (
        <ThemedText style={styles.tileValue} themeColor={tone}>
          {value}
        </ThemedText>
      )}
      <ThemedText type="small" style={styles.tileLabel}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function TileRow({ children }: { children: ReactNode }) {
  return <View style={styles.tileRow}>{children}</View>;
}

export type BarItem = {
  label: string;
  count: number;
  color: string;
  onPress?: () => void;
};

// Barras horizontais proporcionais ao maior valor da lista.
export function Bars({ items, suffix = "" }: { items: BarItem[]; suffix?: string }) {
  const max = Math.max(...items.map((item) => item.count), 1);

  return (
    <View style={styles.bars}>
      {items.map((item) => (
        <Pressable
          key={item.label}
          accessibilityRole={item.onPress ? "button" : undefined}
          accessibilityLabel={`${item.label}: ${item.count}${suffix}`}
          disabled={!item.onPress}
          onPress={item.onPress}
          style={({ pressed }) => [styles.barItem, pressed && styles.pressed]}
        >
          <View style={styles.barLabels}>
            <ThemedText style={styles.barLabel}>{item.label}</ThemedText>
            <ThemedText style={styles.barCount}>
              {item.count}
              {suffix}
            </ThemedText>
          </View>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${(item.count / max) * 100}%`,
                  backgroundColor: item.color,
                },
              ]}
            />
          </View>
        </Pressable>
      ))}
    </View>
  );
}

// Linha "rótulo ........ valor", para contagens simples.
export function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.statRow}>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
    </View>
  );
}

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

export function SeeAll({ count, onPress }: { count: number; onPress: () => void }) {
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

export function Chips({ items }: { items: string[] }) {
  return (
    <View style={styles.chips}>
      {items.map((item) => (
        <View key={item} style={styles.chip}>
          <ThemedText type="small">{item}</ThemedText>
        </View>
      ))}
    </View>
  );
}

export const dashboardStyles = StyleSheet.create({
  tab: { gap: Spacing.three },
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
  tag: {
    borderRadius: 10,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    backgroundColor: Theme.investigationLight,
  },
  tagText: {
    color: Theme.investigationDark,
    fontFamily: FontFamilies.primaryMedium,
    fontSize: Typography.sizes.small,
    lineHeight: Typography.lineHeights.compact,
  },
  tileRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  tile: {
    flex: 1,
    minHeight: 104,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Theme.border,
    backgroundColor: Theme.backgroundElement,
    padding: Spacing.two + Spacing.one,
    gap: Spacing.one,
  },
  tileError: {
    borderColor: Theme.secondary,
    backgroundColor: Theme.backgroundAlert,
  },
  tileWarning: {
    borderColor: Theme.tertiary,
    backgroundColor: Theme.residentLight,
  },
  tileValue: {
    fontFamily: FontFamilies.detail,
    fontSize: Typography.sizes.heading + 4,
    lineHeight: Typography.lineHeights.title + 4,
  },
  tileLoading: {
    alignSelf: "flex-start",
    height: Typography.lineHeights.title + 4,
  },
  tileLabel: { fontFamily: FontFamilies.primaryMedium },
  bars: { gap: Spacing.two + Spacing.one },
  barItem: { gap: Spacing.one },
  barLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  barLabel: { flexShrink: 1 },
  barCount: { fontFamily: FontFamilies.primarySemiBold },
  barTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: Theme.inputBackground,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 5 },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 36,
    gap: Spacing.two,
  },
  statLabel: { flexShrink: 1 },
  statValue: { fontFamily: FontFamilies.primarySemiBold },
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
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  chip: {
    borderRadius: 16,
    paddingHorizontal: Spacing.two + Spacing.one,
    paddingVertical: Spacing.one + Spacing.half,
    backgroundColor: Theme.inputBackground,
  },
  pressed: { opacity: 0.7 },
});
