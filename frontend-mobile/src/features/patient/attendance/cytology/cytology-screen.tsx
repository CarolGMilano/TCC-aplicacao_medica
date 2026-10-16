import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/shared/themed-text";

import { AttendanceHeader, DateInput, LabeledInput, SaveButton, styles as formStyles } from "../components";
import { OptionRow } from "../../registration/components";
import { createCytology } from "./cytology-api";
import { cytologyLabels } from "../../record/constants";
import type { CytologyForm } from "../types";

const results = Object.keys(cytologyLabels);

export function CytologyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const now = new Date();
  const [form, setForm] = useState<CytologyForm>({
    day: String(now.getDate()).padStart(2, "0"),
    month: String(now.getMonth() + 1).padStart(2, "0"),
    year: String(now.getFullYear()),
    result: "ADENOCARCINOMA_SOE",
    observation: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    if (!form.day || !form.month || !form.year || !form.result) {
      setError("Preencha a data e o resultado.");
      return;
    }
    setSaving(true);
    try {
      await createCytology({
        idPaciente: Number(id),
        dataRegistro: `${form.year}-${form.month}-${form.day}`,
        resultado: form.result,
        observacao: form.observation.trim() || "",
      });
      router.back();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Não foi possível salvar a citologia.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={formStyles.screen} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={formStyles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <AttendanceHeader title="Nova citologia" />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.meta}>
            <ThemedText type="code" themeColor="textSecondary">ÚLTIMA EDIÇÃO</ThemedText>
            <ThemedText type="code" themeColor="textSecondary">MÉDICO RESPONSÁVEL</ThemedText>
            <ThemedText>—</ThemedText>
            <ThemedText>Ana Ribeiro</ThemedText>
          </View>
          <DateInput label="DATA DO REGISTRO" values={[form.day, form.month, form.year]} onChange={(index, value) => {
            const keys: (keyof CytologyForm)[] = ["day", "month", "year"];
            setForm({ ...form, [keys[index]]: value });
          }} />
          <OptionRow
            label="RESULTADO"
            value={cytologyLabels[form.result] ?? form.result}
            options={results.map((result) => cytologyLabels[result])}
            onChange={(value) => {
              const result = results.find((item) => cytologyLabels[item] === value);
              if (result) setForm({ ...form, result });
            }}
          />
          <LabeledInput label="OBSERVAÇÃO" value={form.observation} onChangeText={(observation) => setForm({ ...form, observation })} multiline placeholder="Digite uma observação..." />
        </ScrollView>
        <View style={styles.footer}>
          {error ? <ThemedText type="small" themeColor="error" style={styles.error}>{error}</ThemedText> : null}
          <SaveButton label="Salvar registro" onPress={save} disabled={saving} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 120 },
  meta: { backgroundColor: "#E9E6DF", padding: 16, display: "flex", gap: 8 },
  footer: { padding: 16, backgroundColor: "#F2F0EF" },
  error: { backgroundColor: "#F7DCDB", borderRadius: 12, padding: 12 },
});
