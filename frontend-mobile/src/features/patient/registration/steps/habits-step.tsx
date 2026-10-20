import {
  ChoiceRow,
  Counter,
  FieldRow,
  StepSection,
  SummaryRow,
} from "../components";
import { minAges, smokingOptions } from "../constants";
import type { SmokingStatus, StepProps } from "../types";
import { getAge, getSmokingEnd, getSmokingLoad } from "../utils";

export function HabitsStep({ form, update }: StepProps) {
  const smokes = form.smoking !== "Nunca";
  const age = getAge(form) ?? undefined;
  const stopped = form.smoking === "Parou";

  return (
    <StepSection title="Uso de tabaco">
      <ChoiceRow
        label="Tabagismo"
        options={smokingOptions}
        selected={form.smoking}
        onSelect={(value) => {
          update("smoking", value as SmokingStatus);
          // "Parou aos" começa dentro da faixa: entre o início e a idade atual.
          if (value === "Parou") update("smokingEnd", getSmokingEnd(form));
        }}
      />
      {smokes ? (
        <>
          <FieldRow>
            <Counter
              label="Começou aos"
              value={form.smokingStart}
              min={minAges.smoking}
              max={age}
              suffix="anos"
              onChange={(value) => update("smokingStart", value)}
            />
            {stopped ? (
              <Counter
                label="Parou aos"
                value={form.smokingEnd}
                min={Math.max(minAges.smoking, form.smokingStart)}
                max={age}
                suffix="anos"
                onChange={(value) => update("smokingEnd", value)}
              />
            ) : null}
          </FieldRow>
          <FieldRow>
            <Counter
              label="Cigarros por dia"
              value={form.cigarettesPerDay}
              max={200}
              onChange={(value) => update("cigarettesPerDay", value)}
            />
            <SummaryRow label="Carga tabágica" value={getSmokingLoad(form)} />
          </FieldRow>
        </>
      ) : null}
    </StepSection>
  );
}
