import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Spacing, Theme } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";
import { ThemedView } from "@/components/shared/themed-view";

import { styles as registrationStyles } from "../registration/styles";
import { RecordHeader } from "./components";
import { fetchPatient } from "./services/patient-record-api";
import {
  HabitsTab,
  IstTab,
  ObstetricTab,
  PersonalTab,
  SexualTab,
  VisitsTab,
} from "./tabs";
import type { PatientRecord, RecordTab } from "./types";
import { toPatientRecord } from "./utils";

type PatientRecordScreenProps = {
  id: string;
  // Recém-cadastrada: abre em Atendimentos com o selo "Cadastrada".
  created: boolean;
};

export function PatientRecordScreen({ id, created }: PatientRecordScreenProps) {
  const [record, setRecord] = useState<PatientRecord | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<RecordTab>(created ? "visits" : "personal");

  // Mudar a chave dispara uma nova busca (botão "Tentar de novo").
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

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
      });

    // Ignora a resposta se a tela fechar antes de ela chegar.
    return () => {
      active = false;
    };
  }, [id, attempt]);

  function retry() {
    setError("");
    setAttempt((current) => current + 1);
  }

  // Volta para a lista sem empilhar outra tela de pacientes.
  const goToPatients = () => router.navigate("/patients");

  if (!record) {
    return (
      <SafeAreaView style={registrationStyles.safeArea}>
        <ThemedView style={styles.centered}>
          {error ? (
            <>
              <ThemedText themeColor="error" style={styles.centeredText}>
                {error}
              </ThemedText>
              <Pressable onPress={retry} accessibilityRole="button">
                <ThemedText type="code">TENTAR DE NOVO</ThemedText>
              </Pressable>
              <Pressable onPress={goToPatients} accessibilityRole="button">
                <ThemedText type="code" themeColor="textSecondary">
                  ←  PACIENTES
                </ThemedText>
              </Pressable>
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
      <ThemedView style={registrationStyles.screen}>
        <ScrollView
          contentContainerStyle={registrationStyles.content}
          showsVerticalScrollIndicator={false}
        >
          <RecordHeader
            record={record}
            tab={tab}
            created={created}
            onBack={goToPatients}
            onTabChange={setTab}
          />
          <View>
            {tab === "personal" && <PersonalTab record={record} />}
            {tab === "obstetric" && <ObstetricTab record={record} />}
            {tab === "sexual" && <SexualTab record={record} />}
            {tab === "ist" && <IstTab record={record} />}
            {tab === "habits" && <HabitsTab record={record} />}
            {tab === "visits" && <VisitsTab created={created} />}
          </View>
        </ScrollView>
      </ThemedView>
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
