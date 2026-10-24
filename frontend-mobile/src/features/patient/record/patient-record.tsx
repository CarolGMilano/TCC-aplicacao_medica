import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { confirmDiscard } from "@/components/shared/discard-dialog";

import { Spacing, Theme } from "@/constants/theme";
import { PillButton } from "@/components/shared/pill-button";
import { ThemedText } from "@/components/shared/themed-text";
import { ThemedView } from "@/components/shared/themed-view";

import { styles as registrationStyles } from "../registration/styles";
import { validateStep } from "../registration/utils";
import { RecordFooter, RecordHeader } from "./components";
import { tabSteps } from "./constants";
import { fetchPatient } from "./services/patient-record-api";
import { EditTab, HistoryTab, VisitsTab } from "./tabs";
import type { DataTab, PatientRecord, RecordTab } from "./types";
import { useRecordEdit } from "./use-record-edit";
import { toPatientRecord } from "./utils";

type PatientRecordScreenProps = {
  id: string;
  // Recém-cadastrada: abre em Dados clínicos com o selo "Cadastrada".
  created: boolean;
};

export function PatientRecordScreen({ id, created }: PatientRecordScreenProps) {
  const [record, setRecord] = useState<PatientRecord | null>(null);
  const [error, setError] = useState("");
  // Busca em andamento: "Editar" espera, para o rascunho não partir da ficha
  // antiga (ex.: com o status de antes da consulta).
  const [loading, setLoading] = useState(false);
  // Abre em Dados pessoais; recém-cadastrada abre em Dados clínicos.
  const [tab, setTab] = useState<RecordTab>(created ? "clinical" : "personal");
  // Voltando de um registro salvo ("saved" muda a cada salvamento), mostra
  // Dados clínicos, mesmo que o ＋ tenha sido tocado em outra aba.
  const { saved } = useLocalSearchParams<{ saved?: string }>();
  const [handledSave, setHandledSave] = useState(saved);
  if (saved !== handledSave) {
    setHandledSave(saved);
    if (saved) setTab("clinical");
  }

  const loadRecord = useCallback(() => {
    let active = true;
    setLoading(true);

    fetchPatient(id)
      .then((detail) => {
        if (active) setRecord(toPatientRecord(detail));
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Não foi possível carregar a ficha da paciente.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    // Ignora a resposta se a tela sair de foco antes de ela chegar.
    return () => {
      active = false;
    };
  }, [id]);

  // Busca de novo sempre que a ficha volta a aparecer (ex.: depois de uma
  // consulta que trocou o status). A ficha atual fica na tela enquanto isso.
  useFocusEffect(loadRecord);

  function reload() {
    setError("");
    loadRecord();
  }

  // Atualiza a ficha sem a tela de carregando; se falhar, mantém a atual.
  async function refresh() {
    try {
      setRecord(toPatientRecord(await fetchPatient(id)));
    } catch {}
  }

  const edit = useRecordEdit(record, reload, refresh);

  // Bloco do histórico em edição. Enquanto a ficha recarrega, espera, para o
  // rascunho não partir de dados antigos.
  const section: DataTab | null =
    edit.editing && tab !== "clinical" ? tab : null;
  function startEdit() {
    if (loading) return;
    edit.start();
  }

  // Sai da edição; com alterações feitas, pergunta antes de descartá-las.
  function leaveEdit(then?: () => void) {
    if (!edit.dirty) {
      edit.cancel();
      then?.();
      return;
    }
    confirmDiscard({
      onDiscard: () => {
        edit.cancel();
        then?.();
      },
    });
  }

  // Trocar de aba descarta a edição em andamento, como no layout.
  function changeTab(next: RecordTab) {
    leaveEdit(() => setTab(next));
  }

  // Durante a edição, o botão voltar do Android só cancela a edição. O
  // BackHandler é global: com um registro aberto por cima, a ficha não reage.
  const navigation = useNavigation();
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (!navigation.isFocused() || !edit.editing) return false;
        if (!edit.saving) leaveEdit();
        return true;
      },
    );
    return () => subscription.remove();
  });

  // Volta para a tela de onde a ficha foi aberta (Dashboard, lista...).
  // Recém-cadastrada vai para a lista, sem voltar ao cadastro. Durante a
  // edição, só cancela, como o voltar do Android; salvando, espera.
  function goBack() {
    if (edit.saving) return;
    if (edit.editing) {
      leaveEdit();
      return;
    }
    if (!created && router.canGoBack()) router.back();
    else router.dismissTo("/patients");
  }

  if (!record) {
    return (
      <SafeAreaView style={registrationStyles.safeArea}>
        <ThemedView style={styles.centered}>
          {error ? (
            <>
              <ThemedText themeColor="error" style={styles.centeredText}>
                {error}
              </ThemedText>
              <Pressable onPress={reload} accessibilityRole="button">
                <ThemedText type="code">Tentar de novo</ThemedText>
              </Pressable>
              <PillButton label="Voltar" onPress={goBack} />
            </>
          ) : (
            <ActivityIndicator color={Theme.primary} />
          )}
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={registrationStyles.safeArea}>
      {/* Mantém o rodapé acima do teclado, também no Android. */}
      <KeyboardAvoidingView
        style={registrationStyles.screen}
        behavior="padding"
      >
        <ThemedView style={registrationStyles.screen}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <RecordHeader
              record={record}
              tab={tab}
              created={created}
              editing={edit.editing}
              onBack={goBack}
              onTabChange={changeTab}
            />
            <View style={styles.content}>
              {/* Editando um bloco: só o formulário dele, com as regras do
                  cadastro. */}
              {section && edit.draft ? (
                <EditTab tab={section} form={edit.draft} update={edit.update} />
              ) : null}
              {!edit.editing && tab !== "clinical" && (
                <HistoryTab record={record} tab={tab} />
              )}
              {!edit.editing && tab === "clinical" && (
                <VisitsTab
                  patientId={record.id}
                  patientName={record.form.name}
                  patientRecord={record.form.record}
                />
              )}
            </View>
          </ScrollView>

          <RecordFooter
            editing={edit.editing}
            saving={edit.saving}
            error={edit.error}
            onCancel={() => leaveEdit()}
            onSave={() => section && edit.save(section)}
            onEdit={tab === "clinical" ? undefined : startEdit}
            // Mesmas regras do salvar: bloco ainda sem registro não conta
            // os valores iniciais como gravados.
            invalid={
              section !== null &&
              edit.draft !== null &&
              validateStep(
                tabSteps[section],
                edit.draft,
                section !== "personal" && record.missing[section]
                  ? undefined
                  : record.form,
              ) !== null
            }
            onNewRecord={() =>
              router.push({
                pathname: "/patients/[id]/new-record",
                params: {
                  id: String(record.id),
                  name: record.form.name,
                  record: record.form.record,
                },
              })
            }
          />
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.three,
    padding: Spacing.four,
  },

  centeredText: {
    textAlign: "center",
  },

  content: {
    paddingBottom: Spacing.four,
  },
});
