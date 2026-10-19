import { router, useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";
import { ThemedView } from "@/components/shared/themed-view";

import { Badge } from "../record/components";
import { styles as registrationStyles } from "../registration/styles";

// Novo registro, registro salvo aberto para ver, ou em edição.
export type AttendanceMode = "new" | "view" | "edit";

// Sem onBack, o cabeçalho cancela o registro; com onBack (telas em passos),
// volta para o passo anterior. Vendo um registro salvo, volta para os
// atendimentos, como no layout.
// disabled trava os dois botões enquanto o registro está sendo salvo; step
// mostra a barra de passos entre os botões e o título, como no layout.
export function AttendanceHeader({
  title,
  onBack,
  disabled,
  step,
  mode = "new",
}: {
  title: string;
  onBack?: () => void;
  disabled?: boolean;
  step?: { current: number; total: number };
  mode?: AttendanceMode;
}) {
  const { name, record } = useLocalSearchParams<{
    name: string;
    record: string;
  }>();

  return (
    <View style={styles.header}>
      {onBack || mode === "view" ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            onBack ? "Voltar ao passo anterior" : "Voltar para os atendimentos"
          }
          accessibilityState={{ disabled }}
          disabled={disabled}
          hitSlop={8}
          onPress={onBack ?? (() => router.back())}
          style={[styles.cancel, disabled && styles.disabled]}
        >
          <SymbolView
            name={{ ios: "arrow.left", android: "arrow_back", web: "arrow_back" }}
            tintColor={Theme.textSecondary}
            size={19}
          />
          <ThemedText type="code" themeColor="textSecondary">
            {onBack ? "VOLTAR" : "ATENDIMENTOS"}
          </ThemedText>
        </Pressable>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cancelar e voltar"
          accessibilityState={{ disabled }}
          disabled={disabled}
          hitSlop={8}
          onPress={() => router.back()}
          style={[styles.cancel, disabled && styles.disabled]}
        >
          <ThemedText style={styles.close}>×</ThemedText>
          <ThemedText type="code" themeColor="textSecondary">
            CANCELAR
          </ThemedText>
        </Pressable>
      )}
      {step ? (
        <View style={[registrationStyles.progress, styles.progress]}>
          {Array.from({ length: step.total }, (_, index) => (
            <ThemedView
              key={index}
              type={index < step.current ? "primary" : "border"}
              style={registrationStyles.progressSegment}
            />
          ))}
        </View>
      ) : null}
      <View style={styles.titleRow}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        {mode !== "view" ? (
          <View>
            <Badge
              label={mode === "edit" ? "Editando" : "Nova"}
              color={Theme.textPrimaryLight}
              background={Theme.primary}
            />
          </View>
        ) : null}
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
        placeholderTextColor={Theme.placeholder}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        style={[styles.input, multiline && styles.textarea]}
      />
    </View>
  );
}

// Texto longo de um registro salvo (ex.: observação), abaixo do rótulo.
export function TextBlock({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field}>
      <ThemedText type="code" themeColor="textSecondary" style={styles.label}>
        {label}
      </ThemedText>
      <ThemedText>{value}</ThemedText>
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
            placeholderTextColor={Theme.placeholder}
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

// outline: botão com contorno, como o "Editar registro" do layout.
export function SaveButton({
  label,
  onPress,
  disabled,
  outline,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  outline?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.save,
        outline && styles.outline,
        pressed && !outline && styles.pressed,
        pressed && outline && styles.outlinePressed,
        disabled && styles.disabled,
      ]}
    >
      <ThemedText
        type="button"
        themeColor={outline ? "text" : "textPrimaryLight"}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

export const styles = StyleSheet.create({

  // Linhas com resposta "Sim" que pedem atenção (ex.: ver e tratar).
  // Borda sempre presente (transparente) para o texto não pular 3px ao
  // destacar a linha.
  alertRow: {
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
  },

  highlight: {
    backgroundColor: Theme.backgroundAlert,
    borderLeftColor: Theme.secondary,
  },

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

  progress: { marginBottom: Spacing.three },

  close: {
    color: Theme.textSecondary,
    fontSize: 26,
    lineHeight: 20,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },

  // Títulos longos ("Novo PCR DNA HPV") quebram linha em vez de encostar no selo.
  title: {
    flexShrink: 1,
    fontFamily: FontFamilies.detail,
    fontSize: Typography.sizes.title,
    lineHeight: Typography.lineHeights.title,
  },

  field: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },

  label: { marginBottom: Spacing.two },

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

  outline: {
    borderWidth: 1,
    borderColor: Theme.border,
    backgroundColor: Theme.backgroundElement,
  },

  outlinePressed: { backgroundColor: Theme.backgroundSelected },

  disabled: { opacity: 0.6 },
});
