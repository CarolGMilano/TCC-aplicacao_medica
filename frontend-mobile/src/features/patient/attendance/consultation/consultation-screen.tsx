import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
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
import { useDiscardGuard } from "../attendance-form";
import { createConsultation } from "./consultation-api";
import { SavedVisit } from "../saved-visit";
import { ConsultationDetails } from "../visit-details";
import type { ConsultationForm } from "../types";
import { toIsoDate, todayParts } from "../utils";
import {
  FieldRow,
  FormFields,
  OptionRow,
} from "../../registration/components";
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

// Consulta salva só pode ser vista: o backend não tem edição de consulta.
export function ConsultationScreen() {
  return (
    <SavedVisit
      type="consultations"
      title="Consulta"
      details={(item) => <ConsultationDetails item={item} />}
    >
      {() => <NewConsultation />}
    </SavedVisit>
  );
}

function NewConsultation() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [form, setForm] = useState<ConsultationForm>(() => ({
    date: todayParts(),
    time: currentTime(),
    observation: "",
  }));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  // A observação é o conteúdo da consulta: escrita e não salva, pede
  // confirmação antes de sair.
  useDiscardGuard(form.observation.trim() !== "", saving);
  const [status, setStatus] = useState("Aguardando procedimento");
  // A carga inicial não sobrescreve um status que o médico já alterou aqui.
  const statusChanged = useRef(false);
  const loadedStatus = useRef<string | null>(null);

  useEffect(() => {
    let active = true;

    fetchPatient(String(id))
      .then((patient) => {
        if (!active) return;
        const label = statusLabels[patient.status] ?? patient.status;
        loadedStatus.current = label;
        if (!statusChanged.current) setStatus(label);
      })
      .catch((requestError: unknown) => {
        if (active && !statusChanged.current) {
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
    const previouslyChanged = statusChanged.current;
    statusChanged.current = true;
    setError("");
    setStatus(nextStatus);
    try {
      await updatePatientStatus(Number(id), nextStatus);
    } catch (statusError) {
      statusChanged.current = previouslyChanged;
      setStatus(
        !previouslyChanged && loadedStatus.current
          ? loadedStatus.current
          : previousStatus,
      );
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
      // Só no erro: liberar a trava antes de a tela fechar fazia o aviso de
      // descarte aparecer depois de salvar.
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={formStyles.screen} edges={["top", "bottom"]}>
      {/* "padding" também no Android: com o edge-to-edge, a tela não encolhe
          quando o teclado abre, e o rodapé ficaria atrás dele. */}
      <KeyboardAvoidingView style={formStyles.screen} behavior="padding">
        <AttendanceHeader title="Nova consulta" />
        <ScrollView contentContainerStyle={styles.content}>
          <FormFields>
            <OptionRow
              label="Status da paciente"
              value={status}
              options={statusOptions}
              actionLabel="Alterar"
              dotColor={statusColors[status]?.text}
              onChange={changeStatus}
            />
            <FieldRow>
              <DateInput
                label="Data do registro"
                values={form.date}
                onChange={(date) => setForm({ ...form, date })}
              />
              <LabeledInput
                label="Horário"
                value={form.time}
                onChangeText={(time) => setForm({ ...form, time })}
                placeholder="HH:MM"
              />
            </FieldRow>
            <LabeledInput
              label="Observação"
              value={form.observation}
              onChangeText={(observation) =>
                setForm({ ...form, observation })
              }
              multiline
              placeholder="Descreva a consulta..."
            />
          </FormFields>
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
