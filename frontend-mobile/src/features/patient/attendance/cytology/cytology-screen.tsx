import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

import { OptionRow } from "../../registration/components";
import { cytologyLabels } from "../../record/constants";
import type { Cytology } from "../../record/services/visits-api";
import { AttendanceForm, useReturnToVisits } from "../attendance-form";
import { DateInput, LabeledInput } from "../components";
import { confirmBeforeSave } from "../confirm-save";
import { SavedVisit } from "../saved-visit";
import type { CytologyForm } from "../types";
import { fromIsoDate, toIsoDate, todayParts } from "../utils";
import { CytologyDetails } from "../visit-details";
import { saveCytology } from "./cytology-api";

const results = Object.keys(cytologyLabels);

// HSIL ou pior: pede confirmação antes de salvar.
const criticalCytology = [
  "HSIL",
  "HSIL_COM_CARACTERISTICAS_SUGESTIVAS_DE_INVASAO",
  "CARCINOMA_DE_CELULAS_ESCAMOSAS",
  "AGC_FAVORECENDO_NEOPLASIA",
  "AIS_ENDOCERVICAL",
  "ADENOCARCINOMA_ENDOCERVICAL",
  "ADENOCARCINOMA_ENDOMETRIAL",
  "ADENOCARCINOMA_EXTRAUTERINO",
  "ADENOCARCINOMA_SOE",
];

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
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const [initial] = useState<CytologyForm>(() => {
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
    // Sem resultado pré-selecionado: o médico precisa escolher, para um
    // resultado esquecido não ser salvo como outro.
    const [day, month, year] = todayParts();
    return { day, month, year, result: "", observation: "" };
  });
  const [form, setForm] = useState(initial);
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Data, resultado e observação são obrigatórios (especificação).
  const complete = Boolean(
    form.day &&
    form.month &&
    form.year &&
    form.result &&
    form.observation.trim(),
  );

  async function save() {
    if (!complete) {
      setError("Preencha a data, o resultado e a observação.");
      return;
    }
    // Completa o dia e o mês com zero ("5" vira "05"), senão o backend recusa.
    const dataRegistro = toIsoDate([form.day, form.month, form.year]);
    if (!dataRegistro) {
      setError("Informe uma data válida, entre 01/01/1900 e hoje.");
      return;
    }
    // Trava o botão já na conferência, para um toque duplo não abrir duas.
    setSaving(true);
    const confirmed = await confirmBeforeSave({
      patientId: Number(id),
      patientName: name,
      type: "cytology",
      typeLabel: "Citologia",
      dataRegistro,
      editingId: saved?.idExame,
      critical: criticalCytology.includes(form.result)
        ? cytologyLabels[form.result]
        : null,
    });
    if (!confirmed) {
      setSaving(false);
      return;
    }
    try {
      await saveCytology(
        {
          idPaciente: Number(id),
          dataRegistro,
          resultado: form.result,
          observacao: form.observation.trim(),
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
      dirty={dirty}
      complete={complete}
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
        value={form.result ? (cytologyLabels[form.result] ?? form.result) : ""}
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
