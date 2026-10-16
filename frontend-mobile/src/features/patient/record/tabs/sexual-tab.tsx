import { StepSection, SummaryRow } from "../../registration/components";
import { EmptyState } from "../components";
import type { TabProps } from "../types";
import { yesNo } from "../utils";

export function SexualTab({ record }: TabProps) {
  const { form } = record;

  if (record.missing.sexual) {
    return <EmptyState title="Sem dados sexuais registrados" />;
  }

  return (
    <>
      <StepSection title="INÍCIO DA VIDA SEXUAL">
        <SummaryRow label="SEXARCA" value={`${form.sexarche} anos`} />
        <SummaryRow label="VVS" value={yesNo(form.vvs)} />
      </StepSection>

      <StepSection title="CONTRACEPÇÃO E PARCEIROS">
        <SummaryRow label="MAC" value={form.contraception} />
        <SummaryRow label="Nº DE PARCEIROS" value={String(form.partners)} />
      </StepSection>
    </>
  );
}
