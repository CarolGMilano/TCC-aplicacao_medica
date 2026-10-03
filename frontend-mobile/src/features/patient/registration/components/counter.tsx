import { StyleSheet, View } from "react-native";

import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

import { RoundButton } from "./round-button";

type CounterProps = {
  label: string;
  value: number;
  suffix?: string;
  onChange: (value: number) => void;
};

export function Counter({ label, value, suffix, onChange }: CounterProps) {
  return (
    <View style={styles.row}>
      <ThemedText type="code" themeColor="textSecondary">
        {label}
      </ThemedText>

      <View style={styles.counter}>
        <RoundButton
          label="−"
          onPress={() => onChange(Math.max(0, value - 1))}
        />

        <ThemedText style={styles.counterValue}>{value}</ThemedText>

        <RoundButton label="+" active onPress={() => onChange(value + 1)} />

        {suffix ? (
          <ThemedText type="code" themeColor="textSecondary">
            {suffix}
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 60,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  counter: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },

  counterValue: {
    fontFamily: FontFamilies.detail,
    fontSize: Typography.sizes.subtitle,
  },
});
