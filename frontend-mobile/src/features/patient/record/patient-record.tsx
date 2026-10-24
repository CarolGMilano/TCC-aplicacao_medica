import { router, useFocusEffect, useNavigation } from "expo-router";
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
import { RecordFooter, RecordHeader } from "./components";
import { fetchPatient } from "./services/patient-record-api";
import { EditTab, HistoryTab, VisitsTab } from "./tabs";
import type { DataTab, PatientRecord, RecordTab } from "./types";
import { useRecordEdit } from "./use-record-edit";
import { toPatientRecord } from "./utils";

type PatientRecordScreenProps = {
  id: string;
  // Recém-cadastrada: abre em Atendimentos com o selo "Cadastrada".
  created: boolean;
};

export function PatientRecordScreen({ id, created }: PatientRecordScreenProps) {
  const [record, setRecord] = useState<PatientRecord | null>(null);
  const [error, setError] = useState("");
  // Busca em andamento: "Editar" espera, para o rascunho não partir da ficha
  // antiga (ex.: com o status de antes da consulta).
  const [loading, setLoading] = useState(false);
  // Abre no Histórico clínico; recém-cadastrada abre em Atendimentos.
  const [tab, setTab] = useState<RecordTab>(created ? "visits" : "history");
  const [editing, setEditing] = useState<DataTab>("personal");

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
  const section = edit.editing ? editing : null;
  function startEdit(next: DataTab) {
    if (loading) return;
    setEditing(next);
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

  // Volta para a lista que já está na pilha, sem abrir outra. Se a ficha veio
  // de outra tela (ex.: "Ver todas" do Dashboard), a lista entra no lugar dela.
  // Durante a edição, só cancela, como o voltar do Android; salvando, espera.
  function goToPatients() {
    if (edit.saving) return;
    if (edit.editing) {
      leaveEdit();
      return;
    }
    router.dismissTo("/patients");
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
              <PillButton label="Pacientes" onPress={goToPatients} />
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
              onBack={goToPatients}
              onTabChange={changeTab}
            />
            <View style={styles.content}>
              {/* Editando um bloco: só o formulário dele, com as regras do
                  cadastro. */}
              {section && edit.draft ? (
                <EditTab tab={section} form={edit.draft} update={edit.update} />
              ) : null}
              {!edit.editing && tab === "history" && (
                <HistoryTab record={record} onEdit={startEdit} />
              )}
              {!edit.editing && tab === "visits" && (
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
