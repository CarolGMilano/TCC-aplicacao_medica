import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

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
import { AttendanceForm, DateInput, LabeledInput, styles } from "../components";
import { keyOf, toIsoDate, todayParts, type DateParts } from "../utils";
import { createColposcopy } from "./colposcopy-api";

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

// Valores iniciais iguais aos do formulário do web.
const initialForm = (): ColposcopyForm => ({
  date: todayParts(),
  estrogenization: false,
  jec: null,
  zone: null,
  lesion: false,
  lesionGrade: null,
  classification: null,
  recurrence: false,
  seeAndTreat: false,
  seeAndTreatReason: "",
  observation: "",
});

// Passo 1: achados. Passo 2: conduta. Um único POST no fim.
export function ColposcopyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
      if (findingsError) setError(findingsError);
      else setStep(2);
      return;
    }

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
      await createColposcopy({
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
      });
      // Volta para a ficha (aba Atend.), que recarrega a lista ao reaparecer.
      router.dismiss(2);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível salvar a colposcopia.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <AttendanceForm
      title="Nova colposcopia"
      error={error}
      saving={saving}
      onSave={handleButton}
      step={{ current: step, total: 2 }}
      onBack={
        step === 2
          ? () => {
              setError("");
              setStep(1);
            }
          : undefined
      }
      buttonLabel={step === 1 ? "Continuar" : "Salvar registro"}
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
            inline
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
              <View style={form.recurrence && styles.highlight}>
                <ToggleRow
                  label="LESÃO RECIDIVA"
                  value={form.recurrence}
                  onChange={(value) => update("recurrence", value)}
                />
              </View>
              <View style={form.seeAndTreat && styles.highlight}>
                <ToggleRow
                  label="VER E TRATAR"
                  value={form.seeAndTreat}
                  onChange={(value) => update("seeAndTreat", value)}
                />
              </View>
              {form.seeAndTreat ? (
                <View style={styles.highlight}>
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
