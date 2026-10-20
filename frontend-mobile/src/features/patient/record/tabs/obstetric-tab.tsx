import { FieldRow, StepSection, SummaryRow } from "../../registration/components";
import { EmptyState } from "../components";
import type { TabProps } from "../types";

export function ObstetricTab({ record }: TabProps) {
  const { form } = record;

  if (record.missing.obstetric) {
    return <EmptyState title="Sem dados gineco-obstétricos registrados" />;
  }

  return (
    <>
      <StepSection title="História obstétrica">
        <FieldRow>
          <SummaryRow label="Gestações" value={String(form.pregnancies)} />
          <SummaryRow
            label="Partos normais"
            value={String(form.vaginalBirths)}
          />
        </FieldRow>
        <FieldRow>
          <SummaryRow label="Cesarianas" value={String(form.cesareans)} />
          <SummaryRow label="Abortos" value={String(form.abortions)} />
        </FieldRow>
      </StepSection>

      <StepSection title="Ciclo menstrual">
        <FieldRow>
          <SummaryRow label="Menarca" value={`${form.menarche} anos`} />
          {/* Como no layout, a menopausa só aparece quando houve. */}
          {form.menopause ? (
            <SummaryRow label="Menopausa" value={`${form.menopauseAge} anos`} />
          ) : null}
        </FieldRow>
      </StepSection>
    </>
  );
}
