import { View } from "react-native";

import {
  InputField,
  OptionRow,
  StepSection,
  SummaryRow,
} from "../components";
import { StepProps } from "../types";
import { styles } from "../styles";

const statusOptions = [
  "Em investigação",
  "Em tratamento",
  "Aguardando procedimento",
  "Pós-procedimento",
  "Acompanhamento preventivo",
  "Alta",
];

function calculateAge(day: string, month: string, year: string) {
  const birthDay = Number(day);
  const birthMonth = Number(month);
  const birthYear = Number(year);

  if (!birthDay || !birthMonth || !birthYear) {
    return "—";
  }

  const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
  const isValidDate =
    birthDate.getFullYear() === birthYear &&
    birthDate.getMonth() === birthMonth - 1 &&
    birthDate.getDate() === birthDay;

  if (!isValidDate || birthDate > new Date()) {
    return "—";
  }

  const today = new Date();
  let age = today.getFullYear() - birthYear;
  const birthdayHasNotHappened =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate());

  if (birthdayHasNotHappened) {
    age -= 1;
  }

  return `${age} anos`;
}

export function PersonalStep({ form, update }: StepProps) {
  return (
    <StepSection title="IDENTIFICAÇÃO">
      <InputField
        label="NOME COMPLETO"
        value={form.name}
        placeholder="Cláudia Nunes"
        onChangeText={(value) => update("name", value)}
      />
      <View style={styles.dateRow}>
        <InputField
          label="DIA"
          value={form.birthDay}
          keyboardType="number-pad"
          maxLength={2}
          containerStyle={styles.dateDay}
          onChangeText={(value) => update("birthDay", value)}
        />
        <InputField
          label="MÊS"
          value={form.birthMonth}
          keyboardType="number-pad"
          maxLength={2}
          containerStyle={styles.dateMonth}
          onChangeText={(value) => update("birthMonth", value)}
        />
        <InputField
          label="ANO"
          value={form.birthYear}
          keyboardType="number-pad"
          maxLength={4}
          containerStyle={styles.dateYear}
          onChangeText={(value) => update("birthYear", value)}
        />
      </View>
      <SummaryRow
        label="IDADE CALCULADA"
        value={calculateAge(form.birthDay, form.birthMonth, form.birthYear)}
      />
      <InputField
        label="PRONTUÁRIO"
        value={form.record}
        placeholder="10482"
        onChangeText={(value) => update("record", value)}
      />
      <OptionRow
        label="STATUS DA PACIENTE"
        value={form.status}
        options={statusOptions}
        onChange={(value) => update("status", value)}
      />
    </StepSection>
  );
}
