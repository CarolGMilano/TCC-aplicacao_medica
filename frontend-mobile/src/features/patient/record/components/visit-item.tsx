import { Pressable, StyleSheet, View } from "react-native";

import { Spacing, Theme } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

import type { Visit } from "../types";
import { Chip } from "@/components/shared/chip";

type VisitItemProps = {
  visit: Visit;
  onPress: () => void;
};

// Linha da lista de atendimentos: barra lateral, resultado, observação,
// selos e "data · médico". Destaque em coral quando pede atenção. O toque
// abre o registro salvo.
export function VisitItem({ visit, onPress }: VisitItemProps) {
  const tagColors = visit.highlight
    ? { color: Theme.administratorDark, background: Theme.administratorLight }
    : { color: Theme.textSecondary, background: Theme.backgroundSelected };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint="Abre o registro"
      onPress={onPress}
      style={({ pressed }) => [
        styles.item,
        visit.highlight && styles.highlight,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.bar, visit.highlight && styles.barHighlight]} />

      <View style={styles.content}>
        {/* Na consulta, o título é a observação (sem detalhe): vai inteira. */}
        <ThemedText numberOfLines={visit.detail ? 2 : undefined}>
          {visit.title}
        </ThemedText>

        {visit.detail ? (
          <ThemedText type="small" themeColor="textSecondary">
            {visit.detail}
          </ThemedText>
        ) : null}

        {visit.tags.length > 0 ? (
          <View style={styles.tags}>
            {visit.tags.map((tag) => (
              <Chip key={tag} label={tag} {...tagColors} />
            ))}
          </View>
        ) : null}

        <ThemedText type="small" themeColor="textSecondary">
          {visit.date} · {visit.doctor}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderTopWidth: 1,
    borderTopColor: Theme.border,
    backgroundColor: Theme.backgroundElement,
  },

  highlight: {
    backgroundColor: Theme.backgroundAlert,
  },

  bar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: Theme.tertiary,
  },

  pressed: { opacity: 0.7 },

  barHighlight: {
    backgroundColor: Theme.secondary,
  },

  content: {
    flex: 1,
    gap: Spacing.one,
  },

  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.one,
  },
});
