import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/shared/themed-text";
import { ThemedView } from "@/components/shared/themed-view";
import { Spacing, Theme } from "@/constants/theme";

import { initialForm, stepTitles, totalSteps } from "./constants";
import { registerPatient } from "./services/patient-registration-api";
import {
  HabitsStep,
  IstStep,
  ObstetricStep,
  PersonalStep,
  ReviewStep,
  SexualStep,
} from "./steps";
import { styles } from "./styles";
import type { PatientForm } from "./types";
import { validateForm, validateStep } from "./utils";

export function PatientRegistration() {
  const scrollRef = useRef<ScrollView>(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = <Key extends keyof PatientForm>(
    key: Key,
    value: PatientForm[Key],
  ) => {
    setError("");
    setForm((current) => ({ ...current, [key]: value }));
  };

  function goToStep(target: number) {
    setError("");
    setStep(target);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }

  function goBack() {
    if (step === 1) router.back();
    else goToStep(step - 1);
  }

  // Botão voltar do Android volta uma etapa em vez de sair do cadastro.
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (step === 1) return false;
        goToStep(step - 1);
        return true;
      },
    );
    return () => subscription.remove();
  });

  async function handleContinue() {
    if (step < totalSteps) {
      const stepError = validateStep(step, form);
      if (stepError) setError(stepError);
      else goToStep(step + 1);
      return;
    }

    const invalid = validateForm(form);
    if (invalid) {
      goToStep(invalid.step);
      setError(invalid.error);
      return;
    }

    setIsSubmitting(true);
    try {
      const id = await registerPatient(form);
      // Como no layout, abre a ficha da paciente recém-cadastrada.
      router.replace({
        pathname: "/patients/[id]",
        params: { id: String(id), created: "1" },
      });
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

  const buttonLabel = isSubmitting
    ? "Cadastrando..."
    : step === totalSteps
      ? "Cadastrar paciente"
      : "Continuar";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.screen}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <RegistrationHeader
            step={step}
            title={stepTitles[step - 1]}
            subtitle={
              step === 1 ? "NOVA PACIENTE" : form.name.trim().toUpperCase()
            }
            onBack={goBack}
          />
          {step === 1 && <PersonalStep form={form} update={update} />}
          {step === 2 && <ObstetricStep form={form} update={update} />}
          {step === 3 && <SexualStep form={form} update={update} />}
          {step === 4 && <IstStep form={form} update={update} />}
          {step === 5 && <HabitsStep form={form} update={update} />}
          {step === 6 && <ReviewStep form={form} onEdit={goToStep} />}
        </ScrollView>

        <View style={styles.footer}>
          {error ? (
            <ThemedText
              themeColor="error"
              type="small"
              accessibilityLiveRegion="polite"
              style={styles.error}
            >
              {error}
            </ThemedText>
          ) : null}
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: isSubmitting }}
            disabled={isSubmitting}
            onPress={handleContinue}
            style={({ pressed }) => [
              styles.continue,
              pressed && styles.pressed,
              isSubmitting && styles.disabled,
            ]}
          >
            <ThemedText
              themeColor="textPrimaryLight"
              style={styles.continueText}
            >
              {buttonLabel}
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

type RegistrationHeaderProps = {
  step: number;
  title: string;
  subtitle: string;
  onBack: () => void;
};

function RegistrationHeader({
  step,
  title,
  subtitle,
  onBack,
}: RegistrationHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Pressable onPress={onBack} accessibilityRole="button" hitSlop={8}>
          <View style={headerStyles.backButton}>
            <SymbolView
              name={
                step === 1
                  ? {
                      ios: "xmark",
                      android: "close",
                      web: "close",
                    }
                  : {
                      ios: "arrow.left",
                      android: "arrow_back",
                      web: "arrow_back",
                    }
              }
              tintColor={Theme.textSecondary}
              size={19}
            />
            <ThemedText type="code" themeColor="textSecondary">
              {step === 1 ? "CANCELAR" : "VOLTAR"}
            </ThemedText>
          </View>
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
        {subtitle}
      </ThemedText>
    </View>
  );
}

const headerStyles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
});
