import { useLocalSearchParams } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { View } from "react-native";

import { Theme } from "@/constants/theme";

import {
  ChoiceRow,
  StepSection,
  ToggleRow,
} from "../../registration/components";
import {
  jecOptions,
  lesionLabels,
  lesionSizeOptions,
  transformationZoneLabels,
} from "../../record/constants";
import type { Colposcopy } from "../../record/services/visits-api";
import { AttendanceForm, useReturnToVisits } from "../attendance-form";
import { DateInput, LabeledInput, styles } from "../components";
import { SavedVisit } from "../saved-visit";
import {
  fromIsoDate,
  keyOf,
  toIsoDate,
  todayParts,
  type DateParts,
} from "../utils";
import { ColposcopyDetails } from "../visit-details";
import { saveColposcopy } from "./colposcopy-api";

type ColposcopyForm = {
  date: DateParts;
  estrogenization: boolean;
  jec: string | null;
  zone: string | null;
  lesion: boolean;
  lesionGrade: string | null;
  classification: string | null;
  recurrence: boolean;
  seeAndTreat: boolean;
  seeAndTreatReason: string;
  observation: string;
};

// Valores iniciais iguais aos do formulário do web: os da colposcopia salva,
// quando é edição, ou os padrões de uma nova.
const initialForm = (saved: Colposcopy | null): ColposcopyForm => ({
  date: saved ? fromIsoDate(saved.dataRegistro) : todayParts(),
  estrogenization: saved?.estrogenizacao ?? false,
  jec: saved?.jec ?? null,
  zone: saved?.zt ?? null,
  lesion: saved?.lesao ?? false,
  lesionGrade: saved?.grauLesao ?? null,
  classification: saved?.classificacao ?? null,
  recurrence: saved?.recidiva ?? false,
  seeAndTreat: saved?.verETratar ?? false,
  seeAndTreatReason: saved?.verETratarMotivo ?? "",
  observation: saved?.observacao ?? "",
});

export function ColposcopyScreen() {
  return (
    <SavedVisit
      type="colposcopy"
      title="Colposcopia"
      details={(item) => <ColposcopyDetails item={item} />}
      editable
    >
      {(saved) => <ColposcopyRecord saved={saved} />}
    </SavedVisit>
  );
}

