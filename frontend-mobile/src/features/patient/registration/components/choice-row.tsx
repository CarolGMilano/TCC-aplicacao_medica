import { Pressable, StyleSheet, View } from "react-native";

import { Spacing, Theme } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

type ChoiceRowProps = {
  label: string;
  options: readonly string[];
  // Uma opção (seleção única) ou várias (seleção múltipla).
  selected: string | string[];
  onSelect: (value: string) => void;
  // Texto de apoio abaixo do rótulo.
  hint?: string;
  // Cor da opção marcada, quando não é a primária (ex.: coral nos alertas).
  selectedColor?: string;
};

export function ChoiceRow({
  label,
  options,
  selected,
  onSelect,
  hint,
  selectedColor,
}: ChoiceRowProps) {
  return (
    <View style={styles.choiceRow}>
      <ThemedText type="code" themeColor="textSecondary">
        {label}
      </ThemedText>
      {hint ? (
        <ThemedText type="small" themeColor="textSecondary">
          {hint}
        </ThemedText>
      ) : null}

      <View style={styles.choiceList}>
        {options.map((option) => {
          const isSelected = Array.isArray(selected)
            ? selected.includes(option)
            : option === selected;

          return (
            <Pressable
              key={option}
              onPress={() => onSelect(option)}
              accessibilityRole={Array.isArray(selected) ? "checkbox" : "radio"}
              accessibilityState={{ checked: isSelected }}
              style={[
                styles.choice,
                isSelected && styles.choiceSelected,
                isSelected &&
                  selectedColor && {
                    backgroundColor: selectedColor,
                    borderColor: selectedColor,
                  },
              ]}
            >
              <ThemedText
                themeColor={isSelected ? "textPrimaryLight" : "textSecondary"}
              >
                {option}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  choiceRow: {
    gap: Spacing.two,
  },

  choiceList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },

  // Opções com 44px de altura, fáceis de tocar.
  choice: {
    minHeight: 44,
    minWidth: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.inputBackground,
    borderWidth: 1,
    borderColor: Theme.inputBorder,
    borderRadius: 22,
    paddingHorizontal: Spacing.three,
  },

  choiceSelected: {
    backgroundColor: Theme.primary,
    borderColor: Theme.primary,
  },
});
