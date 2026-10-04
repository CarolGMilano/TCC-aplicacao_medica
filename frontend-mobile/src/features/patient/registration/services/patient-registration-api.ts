import { getToken } from "@/features/auth/auth-session";
import { API_BASE_URL } from "@/features/auth/services/auth-api";

import { contraceptionMap, istMap, smokingMap, statusMap } from "../constants";
import type { PatientForm } from "../types";

export type PatientRegistration = {
  paciente: {
    nome: string;
    dataNascimento: string;
    prontuario: string;
    status: string;
  };
  dadosGinecoObstetricos: {
    numGestacao: number;
    numPartoNormal: number;
    numCesariana: number;
    numAborto: number;
    menarca: number;
    menopausa: number | null;
  };
  saudeSexual: {
    sexarca: number;
    mac: string;
    numParceiros: number;
    vvs: boolean;
  };
  historicoTabagismo: {
    cigarrosDia: number;
    idadeInicio: number | null;
    idadeFim: number | null;
    fumante: string;
  };
  historicoIst: {
    ist: string;
    condilomaHpv: boolean;
  }[];
};

export function toPatientRegistration(form: PatientForm): PatientRegistration {
  const smokes = form.smoking !== "Nunca";

  return {
    paciente: {
      nome: form.name.trim(),
      dataNascimento: `${form.birthYear}-${form.birthMonth.padStart(2, "0")}-${form.birthDay.padStart(2, "0")}`,
      prontuario: form.record.trim(),
      status: statusMap[form.status],
    },
    dadosGinecoObstetricos: {
      numGestacao: form.pregnancies,
      numPartoNormal: form.vaginalBirths,
      numCesariana: form.cesareans,
      numAborto: form.abortions,
      menarca: form.menarche,
      menopausa: form.menopause ? form.menopauseAge : null,
    },
    saudeSexual: {
      sexarca: form.sexarche,
      mac: contraceptionMap[form.contraception],
      numParceiros: form.partners,
      vvs: form.vvs,
    },
    historicoTabagismo: {
      cigarrosDia: smokes ? form.cigarettesPerDay : 0,
      idadeInicio: smokes ? form.smokingStart : null,
      idadeFim: form.smoking === "Parou" ? form.smokingEnd : null,
      fumante: smokingMap[form.smoking],
    },
    historicoIst: form.ists.map((ist) => ({
      ist: istMap[ist],
      condilomaHpv: ist === "HPV" && form.hpvWart,
    })),
  };
}

export async function registerPatient(form: PatientForm): Promise<void> {
  const token = getToken();

  if (!token) {
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  const response = await fetch(`${API_BASE_URL}/api/pacientes/completo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(toPatientRegistration(form)),
  });

  if (response.ok) return;

  if (response.status === 401 || response.status === 403) {
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  if (response.status === 409) {
    throw new Error("Já existe uma paciente com este prontuário.");
  }

  throw new Error("Não foi possível cadastrar a paciente.");
}
