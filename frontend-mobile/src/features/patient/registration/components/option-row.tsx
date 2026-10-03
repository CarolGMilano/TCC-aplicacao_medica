import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useState } from "react";

import { Spacing, Theme } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";
import { useTheme } from "@/hooks/use-theme";

type OptionRowProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
};

export function OptionRow({ label, value, onChange, options }: OptionRowProps) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  function selectOption(option: string) {
    onChange(option);
    setIsOpen(false);
  }

  return (
    <>
      <View style={[styles.optionRow, { borderBottomColor: theme.border }]}> 
        <ThemedText type="code" themeColor="textSecondary">
          {label}
        </ThemedText>

        <Pressable
          style={[
            styles.optionField,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.border,
            },
          ]}
          onPress={() => setIsOpen(true)}
        >
          <ThemedText>{value}</ThemedText>
          <ThemedText style={styles.arrow}>⌄</ThemedText>
        </Pressable>
      </View>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsOpen(false)}
        >
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.border,
              },
            ]}
          >
            <ThemedText type="code" themeColor="textSecondary">
              {label}
            </ThemedText>
            {options.map((option) => (
              <Pressable
                key={option}
                onPress={() => selectOption(option)}
                style={[
                  styles.option,
                  option === value && {
                    backgroundColor: theme.primary,
                  },
                ]}
              >
                <ThemedText
                  themeColor={option === value ? "textPrimaryLight" : "text"}
                >
                  {option}
                </ThemedText>
              </Pressable>
            ))}
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
    paddingHorizontal: Spacing.two,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  arrow: {
    fontSize: 18,
    lineHeight: 18,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    padding: Spacing.three,
    backgroundColor: "rgba(16, 33, 42, 0.28)",
  },

  modalCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.one,
  },

  option: {
    borderRadius: 10,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
});
