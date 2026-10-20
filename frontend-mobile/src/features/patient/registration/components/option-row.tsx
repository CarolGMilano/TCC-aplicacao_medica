import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";

import { Spacing, Theme } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";
import { inputStyles } from "@/components/shared/input-styles";
import { PillButton } from "@/components/shared/pill-button";

type OptionRowProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  actionLabel?: string;
  dotColor?: string;
};

export function OptionRow({
  label,
  value,
  onChange,
  options,
  actionLabel,
  dotColor,
}: OptionRowProps) {
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

        {actionLabel ? (
          <View style={styles.compactValue}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: dotColor ?? Theme.textSecondary },
              ]}
            />
            <ThemedText style={styles.optionValue}>{value}</ThemedText>
            <PillButton
              label={actionLabel}
              icon={null}
              accessibilityLabel={`${actionLabel}: ${label}`}
              onPress={() => setIsOpen(true)}
            />
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${label}: ${value}`}
            style={styles.optionField}
            onPress={() => setIsOpen(true)}
          >
            <ThemedText style={styles.optionValue}>{value}</ThemedText>
            <View style={styles.chevron} />
          </Pressable>
        )}
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
    gap: Spacing.two,
  },

  optionField: {
    ...inputStyles.box,
    minHeight: 48,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },

  optionValue: {
    flex: 1,
  },

  // Valor atual num cartão, com a ação ao lado (ex.: status na consulta).
  compactValue: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingLeft: Spacing.three,
    paddingRight: Spacing.two,
    paddingVertical: Spacing.one + Spacing.half,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Theme.inputBorder,
    backgroundColor: Theme.backgroundElement,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  // Seta para baixo desenhada com duas bordas de um quadrado girado,
  // centralizada na altura do campo (o caractere "⌄" ficava no canto).
  chevron: {
    width: 9,
    height: 9,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: Theme.textSecondary,
    transform: [{ rotate: "45deg" }],
    marginTop: -4,
    marginRight: Spacing.one,
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
