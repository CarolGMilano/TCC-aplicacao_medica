import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

type InputFieldProps = {
  label?: string;
  value: string;
  placeholder?: string;
  onChangeText: (value: string) => void;
  keyboardType?: "default" | "numeric" | "number-pad";
  maxLength?: number;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export function InputField({
  label,
  value,
  placeholder,
  onChangeText,
  keyboardType = "default",
  maxLength,
  containerStyle,
  inputStyle,
}: InputFieldProps) {
  return (
    <View style={[styles.inputField, containerStyle]}>
      {label ? (
        <ThemedText type="code" themeColor="textSecondary">
          {label}
        </ThemedText>
      ) : null}

      <TextInput
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        maxLength={maxLength}
        placeholderTextColor={Theme.muted}
        style={[styles.textInput, inputStyle]}
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
    backgroundColor: Theme.backgroundElement,
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
