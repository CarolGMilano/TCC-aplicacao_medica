import { useEffect, useState, type ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Spacing, Theme } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";
import { ThemedView } from "@/components/shared/themed-view";

import { styles as registrationStyles } from "../registration/styles";
import { fetchDoctorName } from "./attendance-api";
import {
  AttendanceHeader,
  SaveButton,
  styles as componentStyles,
} from "./components";

// Estrutura comum das telas de novo registro: cabeçalho, campos e rodapé
// com o erro e o botão. Telas em passos (colposcopia) passam step, onBack e
// o rótulo do botão de cada passo.
export function AttendanceForm({
  title,
  error,
  saving,
  onSave,
  children,
  step,
  onBack,
  buttonLabel = "Salvar registro",
}: {
  title: string;
  error: string;
  saving: boolean;
  onSave: () => void;
  children: ReactNode;
  step?: { current: number; total: number };
  onBack?: () => void;
  buttonLabel?: string;
}) {
  const [doctor, setDoctor] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchDoctorName()
      .then((name) => {
        if (active) setDoctor(name);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return (
    <SafeAreaView style={componentStyles.screen} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={componentStyles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <AttendanceHeader title={title} onBack={onBack} />
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
        <ScrollView
          // Cada passo começa do topo.
          key={step?.current}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.meta}>
            <View style={styles.metaCell}>
              <ThemedText type="code" themeColor="textSecondary">
                ÚLTIMA EDIÇÃO
              </ThemedText>
              <ThemedText>—</ThemedText>
            </View>
            <View style={styles.metaCell}>
              <ThemedText type="code" themeColor="textSecondary">
                MÉDICO RESPONSÁVEL
              </ThemedText>
              <ThemedText>{doctor ?? "—"}</ThemedText>
            </View>
          </View>
          {children}
        </ScrollView>
        <View style={styles.footer}>
          {error ? (
            <ThemedText
              type="small"
              themeColor="error"
              accessibilityLiveRegion="polite"
              style={registrationStyles.error}
            >
              {error}
            </ThemedText>
          ) : null}
          <SaveButton
            label={saving ? "Salvando..." : buttonLabel}
            onPress={onSave}
            disabled={saving}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 120 },

  progress: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },

  meta: {
    flexDirection: "row",
    gap: Spacing.three,
    padding: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
    backgroundColor: Theme.backgroundMeta,
  },

  metaCell: { flex: 1, gap: Spacing.one },

  footer: {
    padding: Spacing.three,
    gap: Spacing.two,
    backgroundColor: Theme.background,
  },
});
