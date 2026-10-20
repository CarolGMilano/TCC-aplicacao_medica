import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

import { OptionRow } from "../../registration/components";
import { cytologyLabels } from "../../record/constants";
import type { Cytology } from "../../record/services/visits-api";
import { AttendanceForm, useReturnToVisits } from "../attendance-form";
import { DateInput, LabeledInput } from "../components";
import { SavedVisit } from "../saved-visit";
import type { CytologyForm } from "../types";
import { fromIsoDate, toIsoDate, todayParts } from "../utils";
import { CytologyDetails } from "../visit-details";
import { saveCytology } from "./cytology-api";

const results = Object.keys(cytologyLabels);

export function CytologyScreen() {
  return (
    <SavedVisit
      type="cytology"
      title="Citologia"
      details={(item) => <CytologyDetails item={item} />}
      editable
    >
      {(saved) => <CytologyRecord saved={saved} />}
    </SavedVisit>
  );
}

// Sem saved, nova citologia; com saved, edita a citologia salva, com os
// mesmos campos e regras.
function CytologyRecord({ saved }: { saved: Cytology | null }) {
  const returnToVisits = useReturnToVisits("cytology");
  const { id } = useLocalSearchParams<{ id: string }>();
  const [form, setForm] = useState<CytologyForm>(() => {
    if (saved) {
      const [day, month, year] = fromIsoDate(saved.dataRegistro);
      return {
        day,
        month,
        year,
        result: saved.resultado,
        observation: saved.observacao ?? "",
      };
    }
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
    // Completa o dia e o mês com zero ("5" vira "05"), senão o backend recusa.
    const dataRegistro = toIsoDate([form.day, form.month, form.year]);
    if (!dataRegistro) {
      setError("Informe uma data válida, entre 01/01/1900 e hoje.");
      return;
    }
    setSaving(true);
    try {
      await saveCytology(
        {
          idPaciente: Number(id),
          dataRegistro,
          resultado: form.result,
          observacao: form.observation.trim() || "",
        },
        saved?.idExame,
      );
      // Volta para a ficha (aba Atend.) no filtro de citologia, como os outros
      // registros.
      returnToVisits();
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
      title={saved ? "Alterar citologia" : "Nova citologia"}
      mode={saved ? "edit" : "new"}
      saved={saved ?? undefined}
      buttonLabel={saved ? "Salvar alterações" : undefined}
      error={error}
      saving={saving}
      onSave={save}
    >
      <DateInput
        label="Data do registro"
        values={[form.day, form.month, form.year]}
        onChange={([day, month, year]) =>
          setForm({ ...form, day, month, year })
        }
      />
      <OptionRow
        label="Resultado"
        value={cytologyLabels[form.result] ?? form.result}
        options={results.map((result) => cytologyLabels[result])}
        onChange={(value) => {
          const result = results.find((item) => cytologyLabels[item] === value);
          if (result) setForm({ ...form, result });
        }}
      />
      <LabeledInput
        label="Observação"
        value={form.observation}
        onChangeText={(observation) => setForm({ ...form, observation })}
        multiline
        placeholder="Digite uma observação..."
      />
    </AttendanceForm>
  );
}
