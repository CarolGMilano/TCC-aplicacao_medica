import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";

import { FontFamilies, Theme, Typography } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";
import { useTheme } from "@/hooks/use-theme";

type FieldProps = TextInputProps & {
  label: string;
  error?: string;
  password?: boolean;
};

export function Field({ label, error, password, style, ...props }: FieldProps) {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      <ThemedText themeColor="textSecondary" style={styles.label}>
        {label}
      </ThemedText>
      <View
        style={[
          styles.inputRow,
          { borderBottomColor: error ? Theme.error : theme.primary },
        ]}
      >
        <TextInput
          {...props}
          style={[styles.input, { color: theme.text }, style]}
          placeholderTextColor={theme.text}
          secureTextEntry={password && !visible}
          autoCapitalize={password ? "none" : props.autoCapitalize}
        />
        {password ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => setVisible((current) => !current)}
          >
            <ThemedText style={styles.showButton}>
              {visible ? "OCULTAR" : "MOSTRAR"}
            </ThemedText>
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <ThemedText themeColor="error" style={styles.error}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 2 },
  label: {
    letterSpacing: Typography.letterSpacing.wide,
    alignSelf: "flex-start",
    fontSize: Typography.sizes.label,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontFamily: FontFamilies.primary,
    fontSize: Typography.sizes.input,
    lineHeight: Typography.lineHeights.input,
    paddingVertical: 8,
  },
  showButton: {
    fontSize: Typography.sizes.micro,
    fontFamily: FontFamilies.secondary,
    letterSpacing: Typography.letterSpacing.normal,
  },
  error: {
    fontSize: Typography.sizes.small,
    lineHeight: Typography.lineHeights.caption,
    marginTop: 2,
  },
});
