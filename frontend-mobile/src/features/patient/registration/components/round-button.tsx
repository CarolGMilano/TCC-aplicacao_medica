import { Pressable, StyleSheet } from "react-native";

import { Theme } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

type RoundButtonProps = {
  label: string;
  active?: boolean;
  onPress: () => void;
};

export function RoundButton({ label, active, onPress }: RoundButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.roundButton, active && styles.roundButtonActive]}
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
});
