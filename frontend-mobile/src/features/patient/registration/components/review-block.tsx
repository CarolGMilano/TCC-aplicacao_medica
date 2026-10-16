import { Pressable, StyleSheet, View } from "react-native";

import { Spacing, Theme } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

type ReviewBlockProps = {
  title: string;
  value: string;
  detail?: string;
  onEdit: () => void;
};

export function ReviewBlock({
  title,
  value,
  detail,
  onEdit,
}: ReviewBlockProps) {
  return (
    <View style={styles.reviewBlock}>
      <View style={styles.header}>
        <ThemedText type="code" themeColor="textSecondary">
          {title}
        </ThemedText>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Alterar ${title.toLowerCase()}`}
          hitSlop={8}
          onPress={onEdit}
        >
          <ThemedText type="code" themeColor="textSecondary">
            ALTERAR
          </ThemedText>
        </Pressable>
      </View>

      <ThemedText>{value}</ThemedText>

      {detail ? <ThemedText type="small">{detail}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  reviewBlock: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.one,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
});
