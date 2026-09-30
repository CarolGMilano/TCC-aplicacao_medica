import { View } from "react-native";

import {
  ChoiceRow,
  Counter,
  InputField,
  OptionRow,
  ReviewBlock,
  StepSection,
  SummaryRow,
  ToggleRow,
} from "./controls";
import type { PatientForm, StepProps } from "./types";
import { styles } from "./styles";

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

export function ObstetricStep({ form, update }: StepProps) {
  return (
    <StepSection title="HISTÓRIA OBSTÉTRICA">
      <Counter
        label="GESTAÇÕES"
        value={form.pregnancies}
        onChange={(value) => update("pregnancies", value)}
      />
      <Counter
        label="PARTOS NORMAIS"
        value={form.vaginalBirths}
        onChange={(value) => update("vaginalBirths", value)}
      />
      <Counter
        label="CESARIANAS"
        value={form.cesareans}
        onChange={(value) => update("cesareans", value)}
      />
      <Counter
        label="ABORTOS"
        value={form.abortions}
        onChange={(value) => update("abortions", value)}
      />
      <StepSection title="CICLO MENSTRUAL">
        <Counter
          label="MENARCA"
          value={form.menarche}
          suffix="ANOS"
          onChange={(value) => update("menarche", value)}
        />
        <ToggleRow
          label="MENOPAUSA"
          value={form.menopause}
          onChange={(value) => update("menopause", value)}
        />
      </StepSection>
    </StepSection>
  );
}

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
          onChange={() => update("contraception", "DIU")}
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

export function IstStep({ form, update }: StepProps) {
  return (
    <StepSection title="HISTÓRICO DE IST">
      <ChoiceRow
        label="ISTS"
        options={[
          "HPV",
          "HIV",
          "Herpes genital",
          "Tricomoníase",
          "Gonorreia",
          "Clamídia",
          "Sífilis",
          "Não sabe",
          "Nenhuma",
        ]}
        selected={form.ist}
        onSelect={(value) => update("ist", value)}
      />
      <ToggleRow
        label="CONDILOMA HPV"
        value={form.hpvWart}
        onChange={(value) => update("hpvWart", value)}
      />
    </StepSection>
  );
}

export function HabitsStep({ form, update }: StepProps) {
  return (
    <StepSection title="USO DE TABACO">
      <ChoiceRow
        label="TABAGISMO"
        options={["Fuma", "Parou", "Nunca"]}
        selected={form.smoking}
        onSelect={(value) => update("smoking", value)}
      />
      <Counter
        label="COMEÇOU AOS"
        value={form.smokingStart}
        suffix="ANOS"
        onChange={(value) => update("smokingStart", value)}
      />
      <Counter
        label="PAROU AOS"
        value={form.smokingEnd}
        suffix="ANOS"
        onChange={(value) => update("smokingEnd", value)}
      />
      <Counter
        label="CIGARROS POR DIA"
        value={form.cigarettesPerDay}
        onChange={(value) => update("cigarettesPerDay", value)}
      />
      <SummaryRow
        label="CARGA TABÁGICA"
        value={`${form.cigarettesPerDay},6 anos-maço`}
      />
    </StepSection>
  );
}

export function ReviewStep({ form }: { form: PatientForm }) {
  return (
    <View style={styles.review}>
      <ReviewBlock
        title="PESSOAIS"
        value={`${form.name || "Cláudia Nunes"} · ${form.birthDay || "14"}/${form.birthMonth || "03"}/${form.birthYear || "1984"}`}
        detail={`PRT ${form.record || "10482"} · ${form.status.toLowerCase()}`}
      />
      <ReviewBlock
        title="GINECO-OBSTÉTRICOS"
        value={`G${form.pregnancies} · PN${form.vaginalBirths} · C${form.cesareans} · A${form.abortions}`}
        detail={`Menarca ${form.menarche} anos · ${form.menopause ? "menopausa" : "sem menopausa"}`}
      />
      <ReviewBlock
        title="SEXUAIS"
        value={`Sexarca ${form.sexarche} anos · VVS ${form.multiplePartners ? "sim" : "não"}`}
        detail={`${form.partners} parceiros · MAC ${form.contraception.toLowerCase()}`}
      />
      <ReviewBlock
        title="IST"
        value={form.ist}
        detail={`Condiloma ${form.hpvWart ? "sim" : "não"}`}
      />
      <ReviewBlock
        title="HÁBITOS"
        value={form.smoking}
        detail={`dos ${form.smokingStart} aos ${form.smokingEnd} anos · ${form.cigarettesPerDay} cigarros/dia`}
      />
    </View>
  );
}
