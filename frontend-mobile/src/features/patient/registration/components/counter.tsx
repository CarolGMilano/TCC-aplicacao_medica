import { StyleSheet, TextInput, View } from "react-native";

import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

import { RoundButton } from "./round-button";

type CounterProps = {
  label: string;
  value: number;
  suffix?: string;
  min?: number;
  max?: number;
  editable?: boolean;
  onChange: (value: number) => void;
};

export function Counter({
  label,
  value,
  suffix,
  min = 0,
  max = 120,
  editable = false,
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

        {editable ? (
          <TextInput
            accessibilityLabel={label}
            value={String(value)}
            keyboardType="number-pad"
            selectTextOnFocus
            onChangeText={(text) => {
              const digits = text.replace(/\D/g, "");
              const nextValue = digits ? Number(digits) : min;
              onChange(Math.min(max, Math.max(min, nextValue)));
            }}
            style={styles.counterInput}
          />
        ) : (
          <ThemedText style={styles.counterValue}>{value}</ThemedText>
        )}

        <RoundButton
          label="+"
          accessibilityLabel={`Aumentar ${label.toLowerCase()}`}
          active
          disabled={value >= max}
          onPress={() => onChange(Math.min(max, value + 1))}
        />

        {/* Espaço fixo para a unidade, para os contadores ficarem alinhados
            mesmo nas linhas sem "ANOS". */}
        <View style={[styles.suffix, !suffix && styles.suffixEmpty]}>
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
  // Rótulo em cima, botões embaixo: cabe em colunas (FieldRow).
  row: {
    gap: Spacing.two,
  },

  counter: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },

  suffix: {
    width: 36,
  },

  counterValue: {
    minWidth: 36,
    textAlign: "center",
    fontFamily: FontFamilies.detail,
    fontSize: Typography.sizes.greeting,
    lineHeight: Typography.lineHeights.greeting,
  },

  // Sem o padding vertical padrão do TextInput no Android, que deixava o campo
  // mais alto que os outros.
  counterInput: {
    width: 42,
    minHeight: 40,
    paddingHorizontal: 0,
    paddingVertical: 0,
    textAlign: "center",
    fontFamily: FontFamilies.detail,
    fontSize: Typography.sizes.greeting,
    lineHeight: Typography.lineHeights.greeting,
    color: Theme.text,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },

  suffixEmpty: {
    width: 0,
  },
});