// Passo 1: achados. Passo 2: conduta. Um único envio no fim (POST na nova,
// PUT na edição da colposcopia salva).
function ColposcopyRecord({ saved }: { saved: Colposcopy | null }) {
  const returnToVisits = useReturnToVisits("colposcopy");
  const { id } = useLocalSearchParams<{ id: string }>();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => initialForm(saved));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const conductShownAt = useRef(0);

  function update<Key extends keyof ColposcopyForm>(
    key: Key,
    value: ColposcopyForm[Key],
  ) {
    setError("");
    setForm((current) => ({ ...current, [key]: value }));
  }

  function validateFindings() {
    if (!toIsoDate(form.date))
      return "Informe uma data válida, entre 01/01/1900 e hoje.";
    if (!form.jec) return "Selecione uma junção escamocolunar.";
    if (!form.zone) return "Selecione uma zona de transformação.";
    if (form.lesion && !form.lesionGrade) return "Selecione um grau de lesão.";
    if (form.lesion && !form.classification)
      return "Selecione a classificação da lesão.";
    return null;
  }

  function validateConduct() {
    if (form.lesion && form.seeAndTreat && !form.seeAndTreatReason.trim())
      return "Informe o motivo do ver e tratar.";
    if (!form.observation.trim()) return "A observação é obrigatória.";
    return null;
  }

  async function handleButton() {
    if (step === 1) {
      const findingsError = validateFindings();
      if (findingsError) {
        setError(findingsError);
        return;
      }
      conductShownAt.current = Date.now();
      setStep(2);
      return;
    }

    // Um toque duplo em "Continuar" cairia em "Salvar registro" sem que o
    // passo 2 fosse visto.
    if (Date.now() - conductShownAt.current < 500) return;

    const conductError = validateConduct();
    const dataRegistro = toIsoDate(form.date);
    if (conductError || !dataRegistro || !form.jec || !form.zone) {
      setError(conductError ?? "Confira os achados do passo 1.");
      return;
    }

    // Sem lesão, os campos que dependem dela vão vazios, como no web.
    const seeAndTreat = form.lesion && form.seeAndTreat;
    setSaving(true);
    try {
      await saveColposcopy(
        {
          idPaciente: Number(id),
          dataRegistro,
          estrogenizacao: form.estrogenization,
          jec: form.jec,
          zt: form.zone,
          lesao: form.lesion,
          recidiva: form.lesion && form.recurrence,
          grauLesao: form.lesion ? form.lesionGrade : null,
          classificacao: form.lesion ? form.classification : null,
          observacao: form.observation.trim(),
          verETratar: seeAndTreat,
          verETratarMotivo: seeAndTreat ? form.seeAndTreatReason.trim() : "",
        },
        saved?.idColposcopia,
      );
      // Volta para a ficha (aba Atend.) no filtro deste tipo.
      returnToVisits();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível salvar a colposcopia.",
      );
      // Só no erro: depois do sucesso a tela fecha e fica travada até sair.
      setSaving(false);
    }
  }

  // Estável entre renderizações: o AttendanceForm registra o voltar do Android
  // com base nela.
  const backToFindings = useCallback(() => {
    setError("");
    setStep(1);
  }, []);

  return (
    <AttendanceForm
      title={saved ? "Alterar colposcopia" : "Nova colposcopia"}
      mode={saved ? "edit" : "new"}
      saved={saved ?? undefined}
      error={error}
      saving={saving}
      onSave={handleButton}
      step={{ current: step, total: 2 }}
      onBack={step === 2 ? backToFindings : undefined}
      buttonLabel={
        step === 1
          ? "Continuar"
          : saved
            ? "Salvar alterações"
            : "Salvar registro"
      }
    >
      {step === 1 ? (
        <StepSection title="ACHADOS · PASSO 1 DE 2">
          <DateInput
            label="DATA DO REGISTRO"
            values={form.date}
            onChange={(index, value) => {
              const date = [...form.date] as DateParts;
              date[index] = value;
              update("date", date);
            }}
          />
          <ToggleRow
            label="ESTROGENIZAÇÃO"
            value={form.estrogenization}
            onChange={(value) => update("estrogenization", value)}
          />
          <ChoiceRow
            label="JEC"
            options={jecOptions}
            selected={form.jec ?? ""}
            onSelect={(value) => update("jec", value)}
          />
          <ChoiceRow
            label="ZONA DE TRANSFORMAÇÃO"
            options={Object.values(transformationZoneLabels)}
            selected={form.zone ? transformationZoneLabels[form.zone] : ""}
            onSelect={(label) =>
              update("zone", keyOf(transformationZoneLabels, label))
            }
            inline
          />
          <ToggleRow
            label="LESÃO"
            value={form.lesion}
            onChange={(value) => update("lesion", value)}
          />
          {form.lesion ? (
            <>
              <ChoiceRow
                label="GRAU DA LESÃO"
                options={Object.values(lesionLabels)}
                selected={
                  form.lesionGrade ? lesionLabels[form.lesionGrade] : ""
                }
                onSelect={(label) =>
                  update("lesionGrade", keyOf(lesionLabels, label))
                }
              />
              <ChoiceRow
                label="CLASSIFICAÇÃO"
                options={lesionSizeOptions}
                selected={form.classification ?? ""}
                onSelect={(value) => update("classification", value)}
                inline
              />
            </>
          ) : null}
        </StepSection>
      ) : (
        <StepSection title="CONDUTA · PASSO 2 DE 2">
          {form.lesion ? (
            <>
              <View style={[styles.alertRow, form.recurrence && styles.highlight]}>
                <ToggleRow
                  label="LESÃO RECIDIVA"
                  value={form.recurrence}
                  onChange={(value) => update("recurrence", value)}
                  // Só o "Sim" fica em coral; o "Não" segue a cor padrão.
                  selectedColor={form.recurrence ? Theme.secondary : undefined}
                />
              </View>
              <View style={[styles.alertRow, form.seeAndTreat && styles.highlight]}>
                <ToggleRow
                  label="VER E TRATAR"
                  value={form.seeAndTreat}
                  onChange={(value) => update("seeAndTreat", value)}
                  selectedColor={form.seeAndTreat ? Theme.secondary : undefined}
                />
              </View>
              {form.seeAndTreat ? (
                <View style={[styles.alertRow, styles.highlight]}>
                  <LabeledInput
                    label="MOTIVO DO VER E TRATAR · * OBRIGATÓRIO"
                    value={form.seeAndTreatReason}
                    onChangeText={(value) => update("seeAndTreatReason", value)}
                    multiline
                    placeholder="Descreva o motivo..."
                  />
                </View>
              ) : null}
            </>
          ) : null}
          <LabeledInput
            label="OBSERVAÇÃO"
            value={form.observation}
            onChangeText={(value) => update("observation", value)}
            multiline
            placeholder="Digite uma observação..."
          />
        </StepSection>
      )}
    </AttendanceForm>
  );
}
