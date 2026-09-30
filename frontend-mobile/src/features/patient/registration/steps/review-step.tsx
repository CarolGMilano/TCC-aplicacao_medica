import { View } from "react-native";
import { ReviewBlock } from "../components";
import { PatientForm } from "../types";
import { styles } from "../styles";

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
