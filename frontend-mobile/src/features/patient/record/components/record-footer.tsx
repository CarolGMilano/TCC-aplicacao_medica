import { Pressable, StyleSheet, View } from "react-native";

import { Spacing, Theme, Typography } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

import { styles as registrationStyles } from "../../registration/styles";

type RecordFooterProps = {
  editing: boolean;
  saving: boolean;
  error: string;
  onCancel: () => void;
  onSave: () => void;
  onNewRecord: () => void;
  // Abas de dados do cadastro: "Editar dados" e o ＋ redondo do novo
  // registro. Sem onEdit (Dados clínicos), só "+ Novo registro".
  onEdit?: () => void;
  // Bloco em edição com campo obrigatório vazio ou inválido.
  invalid?: boolean;
};

// Rodapé fixo da ficha; durante a edição de um bloco, "Cancelar" e "Salvar
// alterações".
export function RecordFooter({
  editing,
  saving,
  error,
  onCancel,
  onSave,
  onNewRecord,
  onEdit,
  invalid = false,
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
            accessibilityState={{ disabled: saving || invalid }}
            disabled={saving || invalid}
            onPress={onSave}
            style={({ pressed }) => [
              styles.button,
              styles.primary,
              pressed && registrationStyles.pressed,
              (saving || invalid) && registrationStyles.disabled,
            ]}
          >
            <ThemedText themeColor="textPrimaryLight" type="button">
              {saving ? "Salvando..." : "Salvar alterações"}
            </ThemedText>
          </Pressable>
        </View>
      ) : onEdit ? (
        <View style={styles.row}>
          <Pressable
            accessibilityRole="button"
            onPress={onEdit}
            style={({ pressed }) => [
              styles.button,
              styles.primary,
              pressed && registrationStyles.pressed,
            ]}
          >
            <ThemedText themeColor="textPrimaryLight" type="button">
              Editar dados
            </ThemedText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Adicionar novo registro"
            onPress={onNewRecord}
            style={({ pressed }) => [
              styles.round,
              pressed && registrationStyles.pressed,
            ]}
          >
            <ThemedText style={styles.plus}>＋</ThemedText>
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

  round: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Theme.primary,
    backgroundColor: Theme.backgroundElement,
  },

  plus: {
    color: Theme.primary,
    fontSize: Typography.sizes.greeting,
    lineHeight: Typography.lineHeights.greeting,
  },
});
