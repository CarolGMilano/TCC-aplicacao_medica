import { StepSection, SummaryRow } from "../../registration/components";
import type { TabProps } from "../types";
import { formatBirthDate } from "../utils";

export function PersonalTab({ record }: TabProps) {
  const { form } = record;

  return (
    <>
      <StepSection title="IDENTIFICAÇÃO">
        <SummaryRow label="NOME COMPLETO" value={form.name} />
        <SummaryRow
          label="DATA DE NASCIMENTO"
          value={formatBirthDate(record)}
        />
        <SummaryRow label="IDADE CALCULADA" value={`${record.age} anos`} />
        <SummaryRow label="PRONTUÁRIO" value={form.record} />
      </StepSection>

      <StepSection title="ACOMPANHAMENTO">
        <SummaryRow label="STATUS DA PACIENTE" value={form.status} />
      </StepSection>
    </>
  );
}
