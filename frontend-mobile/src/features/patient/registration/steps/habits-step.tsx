import { ChoiceRow, Counter, StepSection, SummaryRow } from "../components";
import { StepProps } from "../types";

export function HabitsStep({ form, update }: StepProps) {
  return (
    <StepSection title="USO DE TABACO">
      <ChoiceRow
        label="TABAGISMO"
        options={["Fuma", "Parou", "Nunca"]}
        selected={form.smoking}
        onSelect={(value) => update("smoking", value)}
        inline
      />
      <Counter
        label="COMEÇOU AOS"
        value={form.smokingStart}
        suffix="ANOS"
        onChange={(value) => update("smokingStart", value)}
      />
      <Counter
        label="PAROU AOS"
        value={form.smokingEnd}
        suffix="ANOS"
        onChange={(value) => update("smokingEnd", value)}
      />
      <Counter
        label="CIGARROS POR DIA"
        value={form.cigarettesPerDay}
        onChange={(value) => update("cigarettesPerDay", value)}
      />
      <SummaryRow
        label="CARGA TABÁGICA"
        value={`${form.cigarettesPerDay},6 anos-maço`}
      />
    </StepSection>
  );
}
