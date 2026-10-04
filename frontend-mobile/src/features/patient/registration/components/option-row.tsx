import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";

import { Spacing, Theme } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

type OptionRowProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
};

export function OptionRow({ label, value, onChange, options }: OptionRowProps) {
  const [isOpen, setIsOpen] = useState(false);

  function selectOption(option: string) {
    onChange(option);
    setIsOpen(false);
  }

  return (
    <>
      <View style={styles.optionRow}>
        <ThemedText type="code" themeColor="textSecondary">
          {label}
        </ThemedText>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${label}: ${value}`}
          style={styles.optionField}
          onPress={() => setIsOpen(true)}
        >
          <ThemedText style={styles.optionValue}>{value}</ThemedText>
          <ThemedText style={styles.arrow}>⌄</ThemedText>
        </Pressable>
      </View>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsOpen(false)}>
          <View style={styles.modalCard}>
            <ThemedText type="code" themeColor="textSecondary">
              {label}
            </ThemedText>

            <ScrollView contentContainerStyle={styles.optionList}>
              {options.map((option) => {
                const isSelected = option === value;

                return (
                  <Pressable
                    key={option}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: isSelected }}
                    onPress={() => selectOption(option)}
                    style={[styles.option, isSelected && styles.optionSelected]}
                  >
                    <ThemedText
                      themeColor={isSelected ? "textPrimaryLight" : "text"}
                    >
                      {option}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  optionRow: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    gap: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },

  optionField: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: Theme.border,
    backgroundColor: Theme.backgroundElement,
    paddingHorizontal: Spacing.two,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },

  optionValue: {
    flex: 1,
  },

  arrow: {
    fontSize: 18,
    lineHeight: 18,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    padding: Spacing.three,
    backgroundColor: "rgba(38, 48, 31, 0.28)",
  },

  modalCard: {
    maxHeight: "80%",
    borderWidth: 1,
    borderRadius: 16,
    borderColor: Theme.border,
    backgroundColor: Theme.backgroundElement,
    padding: Spacing.three,
    gap: Spacing.two,
  },

  optionList: {
    gap: Spacing.one,
  },

  option: {
    borderRadius: 10,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },

  optionSelected: {
    backgroundColor: Theme.primary,
  },
});
