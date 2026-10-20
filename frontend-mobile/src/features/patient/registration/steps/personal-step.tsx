import {
  DateField,
  FieldRow,
  InputField,
  OptionRow,
  StepSection,
} from "../components";
import { statusOptions } from "../constants";
import type { StepProps } from "../types";
import { getAge, getBirthDateError } from "../utils";

export function PersonalStep({ form, update }: StepProps) {
  const age = getAge(form);
  const dateError = getBirthDateError(form);

  return (
    <>
      <StepSection title="Identificação">
        <InputField
          label="Nome completo"
          value={form.name}
          placeholder="Nome da paciente"
          maxLength={45}
          onChangeText={(value) => update("name", value)}
        />
        <FieldRow>
          {/* A idade calculada fica abaixo da data, em vez de uma linha
              própria. */}
          <DateField
            label="Data de nascimento"
            value={[form.birthDay, form.birthMonth, form.birthYear]}
            onChange={([day, month, year]) => {
              update("birthDay", day);
              update("birthMonth", month);
              update("birthYear", year);
            }}
            hint={age === null ? null : `Idade: ${age} anos`}
            error={dateError}
          />
          <InputField
            label="Prontuário"
            value={form.record}
            placeholder="Número"
            maxLength={50}
            onChangeText={(value) => update("record", value)}
          />
        </FieldRow>
      </StepSection>

      <StepSection title="Acompanhamento">
        <OptionRow
          label="Status da paciente"
          value={form.status}
          options={statusOptions}
          onChange={(value) => update("status", value)}
        />
      </StepSection>
    </>
  );
}
