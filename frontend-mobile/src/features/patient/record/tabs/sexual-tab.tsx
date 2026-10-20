import { FieldRow, StepSection, SummaryRow } from "../../registration/components";
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
      <StepSection title="Início da vida sexual">
        <FieldRow>
          <SummaryRow label="Sexarca" value={`${form.sexarche} anos`} />
          <SummaryRow label="VVS" value={yesNo(form.vvs)} />
        </FieldRow>
      </StepSection>

      <StepSection title="Contracepção e parceiros">
        <SummaryRow label="MAC" value={form.contraception} />
        <SummaryRow label="Nº de parceiros" value={String(form.partners)} />
      </StepSection>
    </>
  );
}
