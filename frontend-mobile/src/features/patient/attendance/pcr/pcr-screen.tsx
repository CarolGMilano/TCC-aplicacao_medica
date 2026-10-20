import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

import { ChoiceRow } from "../../registration/components";
import { hpvTypeLabels, pcrResultLabels } from "../../record/constants";
import type { Pcr } from "../../record/services/visits-api";
import { AttendanceForm, useReturnToVisits } from "../attendance-form";
import { DateInput, LabeledInput } from "../components";
import { SavedVisit } from "../saved-visit";
import {
  fromIsoDate,
  keyOf,
  toIsoDate,
  todayParts,
  type DateParts,
} from "../utils";
import { PcrDetails } from "../visit-details";
import { savePcr } from "./pcr-api";

export function PcrScreen() {
  return (
    <SavedVisit
      type="pcr"
      title="PCR DNA HPV"
      details={(item) => <PcrDetails item={item} />}
      editable
    >
      {(saved) => <PcrRecord saved={saved} />}
    </SavedVisit>
  );
}

// Mesmos campos e regras do formulário de PCR do web. Com saved, edita o
// PCR salvo, começando com os valores dele.
function PcrRecord({ saved }: { saved: Pcr | null }) {
  const returnToVisits = useReturnToVisits("pcr");
  const { id } = useLocalSearchParams<{ id: string }>();
  const [date, setDate] = useState<DateParts>(() =>
    saved ? fromIsoDate(saved.dataRegistro) : todayParts(),
  );
  const [result, setResult] = useState(saved?.resultado ?? "NEGATIVO");
  const [hpvTypes, setHpvTypes] = useState<string[]>(saved?.tiposHpv ?? []);
  const [observation, setObservation] = useState(saved?.observacao ?? "");
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
      await savePcr(
        {
          idPaciente: Number(id),
          dataRegistro,
          resultado: result,
          tiposHpv: positive ? hpvTypes : [],
          observacao: observation.trim(),
        },
        saved?.idExame,
      );
      // Volta para a ficha (aba Atend.) no filtro deste tipo.
      returnToVisits();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível salvar o PCR.",
      );
      // Só no erro: depois do sucesso a tela fecha e fica travada até sair.
      setSaving(false);
    }
  }

  return (
    <AttendanceForm
      title={saved ? "Alterar PCR DNA HPV" : "Novo PCR DNA HPV"}
      mode={saved ? "edit" : "new"}
      saved={saved ?? undefined}
      buttonLabel={saved ? "Salvar alterações" : undefined}
      error={error}
      saving={saving}
      onSave={save}
    >
      <DateInput
        label="Data do registro"
        values={date}
        onChange={(next) => {
          setError("");
          setDate(next);
        }}
      />
      <ChoiceRow
        label="Resultado"
        options={Object.values(pcrResultLabels)}
        selected={pcrResultLabels[result]}
        onSelect={(label) => {
          setError("");
          setResult(keyOf(pcrResultLabels, label) ?? result);
        }}
      />
      {positive ? (
        <ChoiceRow
          label="Tipo de HPV"
          hint="Selecione todos os tipos detectados"
          options={Object.values(hpvTypeLabels)}
          selected={hpvTypes.map((type) => hpvTypeLabels[type])}
          onSelect={toggleHpvType}
        />
      ) : null}
      <LabeledInput
        label="Observação"
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
