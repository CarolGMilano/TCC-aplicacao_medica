import { SymbolView } from "expo-symbols";
import { useState, type ReactNode } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";
import { inputStyles } from "@/components/shared/input-styles";

export type DateValue = [day: string, month: string, year: string];

type DateFieldProps = {
  label: string;
  value: DateValue;
  onChange: (value: DateValue) => void;
  // Texto de apoio abaixo do campo (ex.: idade calculada).
  hint?: ReactNode;
  error?: string | null;
};

// Monta "dd/mm/aaaa" com as barras no lugar enquanto se digita.
function formatDate([day, month, year]: DateValue) {
  if (year) return `${day}/${month}/${year}`;
  if (month) return `${day}/${month}`;
  return day;
}

// Separa os dígitos digitados em dia (2), mês (2) e ano (4). Nada é
// bloqueado: a validação da data continua com quem usa o campo.
function parseDate(text: string): DateValue {
  const digits = text.replace(/\D/g, "").slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)];
}

// Campo de data igual aos outros campos: um só, com máscara dd/mm/aaaa,
// teclado numérico e um ícone de calendário (só visual).
export function DateField({
  label,
  value,
  onChange,
  hint,
  error,
}: DateFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.field}>
      <ThemedText type="code" themeColor="textSecondary">
        {label}
      </ThemedText>
      <View
        style={[
          styles.box,
          focused && inputStyles.focused,
          error ? styles.boxError : null,
        ]}
      >
        <TextInput
          accessibilityLabel={label}
          value={formatDate(value)}
          onChangeText={(text) => onChange(parseDate(text))}
          keyboardType="number-pad"
          maxLength={10}
          placeholder="dd/mm/aaaa"
          placeholderTextColor={Theme.placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={styles.input}
        />
        <SymbolView
          name={{
            ios: "calendar",
            android: "calendar_today",
            web: "calendar_today",
          }}
          tintColor={Theme.textSecondary}
          size={18}
        />
      </View>
      {hint ? (
        <ThemedText type="small" themeColor="textSecondary">
          {hint}
        </ThemedText>
      ) : null}
      {error ? (
        <ThemedText type="small" themeColor="error">
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: Spacing.two },

  box: {
    ...inputStyles.box,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48,
    paddingRight: Spacing.three,
  },

  boxError: { borderColor: Theme.error },

  input: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: Spacing.two,
    color: Theme.text,
    fontFamily: FontFamilies.primary,
    fontSize: Typography.sizes.input,
  },
});
