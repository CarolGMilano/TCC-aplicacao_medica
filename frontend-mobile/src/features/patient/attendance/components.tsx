import { router, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

export function AttendanceHeader({ title }: { title: string }) {
  const { name, record } = useLocalSearchParams<{
    name: string;
    record: string;
  }>();

  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Cancelar e voltar"
        hitSlop={8}
        onPress={() => router.back()}
        style={styles.cancel}
      >
        <ThemedText style={styles.close}>×</ThemedText>
        <ThemedText type="code" themeColor="textSecondary">
          CANCELAR
        </ThemedText>
      </Pressable>
      <View style={styles.titleRow}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.badge}>NOVA</ThemedText>
      </View>
      <ThemedText type="code" themeColor="textSecondary">
        PACIENTE {name?.toUpperCase()} · PRT {record}
      </ThemedText>
    </View>
  );
}

export function LabeledInput({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <ThemedText type="code" themeColor="textSecondary" style={styles.label}>
        {label}
      </ThemedText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Theme.textSecondary}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        style={[styles.input, multiline && styles.textarea]}
      />
    </View>
  );
}

export function DateInput({
  label,
  values,
  onChange,
}: {
  label: string;
  values: [string, string, string];
  onChange: (index: number, value: string) => void;
}) {
  return (
    <View style={styles.field}>
      <ThemedText type="code" themeColor="textSecondary" style={styles.label}>
        {label}
      </ThemedText>
      <View style={styles.dateRow}>
        {values.map((value, index) => (
          <TextInput
            key={index}
            value={value}
            onChangeText={(next) => onChange(index, next.replace(/\D/g, ""))}
            keyboardType="number-pad"
            maxLength={index === 2 ? 4 : 2}
            placeholder={index === 0 ? "DD" : index === 1 ? "MM" : "AAAA"}
            placeholderTextColor={Theme.textSecondary}
            style={[
              styles.input,
              styles.dateInput,
              index === 2 && styles.yearInput,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

export function SaveButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.save,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <ThemedText type="smallBold" themeColor="textPrimaryLight">
        {label}
      </ThemedText>
    </Pressable>
  );
}

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Theme.background,
  },

  header: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },

  cancel: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    marginBottom: Spacing.three,
  },

  close: {
    color: Theme.textSecondary,
    fontSize: 26,
    lineHeight: 20,
    fontWeight: "300",
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontFamily: FontFamilies.detail,
    fontSize: Typography.sizes.title,
    lineHeight: Typography.lineHeights.title,
  },

  badge: {
    color: Theme.textPrimaryLight,
    backgroundColor: Theme.primary,
    borderRadius: 12,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    fontFamily: FontFamilies.secondary,
    fontSize: Typography.sizes.micro,
  },

  field: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },

  label: {
    fontSize: Typography.sizes.micro,
    letterSpacing: Typography.letterSpacing.wide,
    marginBottom: Spacing.two,
  },

  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: 11,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    color: Theme.text,
    fontFamily: FontFamilies.primary,
    fontSize: Typography.sizes.input,
    backgroundColor: Theme.backgroundElement,
  },

  textarea: {
    minHeight: 120,
    paddingTop: Spacing.two,
  },

  dateRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },

  dateInput: {
    flex: 1,
    textAlign: "center",
  },

  yearInput: { flex: 1.7 },

  save: {
    minHeight: 54,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.primary,
  },

  pressed: { backgroundColor: Theme.primaryHoverDark },

  disabled: { opacity: 0.6 },
});
