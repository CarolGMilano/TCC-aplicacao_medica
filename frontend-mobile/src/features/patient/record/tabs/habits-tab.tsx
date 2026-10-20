import { FieldRow, StepSection, SummaryRow } from "../../registration/components";
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
    <StepSection title="Uso de tabaco">
      <SummaryRow label="Tabagismo" value={smokingLabels[form.smoking]} />
      {smokes ? (
        <>
          <FieldRow>
            <SummaryRow label="Começou aos" value={`${form.smokingStart} anos`} />
            {form.smoking === "Parou" ? (
              <SummaryRow label="Parou aos" value={`${form.smokingEnd} anos`} />
            ) : null}
          </FieldRow>
          <FieldRow>
            <SummaryRow
              label="Cigarros por dia"
              value={String(form.cigarettesPerDay)}
            />
            <SummaryRow label="Carga tabágica" value={getSmokingLoad(form)} />
          </FieldRow>
        </>
      ) : null}
    </StepSection>
  );
}
