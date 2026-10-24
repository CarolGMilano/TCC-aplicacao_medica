import { useState } from "react";

import type { PatientForm } from "../registration/types";
import { validateStep } from "../registration/utils";
import { sectionLabels, tabSteps } from "./constants";
import { saveTab } from "./services/patient-update-api";
import type { DataTab, PatientRecord } from "./types";

// Com outra data de nascimento, a idade muda: confere as idades já salvas
// nas outras abas com as regras do cadastro. Só barra o erro que a nova data
// cria; um dado antigo que já falhava com a data salva não trava Pessoais.
function validateOtherTabs(record: PatientRecord, form: PatientForm) {
  for (const tab of ["obstetric", "sexual", "habits"] as const) {
    if (record.missing[tab]) continue;
    const error = validateStep(tabSteps[tab], form, record.form);
    const before = validateStep(tabSteps[tab], record.form, record.form);
    if (error && error !== before) {
      return `${sectionLabels[tab]}: ${error}`;
    }
  }
  return null;
}

// Estado do modo edição: uma cópia (rascunho) dos dados da aba,
// descartada no "Cancelar" e enviada ao backend no "Salvar alterações".
export function useRecordEdit(
  record: PatientRecord | null,
  onSaved: () => void,
  refresh: () => Promise<void>,
) {
  const [draft, setDraft] = useState<PatientForm | null>(null);
  // Rascunho como começou: só o que o médico mudar depois conta como alteração.
  const [initial, setInitial] = useState<PatientForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function start() {
    if (!record) return;
    setError("");
    // Fichas antigas podem ter mais de 99 parceiros (o limite era 999): o
    // valor salvo é mantido; só o "+" e a digitação respeitam o limite.
    setDraft(record.form);
    setInitial(record.form);
  }

  function cancel() {
    setError("");
    setDraft(null);
    setInitial(null);
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

    // Aba ainda sem registro: os valores iniciais não contam como gravados.
    const saved =
      tab !== "personal" && record.missing[tab] ? undefined : record.form;
    const stepError =
      validateStep(tabSteps[tab], draft, saved) ??
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
      // Parte do que foi enviado pode ter sido gravada: atualiza a ficha
      // (e os ids dos históricos) antes de liberar uma nova tentativa.
      await refresh();
    } finally {
      setSaving(false);
    }
  }

  return {
    draft,
    editing: draft !== null,
    // Algo foi mudado no rascunho: sair pede confirmação antes de descartar.
    dirty:
      draft !== null && JSON.stringify(draft) !== JSON.stringify(initial),
    saving,
    error,
    start,
    cancel,
    update,
    save,
  };
}
