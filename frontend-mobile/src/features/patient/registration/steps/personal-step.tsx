import { View } from "react-native";
import { InputField, OptionRow, StepSection } from "../components";
import { StepProps } from "../types";
import { styles } from "../styles";

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
          onChangeText={(value) => update("birthDay", value)}
        />
        <InputField
          label="MÊS"
          value={form.birthMonth}
          onChangeText={(value) => update("birthMonth", value)}
        />
        <InputField
          label="ANO"
          value={form.birthYear}
          onChangeText={(value) => update("birthYear", value)}
        />
      </View>
      <InputField
        label="PRONTUÁRIO"
        value={form.record}
        placeholder="10482"
        onChangeText={(value) => update("record", value)}
      />
      <OptionRow
        label="STATUS DA PACIENTE"
        value={form.status}
        onChange={() => update("status", "Em investigação")}
      />
    </StepSection>
  );
}
