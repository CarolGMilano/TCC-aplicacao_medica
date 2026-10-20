import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

import {
  ChoiceRow,
  Counter,
  OptionRow,
} from "../../registration/components";
import {
  marginLabels,
  procedureLabels,
  procedureResultLabels,
} from "../../record/constants";
import type { Procedure } from "../../record/services/visits-api";
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
import { ProcedureDetails } from "../visit-details";
import { saveProcedure } from "./procedure-api";

const resultPlaceholder = "Selecione um resultado";

export function ProcedureScreen() {
  return (
    <SavedVisit
      type="procedures"
      title="Procedimento"
      details={(item) => <ProcedureDetails item={item} />}
      editable
    >
      {(saved) => <ProcedureRecord saved={saved} />}
    </SavedVisit>
  );
}

// Mesmos campos e regras do formulário de procedimento do web. Com saved,
// edita o procedimento salvo, começando com os valores dele.
function ProcedureRecord({ saved }: { saved: Procedure | null }) {
  const returnToVisits = useReturnToVisits("procedures");
  const { id } = useLocalSearchParams<{ id: string }>();
  const [date, setDate] = useState<DateParts>(() =>
    saved ? fromIsoDate(saved.dataRegistro) : todayParts(),
  );
  const [type, setType] = useState(saved?.tipo ?? "BIOPSIA");
  const [fragments, setFragments] = useState(saved?.qtFragmento ?? 1);
  const [endocervical, setEndocervical] = useState<string | null>(
    saved?.margemEndocervical ?? null,
  );
  const [ectocervical, setEctocervical] = useState<string | null>(
    saved?.margemEctocervical ?? null,
  );
  const [result, setResult] = useState<string | null>(
    saved?.resultado ?? null,
  );
  const [observation, setObservation] = useState(saved?.observacao ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Biópsia não tem margens; nas EZT as duas são obrigatórias.
  const hasMargins = type !== "BIOPSIA";

  function clearError<Value>(setter: (value: Value) => void) {
    return (value: Value) => {
      setError("");
      setter(value);
    };
  }

  async function save() {
    const dataRegistro = toIsoDate(date);
    if (!dataRegistro) {
      setError("Informe uma data válida, entre 01/01/1900 e hoje.");
      return;
    }
    if (hasMargins && (!endocervical || !ectocervical)) {
      setError("Selecione as margens endocervical e ectocervical.");
      return;
    }
    if (!result) {
      setError("Selecione o resultado.");
      return;
    }
    if (!observation.trim()) {
      setError("A observação é obrigatória.");
      return;
    }

    setSaving(true);
    try {
      await saveProcedure(
        {
          idPaciente: Number(id),
          dataRegistro,
          tipo: type,
          qtFragmento: fragments,
          margemEndocervical: hasMargins ? endocervical : null,
          margemEctocervical: hasMargins ? ectocervical : null,
          resultado: result,
          observacao: observation.trim(),
        },
        saved?.idProcedimento,
      );
      // Volta para a ficha (aba Atend.) no filtro deste tipo.
      returnToVisits();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível salvar o procedimento.",
      );
      // Só no erro: depois do sucesso a tela fecha e fica travada até sair.
      setSaving(false);
    }
  }

  return (
    <AttendanceForm
      title={saved ? "Alterar procedimento" : "Novo procedimento"}
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
        label="Tipo"
        options={Object.values(procedureLabels)}
        selected={procedureLabels[type]}
        onSelect={(label) =>
          clearError(setType)(keyOf(procedureLabels, label) ?? type)
        }
      />
      <Counter
        label="Fragmentos"
        value={fragments}
        min={1}
        onChange={clearError(setFragments)}
      />
      {hasMargins ? (
        <>
          <ChoiceRow
            label="Margem endocervical"
            options={Object.values(marginLabels)}
            selected={endocervical ? marginLabels[endocervical] : ""}
            onSelect={(label) =>
              clearError(setEndocervical)(keyOf(marginLabels, label))
            }
          />
          <ChoiceRow
            label="Margem ectocervical"
            options={Object.values(marginLabels)}
            selected={ectocervical ? marginLabels[ectocervical] : ""}
            onSelect={(label) =>
              clearError(setEctocervical)(keyOf(marginLabels, label))
            }
          />
        </>
      ) : null}
      <OptionRow
        label="Resultado"
        value={result ? procedureResultLabels[result] : resultPlaceholder}
        options={Object.values(procedureResultLabels)}
        onChange={(label) =>
          clearError(setResult)(keyOf(procedureResultLabels, label))
        }
      />
      <LabeledInput
        label="Observação"
        value={observation}
        onChangeText={clearError(setObservation)}
        multiline
        placeholder="Digite uma observação..."
      />
    </AttendanceForm>
  );
}
