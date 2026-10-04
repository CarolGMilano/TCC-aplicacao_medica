import { StyleSheet, View } from "react-native";

import { Spacing } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

type EmptyStateProps = {
  title: string;
  note?: string;
};

export function EmptyState({ title, note }: EmptyStateProps) {
  return (
    <View style={styles.empty}>
      <ThemedText>{title}</ThemedText>
      {note ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.note}>
          {note}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
  },

  note: {
    textAlign: "center",
  },
});
