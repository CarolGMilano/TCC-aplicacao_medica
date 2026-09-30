import { StyleSheet, TextInput, View } from "react-native";

import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

type InputFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  onChangeText: (value: string) => void;
};

export function InputField({
  label,
  value,
  placeholder,
  onChangeText,
}: InputFieldProps) {
  return (
    <View style={styles.inputField}>
      <ThemedText type="code" themeColor="textSecondary">
        {label}
      </ThemedText>

      <TextInput
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        placeholderTextColor={Theme.muted}
        style={styles.textInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputField: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    gap: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },

  textInput: {
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: 12,
    minHeight: 48,
    paddingHorizontal: Spacing.two,
    fontFamily: FontFamilies.primary,
    fontSize: Typography.sizes.input,
    color: Theme.text,
  },
});
