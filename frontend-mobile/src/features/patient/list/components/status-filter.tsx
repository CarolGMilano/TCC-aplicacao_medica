import { Modal, Pressable, StyleSheet, View } from "react-native";

import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

type StatusFilterProps = {
  value: string;
  options: string[];
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onChange: (value: string) => void;
};

export function StatusFilter({
  value,
  options,
  open,
  onOpen,
  onClose,
  onChange,
}: StatusFilterProps) {
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Filtrar por status da paciente"
        onPress={onOpen}
        style={styles.select}
      >
        <ThemedText style={styles.selectText}>{value}</ThemedText>
        <ThemedText style={styles.chevron}>⌄</ThemedText>
      </Pressable>
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <Pressable style={styles.overlay} onPress={onClose}>
          <View style={styles.menu}>
          <ThemedText style={styles.title}>STATUS DA PACIENTE</ThemedText>
          {options.map((option) => (
              <Pressable
                key={option}
                accessibilityRole="radio"
                accessibilityState={{ checked: value === option }}
                onPress={() => {
                  onChange(option);
                  onClose();
                }}
                style={[
                  styles.option,
                  value === option && styles.selectedOption,
                ]}
              >
                <ThemedText
                  style={[
                    styles.optionText,
                    value === option && styles.selectedOptionText,
                  ]}
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
  select: {
    height: 40,
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: 20,
    paddingHorizontal: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  selectText: { fontSize: Typography.sizes.small },
  chevron: {
    fontFamily: FontFamilies.primarySemiBold,
    fontSize: Typography.sizes.body,
    lineHeight: 17,
  },
  overlay: {
    flex: 1,
    backgroundColor: "#00000026",
    justifyContent: "flex-start",
    paddingTop: 0,
    paddingHorizontal: 2,
  },
  menu: {
    backgroundColor: Theme.backgroundElement,
    borderRadius: 14,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    elevation: 5,
  },
  title: {
    fontFamily: FontFamilies.primaryMedium,
    fontSize: Typography.sizes.small,
    letterSpacing: Typography.letterSpacing.wide,
    marginBottom: Spacing.one,
    paddingHorizontal: Spacing.one,
  },
  option: {
    minHeight: 44,
    borderRadius: 10,
    paddingHorizontal: Spacing.one,
    justifyContent: "center",
  },
  selectedOption: { backgroundColor: Theme.primary },
  optionText: { fontSize: Typography.sizes.body },
  selectedOptionText: { color: Theme.textPrimaryLight },
});
