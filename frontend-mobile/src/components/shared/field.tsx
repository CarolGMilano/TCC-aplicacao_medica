import { type Ref, useState } from "react";
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
  ref?: Ref<TextInput>;
  label: string;
  error?: string;
  password?: boolean;
};

export function Field({ label, error, password, style, ...props }: FieldProps) {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      <ThemedText type="code" themeColor="textSecondary" style={styles.label}>
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
          placeholderTextColor={theme.placeholder}
          secureTextEntry={password && !visible}
          autoCapitalize={password ? "none" : props.autoCapitalize}
        />
        {password ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => setVisible((current) => !current)}
          >
            <ThemedText type="code" themeColor="textSecondary">
              {visible ? "Ocultar" : "Mostrar"}
            </ThemedText>
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <ThemedText type="small" themeColor="error" style={styles.error}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 2 },
  label: { alignSelf: "flex-start" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    minHeight: 48,
  },
  input: {
    flex: 1,
    // Deixa o campo encolher para o "MOSTRAR" caber ao lado (no web o input não encolhe sozinho).
    minWidth: 0,
    fontFamily: FontFamilies.primary,
    fontSize: Typography.sizes.input,
    lineHeight: Typography.lineHeights.input,
    paddingVertical: 8,
  },
  error: { marginTop: 2 },
});
