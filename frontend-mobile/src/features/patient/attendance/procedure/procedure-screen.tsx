import { router, useLocalSearchParams } from "expo-router";
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
import { AttendanceForm, DateInput, LabeledInput } from "../components";
import { keyOf, toIsoDate, todayParts, type DateParts } from "../utils";
import { createProcedure } from "./procedure-api";

const resultPlaceholder = "Selecione um resultado";

// Mesmos campos e regras do formulário de procedimento do web.
export function ProcedureScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [date, setDate] = useState<DateParts>(todayParts);
  const [type, setType] = useState("BIOPSIA");
  const [fragments, setFragments] = useState(1);
  const [endocervical, setEndocervical] = useState<string | null>(null);
  const [ectocervical, setEctocervical] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [observation, setObservation] = useState("");
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
      await createProcedure({
        idPaciente: Number(id),
        dataRegistro,
        tipo: type,
        qtFragmento: fragments,
        margemEndocervical: hasMargins ? endocervical : null,
        margemEctocervical: hasMargins ? ectocervical : null,
        resultado: result,
        observacao: observation.trim(),
      });
      // Volta para a ficha (aba Atend.), que recarrega a lista ao reaparecer.
      router.dismiss(2);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível salvar o procedimento.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <AttendanceForm
      title="Novo procedimento"
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
        label="TIPO"
        options={Object.values(procedureLabels)}
        selected={procedureLabels[type]}
        onSelect={(label) =>
          clearError(setType)(keyOf(procedureLabels, label) ?? type)
        }
        inline
      />
      <Counter
        label="FRAGMENTOS"
        value={fragments}
        min={1}
        onChange={clearError(setFragments)}
      />
      {hasMargins ? (
        <>
          <ChoiceRow
            label="MARGEM ENDOCERVICAL"
            options={Object.values(marginLabels)}
            selected={endocervical ? marginLabels[endocervical] : ""}
            onSelect={(label) =>
              clearError(setEndocervical)(keyOf(marginLabels, label))
            }
          />
          <ChoiceRow
            label="MARGEM ECTOCERVICAL"
            options={Object.values(marginLabels)}
            selected={ectocervical ? marginLabels[ectocervical] : ""}
            onSelect={(label) =>
              clearError(setEctocervical)(keyOf(marginLabels, label))
            }
          />
        </>
      ) : null}
      <OptionRow
        label="RESULTADO"
        value={result ? procedureResultLabels[result] : resultPlaceholder}
        options={Object.values(procedureResultLabels)}
        onChange={(label) =>
          clearError(setResult)(keyOf(procedureResultLabels, label))
        }
      />
      <LabeledInput
        label="OBSERVAÇÃO"
        value={observation}
        onChangeText={clearError(setObservation)}
        multiline
        placeholder="Digite uma observação..."
      />
    </AttendanceForm>
  );
}
