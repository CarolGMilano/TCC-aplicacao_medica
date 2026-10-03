import { ChoiceRow, StepSection, ToggleRow } from "../components";
import { StepProps } from "../types";

export function IstStep({ form, update }: StepProps) {
  return (
    <StepSection title="HISTÓRICO DE IST">
      <ChoiceRow
        label="ISTS"
        options={[
          "HPV",
          "HIV",
          "Herpes genital",
          "Tricomoníase",
          "Gonorreia",
          "Clamídia",
          "Sífilis",
          "Não sabe",
          "Nenhuma",
        ]}
        selected={form.ist}
        onSelect={(value) => update("ist", value)}
      />
      <ToggleRow
        label="CONDILOMA HPV"
        value={form.hpvWart}
        onChange={(value) => update("hpvWart", value)}
      />
    </StepSection>
  );
}
