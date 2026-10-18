import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  KeyboardAvoidingView,
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
import { fitAgesToPatient, validateForm, validateStep } from "./utils";

export function PatientRegistration() {
  const scrollRef = useRef<ScrollView>(null);
  // Hora da última troca de etapa, para ignorar o 2º toque de um toque duplo.
  const stepChangedAt = useRef(0);
  const [step, setStep] = useState(1);
  const [fromReview, setFromReview] = useState(false);
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

  function goToStep(target: number, openedFromReview = false) {
    setError("");
    setStep(target);
    setFromReview(openedFromReview);
    stepChangedAt.current = Date.now();
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }

  // Só a etapa 1 aberta normalmente sai do cadastro. Aberta pela revisão
  // (ALTERAR), voltar leva de novo à revisão.
  const leavesOnBack = step === 1 && !fromReview;

  function goBack() {
    if (leavesOnBack) router.back();
    else goToStep(step === 1 ? totalSteps : step - 1);
  }

  // Botão voltar do Android volta uma etapa em vez de sair do cadastro e, se
  // já houver dados, pergunta antes de descartar.
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (!leavesOnBack) {
          goBack();
          return true;
        }
        if (JSON.stringify(form) === JSON.stringify(initialForm)) return false;
        Alert.alert(
          "Descartar o cadastro?",
          "Os dados preenchidos serão perdidos.",
          [
            { text: "Continuar editando", style: "cancel" },
            {
              text: "Descartar",
              style: "destructive",
              onPress: () => router.back(),
            },
          ],
        );
        return true;
      },
    );
    return () => subscription.remove();
  });

  async function handleContinue() {
    // O botão fica no mesmo lugar em todas as etapas: sem isso, o 2º toque
    // pularia uma etapa ou cadastraria sem passar pela revisão.
    if (Date.now() - stepChangedAt.current < 400) return;

    if (step < totalSteps) {
      const stepError = validateStep(step, form);
      if (stepError) {
        setError(stepError);
        return;
      }
      if (step === 1) setForm(fitAgesToPatient);
      goToStep(step + 1);
      return;
    }

    const invalid = validateForm(form);
    if (invalid) {
      goToStep(invalid.step, true);
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
      {/* "padding" também no Android: com o edge-to-edge, a tela não encolhe
          quando o teclado abre, e o rodapé ficaria atrás dele. */}
      <KeyboardAvoidingView style={styles.screen} behavior="padding">
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
              cancel={leavesOnBack}
              onBack={goBack}
            />
            {step === 1 && <PersonalStep form={form} update={update} />}
            {step === 2 && <ObstetricStep form={form} update={update} />}
            {step === 3 && <SexualStep form={form} update={update} />}
            {step === 4 && <IstStep form={form} update={update} />}
            {step === 5 && <HabitsStep form={form} update={update} />}
            {step === 6 && (
              <ReviewStep
                form={form}
                onEdit={(target) => goToStep(target, true)}
              />
            )}
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
              <ThemedText type="button" themeColor="textPrimaryLight">
                {buttonLabel}
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type RegistrationHeaderProps = {
  step: number;
  title: string;
  subtitle: string;
  cancel: boolean;
  onBack: () => void;
};

function RegistrationHeader({
  step,
  title,
  subtitle,
  cancel,
  onBack,
}: RegistrationHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Pressable onPress={onBack} accessibilityRole="button" hitSlop={8}>
          <View style={headerStyles.backButton}>
            <SymbolView
              name={
                cancel
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
              {cancel ? "CANCELAR" : "VOLTAR"}
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
