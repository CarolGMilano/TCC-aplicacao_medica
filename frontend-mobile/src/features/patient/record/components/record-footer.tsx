import { Pressable, StyleSheet, View } from "react-native";

import { Spacing, Theme } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

import { styles as registrationStyles } from "../../registration/styles";

type RecordFooterProps = {
  editing: boolean;
  saving: boolean;
  error: string;
  onCancel: () => void;
  onSave: () => void;
  onNewRecord: () => void;
};

// Rodapé fixo da ficha: "+ Novo registro" sempre à mão nas duas abas; durante
// a edição de um bloco, "Cancelar" e "Salvar alterações".
export function RecordFooter({
  editing,
  saving,
  error,
  onCancel,
  onSave,
  onNewRecord,
}: RecordFooterProps) {
  return (
    <View style={styles.footer}>
      {error ? (
        <ThemedText
          themeColor="error"
          type="small"
          accessibilityLiveRegion="polite"
          style={registrationStyles.error}
        >
          {error}
        </ThemedText>
      ) : null}

      {editing ? (
        <View style={styles.row}>
          <Pressable
            accessibilityRole="button"
            disabled={saving}
            onPress={onCancel}
            style={[styles.button, styles.outline]}
          >
            <ThemedText type="button">Cancelar</ThemedText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: saving }}
            disabled={saving}
            onPress={onSave}
            style={({ pressed }) => [
              styles.button,
              styles.primary,
              pressed && registrationStyles.pressed,
              saving && registrationStyles.disabled,
            ]}
          >
            <ThemedText themeColor="textPrimaryLight" type="button">
              {saving ? "Salvando..." : "Salvar alterações"}
            </ThemedText>
          </Pressable>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Adicionar novo registro"
          onPress={onNewRecord}
          style={({ pressed }) => [
            styles.button,
            styles.primary,
            pressed && registrationStyles.pressed,
          ]}
        >
          <ThemedText themeColor="textPrimaryLight" type="button">
            + Novo registro
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Abaixo da rolagem, e não por cima dela: com o teclado aberto, o campo
  // em que se digita fica acima dos botões.
  footer: {
    padding: Spacing.three,
    gap: Spacing.two,
    backgroundColor: Theme.background,
    borderTopWidth: 1,
    borderTopColor: Theme.inputBorder,
  },

  row: {
    flexDirection: "row",
    gap: Spacing.two,
  },

  button: {
    flex: 1,
    minHeight: 54,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  outline: {
    borderWidth: 1,
    borderColor: Theme.border,
    backgroundColor: Theme.backgroundElement,
  },

  primary: {
    flex: 1.6,
    backgroundColor: Theme.primary,
  },
});
