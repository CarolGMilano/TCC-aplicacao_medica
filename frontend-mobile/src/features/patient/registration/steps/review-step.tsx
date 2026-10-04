import { View } from "react-native";

import { ReviewBlock } from "../components";
import { styles } from "../styles";
import type { PatientForm, SmokingStatus } from "../types";
import { getAge, getSmokingLoad } from "../utils";

type ReviewStepProps = {
  form: PatientForm;
  onEdit: (step: number) => void;
};

const yesNo = (value: boolean) => (value ? "sim" : "não");

const smokingLabels: Record<SmokingStatus, string> = {
  Fuma: "Fumante",
  Parou: "Ex-fumante",
  Nunca: "Nunca fumou",
};

function smokingDetail(form: PatientForm) {
  if (form.smoking === "Nunca") return undefined;

  const period =
    form.smoking === "Parou"
      ? `dos ${form.smokingStart} aos ${form.smokingEnd} anos`
      : `desde os ${form.smokingStart} anos`;

  return `${period} · ${form.cigarettesPerDay} cigarros/dia · ${getSmokingLoad(form)}`;
}

export function ReviewStep({ form, onEdit }: ReviewStepProps) {
  const age = getAge(form);
  const birthDate = `${form.birthDay.padStart(2, "0")}/${form.birthMonth.padStart(2, "0")}/${form.birthYear}`;

  return (
    <View style={styles.review}>
      <ReviewBlock
        title="PESSOAIS"
        value={`${form.name.trim()} · ${birthDate} · ${age ?? "—"} anos`}
        detail={`PRT ${form.record} · ${form.status.toLowerCase()}`}
        onEdit={() => onEdit(1)}
      />
      <ReviewBlock
        title="GINECO-OBSTÉTRICOS"
        value={`G${form.pregnancies} · PN${form.vaginalBirths} · C${form.cesareans} · A${form.abortions}`}
        detail={`Menarca ${form.menarche} anos · ${
          form.menopause
            ? `menopausa aos ${form.menopauseAge}`
            : "sem menopausa"
        }`}
        onEdit={() => onEdit(2)}
      />
      <ReviewBlock
        title="SEXUAIS"
        value={`Sexarca ${form.sexarche} anos · VVS ${yesNo(form.vvs)}`}
        detail={`${form.partners} parceiros · MAC ${form.contraception.toLowerCase()}`}
        onEdit={() => onEdit(3)}
      />
      <ReviewBlock
        title="IST"
        value={form.ists.join(" · ")}
        detail={
          form.ists.includes("HPV")
            ? `Condiloma ${yesNo(form.hpvWart)}`
            : undefined
        }
        onEdit={() => onEdit(4)}
      />
      <ReviewBlock
        title="HÁBITOS"
        value={smokingLabels[form.smoking]}
        detail={smokingDetail(form)}
        onEdit={() => onEdit(5)}
      />
    </View>
  );
}
