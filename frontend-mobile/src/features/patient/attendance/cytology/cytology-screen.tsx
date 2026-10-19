import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

import { OptionRow } from "../../registration/components";
import { cytologyLabels } from "../../record/constants";
import { AttendanceForm } from "../attendance-form";
import { DateInput, LabeledInput } from "../components";
import type { CytologyForm } from "../types";
import { todayParts } from "../utils";
import { createCytology } from "./cytology-api";

const results = Object.keys(cytologyLabels);

export function CytologyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [form, setForm] = useState<CytologyForm>(() => {
    const [day, month, year] = todayParts();
    return { day, month, year, result: "ADENOCARCINOMA_SOE", observation: "" };
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
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível salvar a citologia.",
      );
      // Só no erro: depois do sucesso a tela fecha e fica travada até sair.
      setSaving(false);
    }
  }

  return (
    <AttendanceForm
      title="Nova citologia"
      error={error}
      saving={saving}
      onSave={save}
    >
      <DateInput
        label="DATA DO REGISTRO"
        values={[form.day, form.month, form.year]}
        onChange={(index, value) => {
          const keys: (keyof CytologyForm)[] = ["day", "month", "year"];
          setForm({ ...form, [keys[index]]: value });
        }}
      />
      <OptionRow
        label="RESULTADO"
        value={cytologyLabels[form.result] ?? form.result}
        options={results.map((result) => cytologyLabels[result])}
        onChange={(value) => {
          const result = results.find((item) => cytologyLabels[item] === value);
          if (result) setForm({ ...form, result });
        }}
      />
      <LabeledInput
        label="OBSERVAÇÃO"
        value={form.observation}
        onChangeText={(observation) => setForm({ ...form, observation })}
        multiline
        placeholder="Digite uma observação..."
      />
    </AttendanceForm>
  );
}
