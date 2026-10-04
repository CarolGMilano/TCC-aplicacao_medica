import { StepSection, SummaryRow } from "../../registration/components";
import { getSmokingLoad } from "../../registration/utils";
import { EmptyState } from "../components";
import type { TabProps } from "../types";

const smokingLabels = {
  Fuma: "Fumante",
  Parou: "Ex-fumante",
  Nunca: "Nunca fumou",
};

export function HabitsTab({ record }: TabProps) {
  const { form } = record;
  const smokes = form.smoking !== "Nunca";

  if (record.missing.habits) {
    return <EmptyState title="Sem dados de tabagismo registrados" />;
  }

  return (
    <StepSection title="USO DE TABACO">
      <SummaryRow label="TABAGISMO" value={smokingLabels[form.smoking]} />
      {smokes ? (
        <SummaryRow label="COMEÇOU AOS" value={`${form.smokingStart} anos`} />
      ) : null}
      {form.smoking === "Parou" ? (
        <SummaryRow label="PAROU AOS" value={`${form.smokingEnd} anos`} />
      ) : null}
      {smokes ? (
        <>
          <SummaryRow
            label="CIGARROS POR DIA"
            value={String(form.cigarettesPerDay)}
          />
          <SummaryRow label="CARGA TABÁGICA" value={getSmokingLoad(form)} />
        </>
      ) : null}
    </StepSection>
  );
}
