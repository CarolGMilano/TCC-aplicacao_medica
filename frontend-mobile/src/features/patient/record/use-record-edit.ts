import { useState } from "react";

import type { PatientForm } from "../registration/types";
import { validateStep } from "../registration/utils";
import { tabSteps } from "./constants";
import { saveTab } from "./services/patient-update-api";
import type { DataTab, PatientRecord } from "./types";

// Estado do modo edição: uma cópia (rascunho) dos dados da aba,
// descartada no "Cancelar" e enviada ao backend no "Salvar alterações".
export function useRecordEdit(
  record: PatientRecord | null,
  onSaved: () => void,
) {
  const [draft, setDraft] = useState<PatientForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function start() {
    if (!record) return;
    setError("");
    setDraft(record.form);
  }

  function cancel() {
    setError("");
    setDraft(null);
  }

  const update = <Key extends keyof PatientForm>(
    key: Key,
    value: PatientForm[Key],
  ) => {
    setError("");
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  };

  async function save(tab: DataTab) {
    if (!record || !draft) return;

    const stepError = validateStep(tabSteps[tab], draft);
    if (stepError) {
      setError(stepError);
      return;
    }

    setSaving(true);
    try {
      await saveTab(record, tab, draft);
      setDraft(null);
      onSaved();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível salvar as alterações.",
      );
    } finally {
      setSaving(false);
    }
  }

  return {
    draft,
    editing: draft !== null,
    saving,
    error,
    start,
    cancel,
    update,
    save,
  };
}
