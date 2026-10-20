import { FieldRow, StepSection, SummaryRow } from "../../registration/components";
import type { TabProps } from "../types";
import { formatBirthDate } from "../utils";

export function PersonalTab({ record }: TabProps) {
  const { form } = record;

  return (
    <>
      <StepSection title="Identificação">
        <SummaryRow label="Nome completo" value={form.name} />
        <FieldRow>
          <SummaryRow
            label="Data de nascimento"
            value={formatBirthDate(record)}
          />
          <SummaryRow label="Idade" value={`${record.age} anos`} />
        </FieldRow>
        <SummaryRow label="Prontuário" value={form.record} />
      </StepSection>

      <StepSection title="Acompanhamento">
        <SummaryRow label="Status da paciente" value={form.status} />
      </StepSection>
    </>
  );
}
