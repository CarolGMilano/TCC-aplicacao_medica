import { StepSection, SummaryRow } from "../../registration/components";
import { EmptyState } from "../components";
import type { TabProps } from "../types";
import { yesNo } from "../utils";

export function IstTab({ record }: TabProps) {
  const { form } = record;

  if (record.missing.ist) {
    return <EmptyState title="Sem histórico de IST registrado" />;
  }

  return (
    <StepSection title="Histórico de IST">
      <SummaryRow label="ISTs" value={form.ists.join(" · ")} />
      {form.ists.includes("HPV") ? (
        <SummaryRow label="Condiloma HPV" value={yesNo(form.hpvWart)} />
      ) : null}
    </StepSection>
  );
}
