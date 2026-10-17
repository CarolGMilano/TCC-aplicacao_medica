import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

import { ChoiceRow } from "../../registration/components";
import { hpvTypeLabels, pcrResultLabels } from "../../record/constants";
import { AttendanceForm, DateInput, LabeledInput } from "../components";
import { keyOf, toIsoDate, todayParts, type DateParts } from "../utils";
import { createPcr } from "./pcr-api";

// Mesmos campos e regras do formulário de PCR do web.
export function PcrScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [date, setDate] = useState<DateParts>(todayParts);
  const [result, setResult] = useState("NEGATIVO");
  const [hpvTypes, setHpvTypes] = useState<string[]>([]);
  const [observation, setObservation] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const positive = result === "POSITIVO";

  function toggleHpvType(label: string) {
    const type = keyOf(hpvTypeLabels, label);
    if (!type) return;
    setError("");
    setHpvTypes((current) =>
      current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type],
    );
  }

  async function save() {
    const dataRegistro = toIsoDate(date);
    if (!dataRegistro) {
      setError("Informe uma data válida, entre 01/01/1900 e hoje.");
      return;
    }
    if (positive && hpvTypes.length === 0) {
      setError("Selecione ao menos um tipo de HPV.");
      return;
    }
    if (!observation.trim()) {
      setError("A observação é obrigatória.");
      return;
    }

    setSaving(true);
    try {
      await createPcr({
        idPaciente: Number(id),
        dataRegistro,
        resultado: result,
        tiposHpv: positive ? hpvTypes : [],
        observacao: observation.trim(),
      });
      // Volta para a ficha (aba Atend.), que recarrega a lista ao reaparecer.
      router.dismiss(2);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível salvar o PCR.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <AttendanceForm
      title="Novo PCR DNA HPV"
      error={error}
      saving={saving}
      onSave={save}
    >
      <DateInput
        label="DATA DO REGISTRO"
        values={date}
        onChange={(index, value) => {
          setError("");
          setDate((current) => {
            const next = [...current] as DateParts;
            next[index] = value;
            return next;
          });
        }}
      />
      <ChoiceRow
        label="RESULTADO"
        options={Object.values(pcrResultLabels)}
        selected={pcrResultLabels[result]}
        onSelect={(label) => {
          setError("");
          setResult(keyOf(pcrResultLabels, label) ?? result);
        }}
        inline
      />
      {positive ? (
        <ChoiceRow
          label="TIPO DE HPV"
          hint="Selecione todos os tipos detectados"
          options={Object.values(hpvTypeLabels)}
          selected={hpvTypes.map((type) => hpvTypeLabels[type])}
          onSelect={toggleHpvType}
        />
      ) : null}
      <LabeledInput
        label="OBSERVAÇÃO"
        value={observation}
        onChangeText={(value) => {
          setError("");
          setObservation(value);
        }}
        multiline
        placeholder="Digite uma observação..."
      />
    </AttendanceForm>
  );
}
