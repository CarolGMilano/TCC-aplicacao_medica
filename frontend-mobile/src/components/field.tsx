import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";

import { Fonts } from "@/constants/theme";
import { ThemedText } from "@/components/themed-text";
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
      <ThemedText type="code" themeColor="textSecondary" style={styles.label}>
        {label}
      </ThemedText>
      <View
        style={[
          styles.inputRow,
          { borderBottomColor: error ? theme.accent : theme.border },
        ]}
      >
        <TextInput
          {...props}
          style={[styles.input, { color: theme.text }, style]}
          placeholderTextColor={theme.muted}
          secureTextEntry={password && !visible}
          autoCapitalize={password ? "none" : props.autoCapitalize}
        />
        {password ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => setVisible((current) => !current)}
          >
            <ThemedText
              type="code"
              themeColor="primary"
              style={styles.showButton}
            >
              {visible ? "OCULTAR" : "MOSTRAR"}
            </ThemedText>
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <ThemedText style={[styles.error, { color: theme.accent }]}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 8 },
  label: { letterSpacing: 1.2, fontSize: 10 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    minHeight: 42,
  },
  input: { flex: 1, fontFamily: Fonts.sans, fontSize: 15, paddingVertical: 8 },
  showButton: { fontSize: 9, letterSpacing: 0.5 },
  error: { fontSize: 12, marginTop: 2 },
});
