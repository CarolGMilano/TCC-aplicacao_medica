import { useState } from "react";
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
import { inputStyles } from "@/components/shared/input-styles";

type InputFieldProps = {
  label?: string;
  value: string;
  prefix?: string;
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
  prefix,
  placeholder,
  onChangeText,
  keyboardType = "default",
  maxLength,
  containerStyle,
  inputStyle,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.inputField, containerStyle]}>
      {label ? (
        <ThemedText type="code" themeColor="textSecondary">
          {label}
        </ThemedText>
      ) : null}

      <View
        style={
          prefix ? [styles.inputRow, focused && inputStyles.focused] : undefined
        }
      >
        {prefix ? (
          <ThemedText style={styles.prefix} themeColor="textSecondary">
            {prefix}
          </ThemedText>
        ) : null}
        <TextInput
          value={value}
          placeholder={placeholder}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          maxLength={maxLength}
          placeholderTextColor={Theme.placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[
            styles.textInput,
            prefix && styles.textInputWithPrefix,
            !prefix && focused && inputStyles.focused,
            inputStyle,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputField: {
    gap: Spacing.two,
  },

  textInput: {
    ...inputStyles.box,
    minHeight: 48,
    paddingHorizontal: Spacing.two,
    fontFamily: FontFamilies.primary,
    fontSize: Typography.sizes.input,
    color: Theme.text,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    ...inputStyles.box,
    minHeight: 48,
  },

  prefix: {
    paddingLeft: Spacing.two,
    fontFamily: FontFamilies.primary,
    fontSize: Typography.sizes.input,
  },

  textInputWithPrefix: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 0,
    borderRadius: 0,
  },
});
