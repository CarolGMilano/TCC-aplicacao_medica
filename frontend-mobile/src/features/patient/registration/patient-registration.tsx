import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/shared/themed-text";
import { ThemedView } from "@/components/shared/themed-view";

import {
  contraceptionMap,
  initialForm,
  istMap,
  smokingMap,
  statusMap,
  stepTitles,
  totalSteps,
} from "./constants";

import type { PatientForm } from "./types";
import { styles } from "./styles";
import {
  HabitsStep,
  IstStep,
  ObstetricStep,
  PersonalStep,
  ReviewStep,
  SexualStep,
} from "./steps";
import { registerPatient } from "./services/patient-registration-api";

export function PatientRegistration() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = <Key extends keyof PatientForm>(
    key: Key,
    value: PatientForm[Key],
  ) => setForm((current) => ({ ...current, [key]: value }));

  async function nextStep() {
    if (step < totalSteps) {
      setStep((current) => current + 1);
      return;
    }

    if (
      !form.name.trim() ||
      !form.record.trim() ||
      !form.birthDay ||
      !form.birthMonth ||
      !form.birthYear
    ) {
      setError("Preencha nome, data de nascimento e prontuário.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await registerPatient({
        paciente: {
          nome: form.name,
          dataNascimento: `${form.birthYear}-${form.birthMonth.padStart(2, "0")}-${form.birthDay.padStart(2, "0")}`,
          prontuario: form.record,
          status: statusMap[form.status] ?? "AGUARDANDO_PROCEDIMENTO",
        },
        dadosGinecoObstetricos: {
          numGestacao: form.pregnancies,
          numPartoNormal: form.vaginalBirths,
          numCesariana: form.cesareans,
          numAborto: form.abortions,
          menarca: form.menarche,
          menopausa: null,
        },
        saudeSexual: {
          sexarca: form.sexarche,
          mac: contraceptionMap[form.contraception] ?? "NENHUM",
          numParceiros: form.partners,
          vvs: form.multiplePartners,
        },
        historicoTabagismo: {
          cigarrosDia: form.cigarettesPerDay,
          idadeInicio: form.smokingStart,
          idadeFim: form.smokingEnd,
          fumante: smokingMap[form.smoking] ?? "NAO_FUMANTE",
        },
        historicoIst: [
          {
            ist: istMap[form.ist] ?? "NENHUMA",
            condilomaHpv: form.hpvWart,
          },
        ],
      });
      router.replace("/patients");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível cadastrar a paciente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <RegistrationHeader
            step={step}
            title={stepTitles[step - 1]}
            patientName={form.name || "NOVA PACIENTE"}
            onBack={() =>
              step === 1 ? router.back() : setStep((current) => current - 1)
            }
          />
          {step === 1 && <PersonalStep form={form} update={update} />}
          {step === 2 && <ObstetricStep form={form} update={update} />}
          {step === 3 && <SexualStep form={form} update={update} />}
          {step === 4 && <IstStep form={form} update={update} />}
          {step === 5 && <HabitsStep form={form} update={update} />}
          {step === 6 && <ReviewStep form={form} />}
          {error ? (
            <ThemedText themeColor="error" style={styles.error}>
              {error}
            </ThemedText>
          ) : null}
        </ScrollView>
        <Pressable
          accessibilityRole="button"
          disabled={isSubmitting}
          onPress={nextStep}
          style={({ pressed }) => [styles.continue, pressed && styles.pressed]}
        >
          <ThemedText themeColor="textPrimaryLight" style={styles.continueText}>
            {isSubmitting
              ? "Cadastrando..."
              : step === totalSteps
                ? "Cadastrar paciente"
                : "Continuar"}
          </ThemedText>
        </Pressable>
      </ThemedView>
    </SafeAreaView>
  );
}

function RegistrationHeader({
  step,
  title,
  patientName,
  onBack,
}: {
  step: number;
  title: string;
  patientName: string;
  onBack: () => void;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Pressable onPress={onBack} accessibilityRole="button">
          <ThemedText type="code" themeColor="textSecondary">
            {step === 1 ? "×  CANCELAR" : "←  VOLTAR"}
          </ThemedText>
        </Pressable>
        <ThemedText type="code" themeColor="textSecondary">
          ETAPA {step} DE {totalSteps}
        </ThemedText>
      </View>
      <View style={styles.progress}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <ThemedView
            key={index}
            type={index < step ? "primary" : "border"}
            style={styles.progressSegment}
          />
        ))}
      </View>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText type="code" themeColor="textSecondary">
        {patientName}
      </ThemedText>
    </View>
  );
}
