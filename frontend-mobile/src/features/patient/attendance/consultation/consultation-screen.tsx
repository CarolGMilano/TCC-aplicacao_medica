import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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

import {
  AttendanceHeader,
  DateInput,
  LabeledInput,
  SaveButton,
  styles as formStyles,
} from "../components";
import { createConsultation } from "./consultation-api";
import type { ConsultationForm } from "../types";
import { toIsoDate, todayParts, type DateParts } from "../utils";
import { OptionRow } from "../../registration/components";
import { statusMap, statusOptions } from "../../registration/constants";
import { styles as registrationStyles } from "../../registration/styles";
import { statusColors } from "../../record/constants";
import {
  fetchPatient,
  updatePatientStatus,
} from "../../record/services/patient-record-api";

const statusLabels = Object.fromEntries(
  Object.entries(statusMap).map(([label, value]) => [value, label]),
);

function currentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes(),
  ).padStart(2, "0")}`;
}

export function ConsultationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [form, setForm] = useState<ConsultationForm>(() => ({
    date: todayParts(),
    time: currentTime(),
    observation: "",
  }));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("Aguardando procedimento");

  useEffect(() => {
    let active = true;

    fetchPatient(String(id))
      .then((patient) => {
        if (active) setStatus(statusLabels[patient.status] ?? patient.status);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Não foi possível carregar o status da paciente.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  async function changeStatus(nextStatus: string) {
    const previousStatus = status;
    setStatus(nextStatus);
    try {
      await updatePatientStatus(Number(id), nextStatus);
    } catch (statusError) {
      setStatus(previousStatus);
      setError(
        statusError instanceof Error
          ? statusError.message
          : "Não foi possível alterar o status da paciente.",
      );
    }
  }

  async function save() {
    const date = toIsoDate(form.date);
    if (!date) {
      setError("Informe uma data válida, entre 01/01/1900 e hoje.");
      return;
    }
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(form.time)) {
      setError("Informe um horário válido no formato HH:MM.");
      return;
    }
    // O web grava a consulta com a data e a hora do momento do registro.
    if (date === toIsoDate(todayParts()) && form.time > currentTime()) {
      setError("O horário não pode ser no futuro.");
      return;
    }
    if (!form.observation.trim()) {
      setError("Informe a observação da consulta.");
      return;
    }
    setSaving(true);
    try {
      await createConsultation({
        idPaciente: Number(id),
        dataHora: `${date}T${form.time}:00`,
        observacao: form.observation.trim(),
      });
      router.back();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a consulta.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={formStyles.screen} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={formStyles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <AttendanceHeader title="Nova consulta" />
        <ScrollView contentContainerStyle={styles.content}>
          <OptionRow
            label="STATUS DA PACIENTE"
            value={status}
            options={statusOptions}
            actionLabel="ALTERAR"
            dotColor={statusColors[status]?.text}
            onChange={changeStatus}
          />
          <DateInput
            label="DATA DO REGISTRO"
            values={form.date}
            onChange={(index, value) => {
              const date = [...form.date] as DateParts;
              date[index] = value;
              setForm({ ...form, date });
            }}
          />
          <LabeledInput
            label="HORÁRIO"
            value={form.time}
            onChangeText={(time) => setForm({ ...form, time })}
            placeholder="HH:MM"
          />
          <LabeledInput
            label="OBSERVAÇÃO"
            value={form.observation}
            onChangeText={(observation) => setForm({ ...form, observation })}
            multiline
            placeholder="Descreva a consulta..."
          />
        </ScrollView>
        <View style={styles.footer}>
          {error ? (
            <ThemedText
              type="small"
              themeColor="error"
              style={registrationStyles.error}
            >
              {error}
            </ThemedText>
          ) : null}
          <SaveButton
            label="Salvar consulta"
            onPress={save}
            disabled={saving}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 120 },

  footer: {
    padding: Spacing.three,
    gap: Spacing.two,
    backgroundColor: Theme.background,
  },
});
