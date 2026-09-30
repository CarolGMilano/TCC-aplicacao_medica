import { Counter, StepSection, ToggleRow } from "../components";
import { StepProps } from "../types";

export function ObstetricStep({ form, update }: StepProps) {
  return (
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
      <StepSection title="CICLO MENSTRUAL">
        <Counter
          label="MENARCA"
          value={form.menarche}
          suffix="ANOS"
          onChange={(value) => update("menarche", value)}
        />
        <ToggleRow
          label="MENOPAUSA"
          value={form.menopause}
          onChange={(value) => update("menopause", value)}
        />
      </StepSection>
    </StepSection>
  );
}
