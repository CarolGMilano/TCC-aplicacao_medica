import { exclusiveIsts, totalSteps } from "./constants";
import type { PatientForm } from "./types";

export function getBirthDate(form: PatientForm) {
  const day = Number(form.birthDay);
  const month = Number(form.birthMonth);
  const year = Number(form.birthYear);

  if (!day || !month || form.birthYear.length !== 4) return null;

  const date = new Date(year, month - 1, day);
  const isValid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  return isValid && date <= new Date() ? date : null;
}

export function getAge(form: PatientForm) {
  const birthDate = getBirthDate(form);
  if (!birthDate) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayPending =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate());

  return birthdayPending ? age - 1 : age;
}

// Anos-maço = (cigarros por dia / 20) x anos fumando.
export function getSmokingLoad(form: PatientForm) {
  if (form.smoking === "Nunca") return "—";

  const end = form.smoking === "Fuma" ? getAge(form) : form.smokingEnd;
  const years = (end ?? 0) - form.smokingStart;
  const packs = form.cigarettesPerDay / 20;

  if (years <= 0 || packs <= 0) return "0 anos-maço";

  const load = Math.round(years * packs * 10) / 10;
  return `${String(load).replace(".", ",")} anos-maço`;
}

// "Nenhuma" e "Não sabe" excluem as demais opções.
export function toggleIst(current: string[], ist: string) {
  if (current.includes(ist)) return current.filter((item) => item !== ist);
  if (exclusiveIsts.includes(ist)) return [ist];
  return [...current.filter((item) => !exclusiveIsts.includes(item)), ist];
}

export function validateStep(step: number, form: PatientForm) {
  const age = getAge(form);

  switch (step) {
    case 1:
      if (!form.name.trim()) return "Informe o nome completo.";
      if (age === null) return "Informe uma data de nascimento válida.";
      if (age > 120) return "Confira o ano de nascimento.";
      if (!form.record.trim()) return "Informe o número do prontuário.";
      return null;
    case 2:
      if (age !== null && form.menarche > age)
        return "A menarca não pode ser maior que a idade da paciente.";
      if (form.menopause && form.menopauseAge <= form.menarche)
        return "A idade da menopausa deve ser maior que a da menarca.";
      if (form.menopause && age !== null && form.menopauseAge > age)
        return "A menopausa não pode ser maior que a idade da paciente.";
      return null;
    case 3:
      if (age !== null && form.sexarche > age)
        return "A sexarca não pode ser maior que a idade da paciente.";
      return null;
    case 4:
      return form.ists.length ? null : "Selecione ao menos uma opção.";
    case 5:
      if (form.smoking === "Nunca") return null;
      if (age !== null && form.smokingStart > age)
        return "A idade de início não pode ser maior que a da paciente.";
      if (form.smoking === "Parou" && form.smokingEnd < form.smokingStart)
        return "A idade em que parou deve ser maior que a de início.";
      if (form.smoking === "Parou" && age !== null && form.smokingEnd > age)
        return "A idade em que parou não pode ser maior que a da paciente.";
      if (form.cigarettesPerDay <= 0) return "Informe os cigarros por dia.";
      return null;
    default:
      return null;
  }
}

// Revalida tudo antes do envio, caso alguma etapa tenha sido alterada.
export function validateForm(form: PatientForm) {
  for (let step = 1; step < totalSteps; step += 1) {
    const error = validateStep(step, form);
    if (error) return { step, error };
  }
  return null;
}
