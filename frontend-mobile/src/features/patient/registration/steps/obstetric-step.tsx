import { Counter, StepSection, ToggleRow } from "../components";
import { minAges } from "../constants";
import type { StepProps } from "../types";
import { getAge } from "../utils";

export function ObstetricStep({ form, update }: StepProps) {
  const age = getAge(form) ?? undefined;

  return (
    <>
      <StepSection title="HISTÓRIA OBSTÉTRICA">
        <Counter
          label="GESTAÇÕES"
          value={form.pregnancies}
          onChange={(value) => update("pregnancies", value)}
        />
        <Counter
          label="PARTOS NORMAIS"
          value={form.vaginalBirths}
          onChange={(value) => update("vaginalBirths", value)}
        />
        <Counter
          label="CESARIANAS"
          value={form.cesareans}
          onChange={(value) => update("cesareans", value)}
        />
        <Counter
          label="ABORTOS"
          value={form.abortions}
          onChange={(value) => update("abortions", value)}
        />
      </StepSection>

      <StepSection title="CICLO MENSTRUAL">
        <Counter
          label="MENARCA"
          value={form.menarche}
          min={minAges.menarche}
          max={age}
          suffix="ANOS"
          onChange={(value) => update("menarche", value)}
        />
        <ToggleRow
          label="MENOPAUSA"
          value={form.menopause}
          onChange={(value) => update("menopause", value)}
        />
        {form.menopause ? (
          <Counter
            label="IDADE DA MENOPAUSA"
            value={form.menopauseAge}
            min={Math.max(minAges.menopause, form.menarche + 1)}
            max={age}
            suffix="ANOS"
            onChange={(value) => update("menopauseAge", value)}
          />
        ) : null}
      </StepSection>
    </>
  );
}
