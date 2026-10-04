import { StepSection, SummaryRow } from "../../registration/components";
import { EmptyState } from "../components";
import type { TabProps } from "../types";

export function ObstetricTab({ record }: TabProps) {
  const { form } = record;

  if (record.missing.obstetric) {
    return <EmptyState title="Sem dados gineco-obstétricos registrados" />;
  }

  return (
    <>
      <StepSection title="HISTÓRIA OBSTÉTRICA">
        <SummaryRow label="GESTAÇÕES" value={String(form.pregnancies)} />
        <SummaryRow label="PARTOS NORMAIS" value={String(form.vaginalBirths)} />
        <SummaryRow label="CESARIANAS" value={String(form.cesareans)} />
        <SummaryRow label="ABORTOS" value={String(form.abortions)} />
      </StepSection>

      <StepSection title="CICLO MENSTRUAL">
        <SummaryRow label="MENARCA" value={`${form.menarche} anos`} />
        {/* Como no layout, a menopausa só aparece quando houve. */}
        {form.menopause ? (
          <SummaryRow label="MENOPAUSA" value={`${form.menopauseAge} anos`} />
        ) : null}
      </StepSection>
    </>
  );
}
