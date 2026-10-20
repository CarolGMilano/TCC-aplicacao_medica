import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";
import { ThemedView } from "@/components/shared/themed-view";
import { Chip } from "@/components/shared/chip";
import { PatientCard } from "@/components/shared/patient-card";
import { ScreenHeader } from "@/components/shared/screen-header";
import { inputStyles } from "@/components/shared/input-styles";

import {
  DateField,
  type DateValue,
} from "../registration/components/date-field";
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
  doctor,
}: {
  title: string;
  onBack?: () => void;
  disabled?: boolean;
  step?: { current: number; total: number };
  mode?: AttendanceMode;
  doctor?: string | null;
}) {
  const { name, record } = useLocalSearchParams<{
    name: string;
    record: string;
  }>();

  return (
    <ScreenHeader
      style={styles.header}
      title={title}
      back={
        onBack || mode === "view"
          ? {
              label: onBack ? "Voltar" : "Atendimentos",
              icon: "back",
              accessibilityLabel: onBack
                ? "Voltar ao passo anterior"
                : "Voltar para os atendimentos",
              disabled,
              onPress: onBack ?? (() => router.back()),
            }
          : {
              label: "Cancelar",
              icon: "close",
              accessibilityLabel: "Cancelar e voltar",
              disabled,
              onPress: () => router.back(),
            }
      }
      // "Nova" já está no título; o selo só marca a edição.
      chip={
        mode === "edit" ? (
          <Chip
            label="Editando"
            color={Theme.textPrimaryLight}
            background={Theme.primary}
            large
          />
        ) : null
      }
    >
      {step ? (
        <View style={registrationStyles.progress}>
          {Array.from({ length: step.total }, (_, index) => (
            <ThemedView
              key={index}
              type={index < step.current ? "primary" : "border"}
              style={registrationStyles.progressSegment}
            />
          ))}
        </View>
      ) : null}
      {/* De quem é o registro: o que mais importa depois do título. */}
      <PatientCard
        name={name}
        record={record}
        detail={doctor ? `Médico responsável: ${doctor}` : null}
      />
    </ScreenHeader>
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
  const [focused, setFocused] = useState(false);

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
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          multiline && styles.textarea,
          focused && inputStyles.focused,
        ]}
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
  values: DateValue;
  onChange: (value: DateValue) => void;
}) {
  return <DateField label={label} value={values} onChange={onChange} />;
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
    borderRadius: 8,
    paddingHorizontal: Spacing.two + Spacing.one,
    paddingVertical: Spacing.two,
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







  field: {},

  label: { marginBottom: Spacing.two },

  input: {
    ...inputStyles.box,
    minHeight: 48,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    color: Theme.text,
    fontFamily: FontFamilies.primary,
    fontSize: Typography.sizes.input,
  },

  textarea: {
    minHeight: 120,
    paddingTop: Spacing.two,
  },

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
