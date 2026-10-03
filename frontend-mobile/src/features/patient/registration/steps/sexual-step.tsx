import { Counter, OptionRow, StepSection, ToggleRow } from "../components";
import { StepProps } from "../types";

const contraceptionOptions = [
  "Anticoncepcional oral combinado",
  "Anticoncepcional oral progestagênio isolado",
  "Implante de etonogestrel",
  "DIU hormonal",
  "DIU não hormonal",
  "Laqueadura tubária",
  "Anel vaginal",
  "Adesivo transdérmico",
  "Preservativo",
  "Nenhum",
];

export function SexualStep({ form, update }: StepProps) {
  return (
    <StepSection title="INÍCIO DA VIDA SEXUAL">
      <Counter
        label="SEXARCA"
        value={form.sexarche}
        suffix="ANOS"
        onChange={(value) => update("sexarche", value)}
      />
      <ToggleRow
        label="VVS"
        value={form.multiplePartners}
        onChange={(value) => update("multiplePartners", value)}
      />
      <StepSection title="CONTRACEPÇÃO E PARCEIROS">
        <OptionRow
          label="MAC"
          value={form.contraception}
          options={contraceptionOptions}
          onChange={(value) => update("contraception", value)}
        />
        <Counter
          label="Nº DE PARCEIROS"
          value={form.partners}
          onChange={(value) => update("partners", value)}
        />
      </StepSection>
    </StepSection>
  );
}
