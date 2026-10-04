import { StyleSheet, View } from "react-native";

import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

import { RoundButton } from "./round-button";

type CounterProps = {
  label: string;
  value: number;
  suffix?: string;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
};

export function Counter({
  label,
  value,
  suffix,
  min = 0,
  max = 120,
  onChange,
}: CounterProps) {
  return (
    <View style={styles.row}>
      <ThemedText type="code" themeColor="textSecondary">
        {label}
      </ThemedText>

      <View style={styles.counter}>
        <RoundButton
          label="−"
          accessibilityLabel={`Diminuir ${label.toLowerCase()}`}
          disabled={value <= min}
          onPress={() => onChange(Math.max(min, value - 1))}
        />

        <ThemedText style={styles.counterValue}>{value}</ThemedText>

        <RoundButton
          label="+"
          accessibilityLabel={`Aumentar ${label.toLowerCase()}`}
          active
          disabled={value >= max}
          onPress={() => onChange(Math.min(max, value + 1))}
        />

        {/* Espaço fixo para a unidade, para os contadores ficarem alinhados
            mesmo nas linhas sem "ANOS". */}
        <View style={styles.suffix}>
          {suffix ? (
            <ThemedText type="code" themeColor="textSecondary">
              {suffix}
            </ThemedText>
          ) : null}
        </View>
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

  suffix: {
    width: 40,
  },

  counterValue: {
    minWidth: 36,
    textAlign: "center",
    fontFamily: FontFamilies.detail,
    fontSize: Typography.sizes.greeting,
    lineHeight: Typography.lineHeights.greeting,
  },
});
