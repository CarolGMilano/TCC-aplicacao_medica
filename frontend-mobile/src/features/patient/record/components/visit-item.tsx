import { StyleSheet, View } from "react-native";

import { Spacing, Theme } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

import type { Visit } from "../types";
import { Badge } from "./badge";

type VisitItemProps = {
  visit: Visit;
};

// Linha da lista de atendimentos: barra lateral, resultado, observação,
// selos e "data · médico". Destaque em coral quando pede atenção.
export function VisitItem({ visit }: VisitItemProps) {
  const tagColors = visit.highlight
    ? { color: Theme.administratorDark, background: Theme.administratorLight }
    : { color: Theme.textSecondary, background: Theme.backgroundSelected };

  return (
    <View style={[styles.item, visit.highlight && styles.highlight]}>
      <View style={[styles.bar, visit.highlight && styles.barHighlight]} />

      <View style={styles.content}>
        <ThemedText type="small" numberOfLines={2}>
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
              <Badge key={tag} label={tag} {...tagColors} />
            ))}
          </View>
        ) : null}

        <ThemedText type="code" themeColor="textSecondary">
          {visit.date} · {visit.doctor.toUpperCase()}
        </ThemedText>
      </View>
    </View>
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
    backgroundColor: "rgba(231, 152, 151, 0.13)",
  },

  bar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: Theme.tertiary,
  },

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
