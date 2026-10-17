import { exclusiveIsts, minAges, totalSteps } from "./constants";
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

// Erro da data de nascimento, mostrado já durante a digitação.
// Retorna null enquanto a data estiver incompleta e sem erro aparente.
export function getBirthDateError(form: PatientForm) {
  const day = Number(form.birthDay);
  const month = Number(form.birthMonth);

  if (form.birthDay.length === 2 && (day < 1 || day > 31))
    return "Dia inválido.";
  if (form.birthMonth.length === 2 && (month < 1 || month > 12))
    return "Mês inválido.";
  if (form.birthYear.length !== 4 || !form.birthDay || !form.birthMonth)
    return null;

  const date = new Date(Number(form.birthYear), month - 1, day);
  if (date.getMonth() !== month - 1) return "Essa data não existe.";
  if (date > new Date()) return "A data não pode ser no futuro.";

  const age = getAge(form);
  if (age !== null && age > 120) return "Confira o ano de nascimento.";
  return null;
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

// Coloca o valor dentro da faixa do contador. Se a faixa for impossível
// (min > max), fica no máximo e a validação da etapa avisa.
export function clamp(value: number, min: number, max?: number) {
  const atLeastMin = Math.max(value, min);
  return max === undefined ? atLeastMin : Math.min(atLeastMin, max);
}

export function getMenopauseAge(form: PatientForm) {
  const min = Math.max(minAges.menopause, form.menarche + 1);
  return clamp(form.menopauseAge, min, getAge(form) ?? undefined);
}

export function getSmokingEnd(form: PatientForm) {
  const min = Math.max(minAges.smoking, form.smokingStart);
  return clamp(form.smokingEnd, min, getAge(form) ?? undefined);
}

// Os valores iniciais (menopausa 45, sexarca 17, tabagismo 18) podem passar da
// idade da paciente, e aí o "+" do contador já começa travado. Chamado quando a
// idade passa a valer (ou muda), põe cada contador de idade na sua faixa.
export function fitAgesToPatient(form: PatientForm): PatientForm {
  const age = getAge(form);
  if (age === null) return form;

  const menarche = clamp(form.menarche, minAges.menarche, age);
  const smokingStart = clamp(form.smokingStart, minAges.smoking, age);
  const fitted = { ...form, menarche, smokingStart };

  return {
    ...fitted,
    menopauseAge: getMenopauseAge(fitted),
    sexarche: clamp(form.sexarche, minAges.sexarche, age),
    smokingEnd: getSmokingEnd(fitted),
  };
}

// Anos-maço =(cigarros por dia / 20) x anos fumando.
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

// Na ficha, saved são os dados já gravados: um valor abaixo do mínimo que
// veio de lá (o web aceita) não trava a aba, só um valor novo é recusado.
export function validateStep(
  step: number,
  form: PatientForm,
  saved?: PatientForm,
) {
  const age = getAge(form);
  // Com a paciente mais nova que o mínimo, o contador fica travado: o erro
  // está na data de nascimento.
  const birthHint = (min: number) =>
    age !== null && age < min ? " Confira a data de nascimento." : "";
  const belowMin = (
    key: "menarche" | "sexarche" | "smokingStart",
    min: number,
  ) => form[key] < min && form[key] !== saved?.[key];

  switch (step) {
    case 1:
      if (!form.name.trim()) return "Informe o nome completo.";
      if (/\d/.test(form.name)) return "O nome não pode ter números.";
      if (getBirthDateError(form)) return getBirthDateError(form);
      if (age === null) return "Informe uma data de nascimento válida.";
      if (!form.record.trim()) return "Informe o número do prontuário.";
      return null;
    case 2:
      if (belowMin("menarche", minAges.menarche))
        return `A menarca deve ser de pelo menos ${minAges.menarche} anos.${birthHint(minAges.menarche)}`;
      if (age !== null && form.menarche > age)
        return "A menarca não pode ser maior que a idade da paciente.";
      if (form.menopause && form.menopauseAge <= form.menarche)
        return "A idade da menopausa deve ser maior que a da menarca.";
      if (form.menopause && age !== null && form.menopauseAge > age)
        return "A menopausa não pode ser maior que a idade da paciente.";
      return null;
    case 3:
      if (belowMin("sexarche", minAges.sexarche))
        return `A sexarca deve ser de pelo menos ${minAges.sexarche} anos.${birthHint(minAges.sexarche)}`;
      if (age !== null && form.sexarche > age)
        return "A sexarca não pode ser maior que a idade da paciente.";
      return null;
    case 4:
      return form.ists.length ? null : "Selecione ao menos uma opção.";
    case 5:
      if (form.smoking === "Nunca") return null;
      if (belowMin("smokingStart", minAges.smoking))
        return `A idade de início deve ser de pelo menos ${minAges.smoking} anos.${birthHint(minAges.smoking)}`;
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
