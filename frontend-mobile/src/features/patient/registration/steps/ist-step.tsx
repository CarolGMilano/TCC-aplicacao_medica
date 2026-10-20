import { ChoiceRow, StepSection, ToggleRow } from "../components";
import { istOptions } from "../constants";
import type { StepProps } from "../types";
import { toggleIst } from "../utils";

export function IstStep({ form, update }: StepProps) {
  return (
    <StepSection title="Histórico de IST">
      <ChoiceRow
        label="ISTs"
        options={istOptions}
        selected={form.ists}
        onSelect={(value) => update("ists", toggleIst(form.ists, value))}
      />
      {form.ists.includes("HPV") ? (
        <ToggleRow
          label="Condiloma HPV"
          value={form.hpvWart}
          onChange={(value) => update("hpvWart", value)}
        />
      ) : null}
    </StepSection>
  );
}
