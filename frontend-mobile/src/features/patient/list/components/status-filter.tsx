import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Spacing, Theme, Typography } from "@/constants/theme";
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
  const insets = useSafeAreaInsets();

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Filtrar por status da paciente"
        onPress={onOpen}
        style={styles.select}
      >
        <ThemedText style={styles.selectText} numberOfLines={1}>
          {value}
        </ThemedText>
        <View style={styles.chevron} />
      </Pressable>
      <Modal
        visible={open}
        transparent
        statusBarTranslucent
        animationType="fade"
        onRequestClose={onClose}
      >
        <Pressable
          style={[styles.overlay, { paddingTop: insets.top + Spacing.two }]}
          onPress={onClose}
        >
          <View style={styles.menu}>
            <ThemedText
              type="code"
              themeColor="textSecondary"
              style={styles.title}
            >
              STATUS DA PACIENTE
            </ThemedText>
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
    gap: Spacing.two,
    flex: 1,
  },

  selectText: {
    flex: 1,
  },

  // Seta desenhada como a do option-row: o glifo "⌄" vinha da fonte do sistema.
  chevron: {
    width: 9,
    height: 9,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: Theme.textSecondary,
    transform: [{ rotate: "45deg" }],
    marginTop: -4,
  },

  overlay: {
    flex: 1,
    backgroundColor: "#00000026",
    justifyContent: "flex-start",
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
    marginBottom: Spacing.one,
    paddingHorizontal: Spacing.two,
  },

  option: {
    minHeight: 44,
    borderRadius: 10,
    paddingHorizontal: Spacing.two,
    justifyContent: "center",
  },

  selectedOption: {
    backgroundColor: Theme.primary,
  },

  optionText: {
    fontSize: Typography.sizes.body,
  },

  selectedOptionText: {
    color: Theme.textPrimaryLight,
  },
});
