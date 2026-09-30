import { Pressable, StyleSheet } from "react-native";

import { Spacing, Theme } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

type OptionRowProps = {
  label: string;
  value: string;
  onChange: () => void;
};

export function OptionRow({ label, value, onChange }: OptionRowProps) {
  return (
    <Pressable style={styles.optionRow} onPress={onChange}>
      <ThemedText type="code" themeColor="textSecondary">
        {label}
      </ThemedText>

      <ThemedText>{value}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  optionRow: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },
});
