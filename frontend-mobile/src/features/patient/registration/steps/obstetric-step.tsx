import { Counter, FieldRow, StepSection, ToggleRow } from "../components";
import { minAges } from "../constants";
import type { StepProps } from "../types";
import { getAge, getMenopauseAge } from "../utils";

export function ObstetricStep({ form, update }: StepProps) {
  const age = getAge(form) ?? undefined;

  return (
    <>
      <StepSection title="História obstétrica">
        <FieldRow>
          <Counter
            label="Gestações"
            value={form.pregnancies}
            onChange={(value) => update("pregnancies", value)}
          />
          <Counter
            label="Partos normais"
            value={form.vaginalBirths}
            onChange={(value) => update("vaginalBirths", value)}
          />
        </FieldRow>
        <FieldRow>
          <Counter
            label="Cesarianas"
            value={form.cesareans}
            onChange={(value) => update("cesareans", value)}
          />
          <Counter
            label="Abortos"
            value={form.abortions}
            onChange={(value) => update("abortions", value)}
          />
        </FieldRow>
      </StepSection>

      <StepSection title="Ciclo menstrual">
        <FieldRow>
          <Counter
            label="Menarca"
            value={form.menarche}
            editable
            min={minAges.menarche}
            max={age}
            suffix="anos"
            onChange={(value) => update("menarche", value)}
          />
          <ToggleRow
            label="Menopausa"
            value={form.menopause}
            onChange={(value) => {
              update("menopause", value);
              // A menarca pode ter mudado desde o último ajuste da faixa.
              if (value) update("menopauseAge", getMenopauseAge(form));
            }}
          />
        </FieldRow>
        {form.menopause ? (
          <Counter
            label="Idade da menopausa"
            value={form.menopauseAge}
            editable
            min={Math.max(minAges.menopause, form.menarche + 1)}
            max={age}
            suffix="anos"
            onChange={(value) => update("menopauseAge", value)}
          />
        ) : null}
      </StepSection>
    </>
  );
}
