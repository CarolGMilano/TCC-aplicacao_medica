import { View } from "react-native";

import { ThemedText } from "@/components/shared/themed-text";

import { InputField, OptionRow, StepSection, SummaryRow } from "../components";
import { statusOptions } from "../constants";
import { styles } from "../styles";
import type { StepProps } from "../types";
import { getAge } from "../utils";

// Mantém só dígitos nos campos numéricos (o teclado aceita colar texto).
const digits = (value: string) => value.replace(/\D/g, "");

export function PersonalStep({ form, update }: StepProps) {
  const age = getAge(form);

  return (
    <>
      <StepSection title="IDENTIFICAÇÃO">
        <InputField
          label="NOME COMPLETO"
          value={form.name}
          placeholder="Nome da paciente"
          maxLength={45}
          onChangeText={(value) => update("name", value)}
        />
        {/* Um único rótulo para os três campos, como no layout. */}
        <View style={styles.dateField}>
          <ThemedText type="code" themeColor="textSecondary">
            DATA DE NASCIMENTO
          </ThemedText>
          <View style={styles.dateRow}>
            <InputField
              value={form.birthDay}
              placeholder="DD"
              keyboardType="number-pad"
              maxLength={2}
              containerStyle={styles.dateDay}
              inputStyle={styles.dateInput}
              onChangeText={(value) => update("birthDay", digits(value))}
            />
            <InputField
              value={form.birthMonth}
              placeholder="MM"
              keyboardType="number-pad"
              maxLength={2}
              containerStyle={styles.dateMonth}
              inputStyle={styles.dateInput}
              onChangeText={(value) => update("birthMonth", digits(value))}
            />
            <InputField
              value={form.birthYear}
              placeholder="AAAA"
              keyboardType="number-pad"
              maxLength={4}
              containerStyle={styles.dateYear}
              inputStyle={styles.dateInput}
              onChangeText={(value) => update("birthYear", digits(value))}
            />
          </View>
        </View>
        <SummaryRow
          label="IDADE CALCULADA"
          value={age === null ? "—" : `${age} anos`}
        />
        <InputField
          label="PRONTUÁRIO"
          value={form.record}
          placeholder="Número do prontuário"
          keyboardType="number-pad"
          maxLength={50}
          onChangeText={(value) => update("record", digits(value))}
        />
      </StepSection>

      <StepSection title="ACOMPANHAMENTO">
        <OptionRow
          label="STATUS DA PACIENTE"
          value={form.status}
          options={statusOptions}
          onChange={(value) => update("status", value)}
        />
      </StepSection>
    </>
  );
}
