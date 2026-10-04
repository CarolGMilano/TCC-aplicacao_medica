import { Pressable, StyleSheet } from "react-native";

import { Theme } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

type RoundButtonProps = {
  label: string;
  accessibilityLabel: string;
  active?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function RoundButton({
  label,
  accessibilityLabel,
  active,
  disabled,
  onPress,
}: RoundButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      hitSlop={6}
      style={[
        styles.roundButton,
        active && styles.roundButtonActive,
        disabled && styles.roundButtonDisabled,
      ]}
    >
      <ThemedText themeColor={active ? "textPrimaryLight" : "textSecondary"}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  roundButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Theme.border,
    alignItems: "center",
    justifyContent: "center",
  },

  roundButtonActive: {
    backgroundColor: Theme.primary,
    borderColor: Theme.primary,
  },

  roundButtonDisabled: {
    opacity: 0.4,
  },
});
