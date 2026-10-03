import { Pressable, StyleSheet, View } from "react-native";

import { Spacing, Theme } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

type ChoiceRowProps = {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  inline?: boolean;
};

export function ChoiceRow({
  label,
  options,
  selected,
  onSelect,
  inline = false,
}: ChoiceRowProps) {
  return (
    <View style={[styles.choiceRow, inline && styles.choiceRowInline]}>
      <ThemedText type="code" themeColor="textSecondary">
        {label}
      </ThemedText>

      <View style={[styles.choiceList, inline && styles.choiceListInline]}>
        {options.map((option) => {
          const isSelected = option === selected;

          return (
            <Pressable
              key={option}
              onPress={() => onSelect(option)}
              style={[styles.choice, isSelected && styles.choiceSelected]}
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
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },

  choiceRowInline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  choiceList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.one,
    flexShrink: 1,
  },

  choiceListInline: {
    justifyContent: "flex-end",
  },

  choice: {
    backgroundColor: Theme.backgroundElement,
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: 20,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },

  choiceSelected: {
    backgroundColor: Theme.primary,
    borderColor: Theme.primary,
  },
});
