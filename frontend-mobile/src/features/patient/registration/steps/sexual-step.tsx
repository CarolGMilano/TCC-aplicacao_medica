import {
  Counter,
  FieldRow,
  OptionRow,
  StepSection,
  ToggleRow,
} from "../components";
import { contraceptionOptions, minAges } from "../constants";
import type { StepProps } from "../types";
import { getAge } from "../utils";

export function SexualStep({ form, update }: StepProps) {
  const age = getAge(form) ?? undefined;

  return (
    <>
      <StepSection title="Início da vida sexual">
        <FieldRow>
          <Counter
            label="Sexarca"
            value={form.sexarche}
            min={minAges.sexarche}
            max={age}
            suffix="anos"
            onChange={(value) => update("sexarche", value)}
          />
          <ToggleRow
            label="VVS"
            value={form.vvs}
            onChange={(value) => update("vvs", value)}
          />
        </FieldRow>
      </StepSection>

      <StepSection title="Contracepção e parceiros">
        <OptionRow
          label="MAC"
          value={form.contraception}
          options={contraceptionOptions}
          onChange={(value) => update("contraception", value)}
        />
        <Counter
          label="Nº de parceiros"
          value={form.partners}
          max={999}
          editable
          onChange={(value) => update("partners", value)}
        />
      </StepSection>
    </>
  );
}
