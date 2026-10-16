import { ChoiceRow, Counter, StepSection, SummaryRow } from "../components";
import { minAges, smokingOptions } from "../constants";
import type { SmokingStatus, StepProps } from "../types";
import { getAge, getSmokingLoad } from "../utils";

export function HabitsStep({ form, update }: StepProps) {
  const smokes = form.smoking !== "Nunca";
  const age = getAge(form) ?? undefined;
  const stopped = form.smoking === "Parou";

  return (
    <StepSection title="USO DE TABACO">
      <ChoiceRow
        label="TABAGISMO"
        options={smokingOptions}
        selected={form.smoking}
        onSelect={(value) => update("smoking", value as SmokingStatus)}
        inline
      />
      {smokes ? (
        <Counter
          label="COMEÇOU AOS"
          value={form.smokingStart}
          min={minAges.smoking}
          max={stopped ? form.smokingEnd : age}
          suffix="ANOS"
          onChange={(value) => update("smokingStart", value)}
        />
      ) : null}
      {stopped ? (
        <Counter
          label="PAROU AOS"
          value={form.smokingEnd}
          min={Math.max(minAges.smoking, form.smokingStart)}
          max={age}
          suffix="ANOS"
          onChange={(value) => update("smokingEnd", value)}
        />
      ) : null}
      {smokes ? (
        <>
          <Counter
            label="CIGARROS POR DIA"
            value={form.cigarettesPerDay}
            max={200}
            onChange={(value) => update("cigarettesPerDay", value)}
          />
          <SummaryRow label="CARGA TABÁGICA" value={getSmokingLoad(form)} />
        </>
      ) : null}
    </StepSection>
  );
}
