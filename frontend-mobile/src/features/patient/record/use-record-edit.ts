import { useState } from "react";

import type { PatientForm } from "../registration/types";
import { validateStep } from "../registration/utils";
import { recordTabs, tabSteps } from "./constants";
import { saveTab } from "./services/patient-update-api";
import type { DataTab, PatientRecord } from "./types";

// Com outra data de nascimento, a idade muda: confere as idades já salvas
// nas outras abas com as regras do cadastro. Só barra o erro que a nova data
// cria; um dado antigo que já falhava com a data salva não trava Pessoais.
function validateOtherTabs(record: PatientRecord, form: PatientForm) {
  for (const tab of ["obstetric", "sexual", "habits"] as const) {
    if (record.missing[tab]) continue;
    const error = validateStep(tabSteps[tab], form);
    if (error && error !== validateStep(tabSteps[tab], record.form)) {
      const label = recordTabs.find((item) => item.id === tab)?.label;
      return `Aba ${label}: ${error}`;
    }
  }
  return null;
}

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

    const stepError =
      validateStep(tabSteps[tab], draft) ??
      (tab === "personal" ? validateOtherTabs(record, draft) : null);
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
