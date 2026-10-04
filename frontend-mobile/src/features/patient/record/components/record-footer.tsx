import { Pressable, StyleSheet, View } from "react-native";

import { Spacing, Theme, Typography } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

import { styles as registrationStyles } from "../../registration/styles";

type RecordFooterProps = {
  editing: boolean;
  saving: boolean;
  error: string;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
};

// Rodapé das abas de dados: "Editar dados", ou "Cancelar" e "Salvar alterações".
export function RecordFooter({
  editing,
  saving,
  error,
  onEdit,
  onCancel,
  onSave,
}: RecordFooterProps) {
  return (
    <View style={registrationStyles.footer}>
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
            <ThemedText style={styles.label}>Cancelar</ThemedText>
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
            <ThemedText themeColor="textPrimaryLight" style={styles.label}>
              {saving ? "Salvando..." : "Salvar alterações"}
            </ThemedText>
          </Pressable>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          onPress={onEdit}
          style={[styles.button, styles.outline]}
        >
          <ThemedText style={styles.label}>Editar dados</ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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

  label: {
    fontWeight: Typography.weights.bold,
  },
});
