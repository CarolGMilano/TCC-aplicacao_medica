import { StyleSheet, View } from "react-native";

import { Spacing, Theme } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

type ReviewBlockProps = {
  title: string;
  value: string;
  detail: string;
};

export function ReviewBlock({ title, value, detail }: ReviewBlockProps) {
  return (
    <View style={styles.reviewBlock}>
      <ThemedText type="code" themeColor="textSecondary">
        {title}
      </ThemedText>

      <ThemedText>{value}</ThemedText>

      <ThemedText>{detail}</ThemedText>
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
});
