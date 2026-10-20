import { useLocalSearchParams, useNavigation } from "expo-router";
import { StackActions } from "expo-router/react-navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  BackHandler,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Spacing, Theme } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

import { formatDate } from "../record/services/visits-api";
import type { VisitType } from "../record/types";
import { FormFields } from "../registration/components/step-section";
import { styles as registrationStyles } from "../registration/styles";
import { fetchDoctorName } from "./attendance-api";
import {
  AttendanceHeader,
  SaveButton,
  styles as componentStyles,
  type AttendanceMode,
} from "./components";

// Depois de salvar, volta para a ficha (aba Atend.) já no filtro do tipo
// salvo. "saved" muda a cada salvamento, para o filtro ser reaplicado mesmo
// quando o tipo se repete; merge preserva os outros parâmetros da ficha
// (como "created"). Se a tela foi fechada durante o envio, não navega.
export function useReturnToVisits(filter: VisitType) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return useCallback(() => {
    if (!mounted.current) return;
    navigation.dispatch(
      StackActions.popTo(
        "patients/[id]",
        { id, filter, saved: String(Date.now()) },
        { merge: true },
      ),
    );
  }, [navigation, id, filter]);
}

// Estrutura comum das telas de registro: cabeçalho, campos e rodapé com o
// erro e o botão. Telas em passos (colposcopia) passam step, onBack e o
// rótulo do botão de cada passo. Num registro salvo (saved), a faixa do topo
// mostra a última edição e o médico do registro; sem onSave, não há botão.
export function AttendanceForm({
  title,
  error = "",
  saving = false,
  onSave,
  children,
  step,
  onBack,
  buttonLabel = "Salvar registro",
  mode = "new",
  saved,
  sectioned = false,
}: {
  title: string;
  error?: string;
  saving?: boolean;
  onSave?: () => void;
  children: ReactNode;
  step?: { current: number; total: number };
  onBack?: () => void;
  buttonLabel?: string;
  mode?: AttendanceMode;
  saved?: { nomeMedico: string; dataEdicao?: string | null };
  // Telas que já dividem os campos em seções (StepSection), como a
  // colposcopia; as outras recebem o mesmo espaçamento aqui.
  sectioned?: boolean;
}) {
  const [doctor, setDoctor] = useState<string | null>(null);
  const isSaved = Boolean(saved);

  // O médico logado só é o responsável num registro novo.
  useEffect(() => {
    if (isSaved) return;
    let active = true;
    fetchDoctorName()
      .then((name) => {
        if (active) setDoctor(name);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [isSaved]);

  // Voltar do Android: travado enquanto salva; nas telas em passos, volta um
  // passo em vez de fechar (mesmo padrão do cadastro de paciente).
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (saving) return true;
        if (!onBack) return false;
        onBack();
        return true;
      },
    );
    return () => subscription.remove();
  }, [saving, onBack]);

  return (
    <SafeAreaView style={componentStyles.screen} edges={["top", "bottom"]}>
      {/* "padding" também no Android: com o edge-to-edge, a tela não encolhe
          quando o teclado abre, e o rodapé ficaria atrás dele. */}
      <KeyboardAvoidingView style={componentStyles.screen} behavior="padding">
        <AttendanceHeader
          title={title}
          onBack={onBack}
          disabled={saving}
          step={step}
          mode={mode}
          // Registro novo: o médico logado aparece junto da paciente, e a
          // faixa de última edição (ainda vazia) não é mostrada.
          doctor={isSaved ? null : doctor}
        />
        <ScrollView
          // Cada passo começa do topo.
          key={step?.current}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {saved ? (
            <View style={styles.meta}>
              <View style={styles.metaCell}>
                <ThemedText type="code" themeColor="textSecondary">
                  Última edição
                </ThemedText>
                <ThemedText>
                  {saved.dataEdicao ? formatDate(saved.dataEdicao) : "—"}
                </ThemedText>
              </View>
              <View style={styles.metaCell}>
                <ThemedText type="code" themeColor="textSecondary">
                  Médico responsável
                </ThemedText>
                <ThemedText>{saved.nomeMedico || "—"}</ThemedText>
              </View>
            </View>
          ) : null}
          {sectioned ? children : <FormFields>{children}</FormFields>}
        </ScrollView>
        {/* Consulta salva: só leitura, sem rodapé. */}
        {onSave || error ? (
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
            {onSave ? (
              <SaveButton
                label={saving ? "Salvando..." : buttonLabel}
                onPress={onSave}
                disabled={saving}
                outline={mode === "view"}
              />
            ) : null}
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 120 },

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
