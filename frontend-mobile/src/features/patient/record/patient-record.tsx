import { router, useFocusEffect } from "expo-router";
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

import { Spacing, Theme } from "@/constants/theme";
import { PillButton } from "@/components/shared/pill-button";
import { ThemedText } from "@/components/shared/themed-text";
import { ThemedView } from "@/components/shared/themed-view";

import { styles as registrationStyles } from "../registration/styles";
import { RecordFooter, RecordHeader } from "./components";
import { fetchPatient } from "./services/patient-record-api";
import {
  EditTab,
  HabitsTab,
  IstTab,
  ObstetricTab,
  PersonalTab,
  SexualTab,
  VisitsTab,
} from "./tabs";
import type { PatientRecord, RecordTab } from "./types";
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
  // Busca em andamento: "Editar dados" espera, para o rascunho não partir
  // da ficha antiga (ex.: com o status de antes da consulta).
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<RecordTab>(created ? "visits" : "personal");

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

  // Trocar de aba descarta a edição em andamento, como no layout.
  function changeTab(next: RecordTab) {
    edit.cancel();
    setTab(next);
  }

  // Durante a edição, o botão voltar do Android só cancela a edição.
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (!edit.editing) return false;
        edit.cancel();
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
      edit.cancel();
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
            <View>
              {tab !== "visits" && edit.draft ? (
                <EditTab tab={tab} form={edit.draft} update={edit.update} />
              ) : null}
              {!edit.editing && tab === "personal" && (
                <PersonalTab record={record} />
              )}
              {!edit.editing && tab === "obstetric" && (
                <ObstetricTab record={record} />
              )}
              {!edit.editing && tab === "sexual" && (
                <SexualTab record={record} />
              )}
              {!edit.editing && tab === "ist" && <IstTab record={record} />}
              {!edit.editing && tab === "habits" && (
                <HabitsTab record={record} />
              )}
              {tab === "visits" && (
                <VisitsTab
                  patientId={record.id}
                  patientName={record.form.name}
                  patientRecord={record.form.record}
                />
              )}
            </View>
          </ScrollView>

          {tab !== "visits" ? (
            <RecordFooter
              editing={edit.editing}
              loading={loading}
              saving={edit.saving}
              error={edit.error}
              onEdit={edit.start}
              onCancel={edit.cancel}
              onSave={() => edit.save(tab)}
            />
          ) : null}
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

});
