import { Counter, OptionRow, StepSection, ToggleRow } from "../components";
import { contraceptionOptions, minAges } from "../constants";
import type { StepProps } from "../types";
import { getAge } from "../utils";

export function SexualStep({ form, update }: StepProps) {
  const age = getAge(form) ?? undefined;

  return (
    <>
      <StepSection title="INÍCIO DA VIDA SEXUAL">
        <Counter
          label="SEXARCA"
          value={form.sexarche}
          min={minAges.sexarche}
          max={age}
          suffix="ANOS"
          onChange={(value) => update("sexarche", value)}
        />
        <ToggleRow
          label="VVS"
          value={form.vvs}
          onChange={(value) => update("vvs", value)}
        />
      </StepSection>

      <StepSection title="CONTRACEPÇÃO E PARCEIROS">
        <OptionRow
          label="MAC"
          value={form.contraception}
          options={contraceptionOptions}
          onChange={(value) => update("contraception", value)}
        />
        <Counter
          label="Nº DE PARCEIROS"
          value={form.partners}
          max={999}
          onChange={(value) => update("partners", value)}
        />
      </StepSection>
    </>
  );
}
